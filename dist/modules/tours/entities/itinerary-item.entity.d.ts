import { Tour } from './tour.entity';
export declare class ItineraryItem {
    id: string;
    tour: Tour;
    tourId: string;
    dayNumber: number;
    sortOrder: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    notes: string;
}
