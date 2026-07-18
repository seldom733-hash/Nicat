import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ToursService } from '../tours/tours.service';
import { UpdateTourDto } from '../tours/dto/update-tour.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly toursService: ToursService,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const tour = await this.toursService.findById(createReviewDto.tourId);

    const existingReview = await this.reviewRepository.findOne({
      where: { tourId: createReviewDto.tourId, userId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this tour');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId,
      isVisible: true,
    });

    const savedReview = await this.reviewRepository.save(review);
    await this.updateTourRating(createReviewDto.tourId);

    const result = await this.reviewRepository.findOne({
      where: { id: savedReview.id },
      relations: { user: true },
    });

    return result!;
  }

  async findByTour(tourId: string, page = 1, limit = 10): Promise<{ reviews: Review[]; total: number }> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { tourId, isVisible: true },
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { reviews, total };
  }

  async respondToReview(reviewId: string, response: string, hostId: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { tour: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.tour.hostId !== hostId) {
      throw new BadRequestException('You can only respond to reviews on your tours');
    }

    review.hostResponse = response;
    return this.reviewRepository.save(review);
  }

  private async updateTourRating(tourId: string): Promise<void> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.tourId = :tourId', { tourId })
      .andWhere('review.isVisible = :isVisible', { isVisible: true })
      .getRawOne();

    const updateDto: UpdateTourDto = {
      averageRating: parseFloat(result?.average) || 0,
      reviewCount: parseInt(result?.count) || 0,
    };

    await this.toursService.update(tourId, updateDto);
  }
}
