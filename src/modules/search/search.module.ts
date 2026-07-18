import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ToursModule } from '../tours/tours.module';

@Module({
  imports: [ToursModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
