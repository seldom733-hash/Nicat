import { ToursService } from '../tours/tours.service';
export declare class SearchService {
    private readonly toursService;
    constructor(toursService: ToursService);
    searchTours(query: {
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
    }): Promise<{
        tours: import("../tours/entities").Tour[];
        total: number;
    }>;
    getPopularDestinations(limit?: number): Promise<{
        country: string;
        city: string;
        tourCount: number;
    }[]>;
    getCategories(): Promise<{
        category: string;
        label: string;
    }[]>;
}
