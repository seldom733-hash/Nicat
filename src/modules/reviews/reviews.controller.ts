import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get('tour/:tourId')
  async findByTour(
    @Param('tourId') tourId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.findByTour(tourId, page, limit);
  }

  @Post(':id/response')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async respondToReview(
    @Param('id') id: string,
    @Body('response') response: string,
    @Request() req,
  ) {
    return this.reviewsService.respondToReview(id, response, req.user.id);
  }
}
