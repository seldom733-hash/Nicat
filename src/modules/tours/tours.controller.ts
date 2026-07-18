import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, TourStatus } from '../../common/constants';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTourDto: CreateTourDto, @Request() req) {
    return this.toursService.create(createTourDto, req.user);
  }

  @Get()
  async search(@Query() searchDto: SearchTourDto) {
    return this.toursService.search(searchDto);
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: number) {
    return this.toursService.getFeaturedTours(limit);
  }

  @Get('my-tours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  async getMyTours(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.toursService.findByHost(req.user.id, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.toursService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
    @Request() req,
  ) {
    return this.toursService.update(id, updateTourDto, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    if (!Object.values(TourStatus).includes(status as TourStatus)) {
      throw new BadRequestException(
        `Invalid status: ${status}. Must be one of: ${Object.values(TourStatus).join(', ')}`,
      );
    }
    return this.toursService.updateStatus(id, status as TourStatus, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.toursService.remove(id, req.user.id);
  }
}
