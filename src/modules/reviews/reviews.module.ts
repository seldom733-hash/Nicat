import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ToursModule } from '../tours/tours.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ToursModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
