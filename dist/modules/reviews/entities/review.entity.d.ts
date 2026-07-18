import { User } from '../../users/entities/user.entity';
import { Tour } from '../../tours/entities/tour.entity';
export declare class Review {
    id: string;
    tour: Tour;
    tourId: string;
    user: User;
    userId: string;
    rating: number;
    comment: string;
    hostResponse: string;
    isVerified: boolean;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}
