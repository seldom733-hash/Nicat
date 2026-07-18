import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, AddPassengerDto, RemovePassengerDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  async findByUser(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findByUser(req.user.id, page, limit);
  }

  @Get('tour/:tourId')
  async findByTour(
    @Param('tourId') tourId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.findByTour(tourId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.updateStatus(id, updateBookingDto, req.user.id);
  }

  @Post(':id/passengers')
  async addPassenger(
    @Param('id') id: string,
    @Body() addPassengerDto: AddPassengerDto,
    @Request() req,
  ) {
    return this.bookingsService.addPassenger(id, addPassengerDto, req.user.id);
  }

  @Put(':id/passengers/remove')
  async removePassenger(
    @Param('id') id: string,
    @Body() removePassengerDto: RemovePassengerDto,
    @Request() req,
  ) {
    return this.bookingsService.removePassenger(id, removePassengerDto, req.user.id);
  }

  @Put(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.bookingsService.cancel(id, req.user.id, reason);
  }
}
