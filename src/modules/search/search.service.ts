import { Injectable } from '@nestjs/common';
import { ToursService } from '../tours/tours.service';

@Injectable()
export class SearchService {
  constructor(private readonly toursService: ToursService) {}

  async searchTours(query: {
    q?: string;
    country?: string;
    city?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    duration?: number;
    language?: string;
    difficulty?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    return this.toursService.search({
      country: query.country,
      city: query.city,
      category: query.category as any,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      durationDays: query.duration,
      language: query.language,
      startDate: query.startDate,
      endDate: query.endDate,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  async getPopularDestinations(limit = 10) {
    const tours = await this.toursService.getFeaturedTours(limit);
    return tours.map((tour) => ({
      country: tour.country,
      city: tour.city,
      tourCount: 1,
    }));
  }

  async getCategories() {
    return [
      { category: 'adventure', label: 'Adventure' },
      { category: 'cultural', label: 'Cultural' },
      { category: 'nature', label: 'Nature' },
      { category: 'city', label: 'City' },
      { category: 'beach', label: 'Beach' },
      { category: 'food', label: 'Food & Wine' },
      { category: 'photography', label: 'Photography' },
      { category: 'wellness', label: 'Wellness' },
      { category: 'family', label: 'Family' },
      { category: 'luxury', label: 'Luxury' },
    ];
  }
}
