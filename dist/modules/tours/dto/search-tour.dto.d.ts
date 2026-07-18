import { TourCategory } from '../../../common/constants';
export declare class SearchTourDto {
    q?: string;
    country?: string;
    city?: string;
    countries?: string;
    cities?: string;
    category?: TourCategory;
    minPrice?: number;
    maxPrice?: number;
    durationDays?: number;
    language?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    services?: string;
    minDuration?: number;
    maxDuration?: number;
}
