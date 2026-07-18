import { TourCategory, DifficultyLevel } from '../../../common/constants';
export declare class CreateItineraryItemDto {
    dayNumber: number;
    sortOrder: number;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    notes?: string;
}
export declare class CreateTourMediaDto {
    url: string;
    caption?: string;
    sortOrder?: number;
}
export declare class CreateTourDto {
    title: string;
    description: string;
    shortDescription?: string;
    country: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    category?: TourCategory;
    difficulty?: DifficultyLevel;
    language?: string;
    minGroupSize?: number;
    maxGroupSize?: number;
    basePrice: number;
    currency?: string;
    commissionRate?: number;
    startDate: string;
    endDate: string;
    durationDays: number;
    itinerary?: CreateItineraryItemDto[];
    media?: CreateTourMediaDto[];
    services?: string[];
}
