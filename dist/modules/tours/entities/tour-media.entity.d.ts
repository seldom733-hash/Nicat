import { Tour } from './tour.entity';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class TourMedia {
    id: string;
    tour: Tour;
    tourId: string;
    type: MediaType;
    url: string;
    caption: string;
    sortOrder: number;
    isActive: boolean;
}
