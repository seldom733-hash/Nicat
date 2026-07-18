import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/constants';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.HOST, UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    return this.dashboardService.getHostStats(req.user.id);
  }

  @Get('tours')
  async getTours(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getHostTours(req.user.id, page, limit);
  }

  @Get('bookings')
  async getBookings(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getHostBookings(req.user.id, page, limit);
  }

  @Get('revenue')
  async getRevenueAnalytics(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getRevenueAnalytics(req.user.id, startDate, endDate);
  }

  @Get('tours/:tourId/stats')
  async getTourStats(@Param('tourId') tourId: string, @Request() req) {
    return this.dashboardService.getTourStats(tourId, req.user.id);
  }
}
