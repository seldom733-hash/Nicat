import { create } from 'zustand';
import { User, Tour, Passenger } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem(
      'tokens',
      JSON.stringify({ accessToken, refreshToken })
    );
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

interface SearchState {
  filters: {
    q?: string;
    country?: string;
    city?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    durationDays?: number;
    language?: string;
  };
  setFilters: (filters: Partial<SearchState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  q: undefined,
  country: undefined,
  city: undefined,
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  durationDays: undefined,
  language: undefined,
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: { ...defaultFilters },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));

interface CartState {
  selectedTour: Tour | null;
  passengers: Passenger[];
  setSelectedTour: (tour: Tour) => void;
  addPassenger: (passenger: Passenger) => void;
  removePassenger: (index: number) => void;
  updatePassenger: (index: number, data: Partial<Passenger>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<CartState>((set) => ({
  selectedTour: null,
  passengers: [],

  setSelectedTour: (tour) => set({ selectedTour: tour }),

  addPassenger: (passenger) =>
    set((state) => ({ passengers: [...state.passengers, passenger] })),

  removePassenger: (index) =>
    set((state) => ({
      passengers: state.passengers.filter((_, i) => i !== index),
    })),

  updatePassenger: (index, data) =>
    set((state) => ({
      passengers: state.passengers.map((p, i) =>
        i === index ? { ...p, ...data } : p
      ),
    })),

  clearBooking: () => set({ selectedTour: null, passengers: [] }),
}));
