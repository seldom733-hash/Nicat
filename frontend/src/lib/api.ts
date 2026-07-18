import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Dynamic API base URL - resolved at request time, not module load time
// This ensures the phone's IP is used when accessing from a different device
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:3000/api/v1`;
  }
  return 'http://localhost:3000/api/v1';
};

interface ApiResponse<T> {
  data: T;
  timestamp: string;
  path: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  country?: string;
  city?: string;
  stripeAccountId?: string;
  isStripeConnected: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  host: User;
  hostId: string;
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  difficulty: string;
  language: string;
  minGroupSize: number;
  maxGroupSize: number;
  basePrice: number;
  currency: string;
  commissionRate: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: string;
  isFeatured: boolean;
  bookingCount: number;
  averageRating: number;
  reviewCount: number;
  services?: string[];
  included?: string[];
  notIncluded?: string[];
  itinerary?: ItineraryItem[];
  media?: TourMedia[];
}

interface ItineraryItem {
  id: string;
  dayNumber: number;
  sortOrder: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

interface TourMedia {
  id: string;
  type: string;
  url: string;
  caption?: string;
  sortOrder: number;
}

interface Booking {
  id: string;
  bookingReference: string;
  user: User;
  userId: string;
  tour: Tour;
  tourId: string;
  numberOfPassengers: number;
  basePricePerPerson: number;
  commissionRate: number;
  commissionAmount: number;
  totalBasePrice: number;
  totalCommission: number;
  totalPrice: number;
  currency: string;
  status: string;
  tourDate: string;
  specialRequests?: string;
  passengers?: Passenger[];
  payments?: Payment[];
  createdAt: string;
}

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber?: string;
  email?: string;
  phone?: string;
  isLeadPassenger: boolean;
}

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  paidAt?: string;
  createdAt: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: string;
  tourId?: string;
  members?: User[];
  lastMessageAt?: string;
}

interface Message {
  id: string;
  chatRoomId: string;
  sender: User;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
}

interface Review {
  id: string;
  tourId: string;
  user: User;
  userId: string;
  rating: number;
  comment?: string;
  hostResponse?: string;
  isVerified: boolean;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface DashboardStats {
  tours: { total: number; active: number };
  bookings: { total: number };
  revenue: { total: number; net: number; commission: number };
}

// Создаем экземпляр axios
// Универсальная функция для извлечения данных из ответа NestJS TransformInterceptor
const unwrap = (res: any) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body && 'timestamp' in body) {
    return body.data;
  }
  return body;
};

// Создаем экземпляр axios - baseURL resolves dynamically per request
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to resolve baseURL dynamically on every request
// This fixes phone/network access where window.location.hostname differs from localhost
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Интерсептор для добавления токена
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const tokens = localStorage.getItem('tokens');
      if (tokens && tokens !== 'undefined') {
        try {
          const parsed = JSON.parse(tokens);
          if (parsed?.accessToken) {
            config.headers.Authorization = `Bearer ${parsed.accessToken}`;
          }
        } catch {
          localStorage.removeItem('tokens');
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обновления токена
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
          const { refreshToken } = JSON.parse(tokens);
          const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {
            refreshToken,
          });

          const refreshData = response.data;
          const accessToken = refreshData?.data?.accessToken || refreshData?.accessToken;
          localStorage.setItem(
            'tokens',
            JSON.stringify({ ...JSON.parse(tokens), accessToken })
          );

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('tokens');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const authApi = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return unwrap(response);
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return unwrap(response);
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return unwrap(response);
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

// ==================== Tours API ====================

export const toursApi = {
  search: async (params: SearchParams) => {
    const response = await api.get('/tours', { params });
    const d = unwrap(response);
    if (d && d.tours) return d.tours;
    return Array.isArray(d) ? d : [];
  },

  getById: async (id: string) => {
    const response = await api.get(`/tours/${id}`);
    return unwrap(response);
  },

  getFeatured: async (limit = 10) => {
    try {
      const response = await api.get('/tours/featured', {
        params: { limit },
      });
      const d = unwrap(response);
      return Array.isArray(d) ? d : [];
    } catch (err) {
      console.error('Failed to fetch featured tours:', err);
      return [];
    }
  },

  getMyTours: async (page = 1, limit = 10) => {
    const response = await api.get('/tours/my-tours', {
      params: { page, limit },
    });
    return unwrap(response);
  },

  create: async (data: CreateTourData) => {
    const response = await api.post('/tours', data);
    return unwrap(response);
  },

  update: async (id: string, data: Partial<CreateTourData>) => {
    const response = await api.put(`/tours/${id}`, data);
    return unwrap(response);
  },

  delete: async (id: string) => {
    await api.delete(`/tours/${id}`);
  },
};

// ==================== Bookings API ====================

export const bookingsApi = {
  create: async (data: CreateBookingData) => {
    const response = await api.post('/bookings', data);
    return unwrap(response);
  },

  getMyBookings: async (page = 1, limit = 10) => {
    const response = await api.get('/bookings', {
      params: { page, limit },
    });
    return unwrap(response);
  },

  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return unwrap(response);
  },

  updateStatus: async (id: string, data: { status: string; cancellationReason?: string }) => {
    const response = await api.put(`/bookings/${id}/status`, data);
    return unwrap(response);
  },

  addPassenger: async (bookingId: string, data: AddPassengerData) => {
    const response = await api.post(`/bookings/${bookingId}/passengers`, data);
    return unwrap(response);
  },

  removePassenger: async (bookingId: string, passengerId: string) => {
    const response = await api.put(`/bookings/${bookingId}/passengers/remove`, { passengerId });
    return unwrap(response);
  },

  cancel: async (bookingId: string, reason: string) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
    return unwrap(response);
  },
};

// ==================== Payments API ====================

export const paymentsApi = {
  initiate: async (bookingId: string, useCheckoutSession = false) => {
    const response = await api.post('/payments/initiate', {
      bookingId,
      useCheckoutSession,
    });
    return unwrap(response);
  },

  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/payments/history', {
      params: { page, limit },
    });
    return unwrap(response);
  },

  getByBookingId: async (bookingId: string) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return unwrap(response);
  },

  getStripeStatus: async () => {
    const response = await api.get('/payments/stripe/connect/status');
    return unwrap(response);
  },

  connectStripe: async (country?: string) => {
    const response = await api.post('/payments/stripe/connect', { country });
    return unwrap(response);
  },

  requestPayout: async (amount: number) => {
    const response = await api.post('/payments/payout', { amount });
    return unwrap(response);
  },
};

// ==================== Chat API ====================

export const chatApi = {
  createRoom: async (data: { name: string; tourId?: string; memberIds?: string[] }) => {
    const response = await api.post('/chat/rooms', data);
    return unwrap(response);
  },

  getRooms: async () => {
    const response = await api.get('/chat/rooms');
    return unwrap(response);
  },

  getRoom: async (roomId: string) => {
    const response = await api.get(`/chat/rooms/${roomId}`);
    return unwrap(response);
  },

  getMessages: async (roomId: string, page = 1, limit = 50) => {
    const response = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { page, limit },
    });
    return unwrap(response);
  },

  sendMessage: async (roomId: string, content: string) => {
    const response = await api.post(`/chat/rooms/${roomId}/messages`, {
      content,
    });
    return unwrap(response);
  },
};

// ==================== Reviews API ====================

export const reviewsApi = {
  getByTour: async (tourId: string, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/tour/${tourId}`, {
      params: { page, limit },
    });
    return unwrap(response);
  },

  create: async (data: { tourId: string; rating: number; comment?: string }) => {
    const response = await api.post('/reviews', data);
    return unwrap(response);
  },
};

// ==================== Dashboard API ====================

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return unwrap(response);
  },

  getTours: async (page = 1, limit = 10) => {
    const response = await api.get('/dashboard/tours', {
      params: { page, limit },
    });
    return unwrap(response);
  },

  getBookings: async (page = 1, limit = 10) => {
    const response = await api.get('/dashboard/bookings', {
      params: { page, limit },
    });
    return unwrap(response);
  },

  getRevenue: async (startDate: string, endDate: string) => {
    const response = await api.get('/dashboard/revenue', {
      params: { startDate, endDate },
    });
    return unwrap(response);
  },
};

// ==================== Search API ====================

export const searchApi = {
  search: async (params: SearchParams) => {
    const response = await api.get('/search', { params });
    return unwrap(response);
  },

  getDestinations: async (limit = 10) => {
    const response = await api.get('/search/destinations', {
      params: { limit },
    });
    return unwrap(response);
  },

  getCategories: async () => {
    const response = await api.get('/search/categories');
    return unwrap(response);
  },
};

export default api;

// ==================== Types ====================

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface SearchParams {
  q?: string;
  country?: string;
  city?: string;
  countries?: string;
  cities?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
  language?: string;
  services?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface CreateTourData {
  title: string;
  description: string;
  shortDescription?: string;
  country: string;
  city: string;
  address: string;
  category?: string;
  difficulty?: string;
  language?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  basePrice: number;
  currency?: string;
  commissionRate?: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  services?: string[];
  itinerary?: {
    dayNumber: number;
    sortOrder: number;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
  }[];
  media?: {
    url: string;
    caption?: string;
    sortOrder?: number;
  }[];
}

interface CreateBookingData {
  tourId: string;
  tourDate: string;
  numberOfPassengers: number;
  passengers: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    passportNumber?: string;
    email?: string;
    phone?: string;
  }[];
  specialRequests?: string;
}

interface AddPassengerData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber?: string;
  email?: string;
  phone?: string;
}

export type {
  User,
  Tour,
  Booking,
  Passenger,
  Payment,
  ChatRoom,
  Message,
  Review,
  DashboardStats,
  SearchParams,
  CreateTourData,
  CreateBookingData,
  AddPassengerData,
  PaginatedResponse,
};
