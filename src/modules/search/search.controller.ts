import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') q?: string,
    @Query('country') country?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('duration') duration?: number,
    @Query('language') language?: string,
    @Query('difficulty') difficulty?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.searchService.searchTours({
      q,
      country,
      city,
      category,
      minPrice,
      maxPrice,
      duration,
      language,
      difficulty,
      startDate,
      endDate,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get('destinations')
  async getPopularDestinations(@Query('limit') limit?: number) {
    return this.searchService.getPopularDestinations(limit);
  }

  @Get('categories')
  async getCategories() {
    return this.searchService.getCategories();
  }
}
