import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<import("./entities").Review>;
    findByTour(tourId: string, page?: number, limit?: number): Promise<{
        reviews: import("./entities").Review[];
        total: number;
    }>;
    respondToReview(id: string, response: string, req: any): Promise<import("./entities").Review>;
}
