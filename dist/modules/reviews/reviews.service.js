"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const tours_service_1 = require("../tours/tours.service");
let ReviewsService = class ReviewsService {
    reviewRepository;
    toursService;
    constructor(reviewRepository, toursService) {
        this.reviewRepository = reviewRepository;
        this.toursService = toursService;
    }
    async create(createReviewDto, userId) {
        const tour = await this.toursService.findById(createReviewDto.tourId);
        const existingReview = await this.reviewRepository.findOne({
            where: { tourId: createReviewDto.tourId, userId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this tour');
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
        return result;
    }
    async findByTour(tourId, page = 1, limit = 10) {
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { tourId, isVisible: true },
            relations: { user: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { reviews, total };
    }
    async respondToReview(reviewId, response, hostId) {
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: { tour: true },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.tour.hostId !== hostId) {
            throw new common_1.BadRequestException('You can only respond to reviews on your tours');
        }
        review.hostResponse = response;
        return this.reviewRepository.save(review);
    }
    async updateTourRating(tourId) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.tourId = :tourId', { tourId })
            .andWhere('review.isVisible = :isVisible', { isVisible: true })
            .getRawOne();
        const updateDto = {
            averageRating: parseFloat(result?.average) || 0,
            reviewCount: parseInt(result?.count) || 0,
        };
        await this.toursService.update(tourId, updateDto);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tours_service_1.ToursService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map