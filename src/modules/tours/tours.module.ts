import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity';
import { ItineraryItem } from './entities/itinerary-item.entity';
import { TourMedia } from './entities/tour-media.entity';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, ItineraryItem, TourMedia])],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
