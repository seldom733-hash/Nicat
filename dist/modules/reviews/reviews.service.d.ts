import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ToursService } from '../tours/tours.service';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly toursService;
    constructor(reviewRepository: Repository<Review>, toursService: ToursService);
    create(createReviewDto: CreateReviewDto, userId: string): Promise<Review>;
    findByTour(tourId: string, page?: number, limit?: number): Promise<{
        reviews: Review[];
        total: number;
    }>;
    respondToReview(reviewId: string, response: string, hostId: string): Promise<Review>;
    private updateTourRating;
}
