import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/constants';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.HOST, UserRole.ADMIN)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * GET /analytics/funnel?tourId=optional&days=30
   * Sales funnel: views → bookings → paid → completed
   */
  @Get('funnel')
  async getFunnel(
    @Request() req,
    @Query('tourId') tourId?: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getFunnel(req.user.id, tourId, days);
  }

  /**
   * GET /analytics/revenue?period=day&days=30
   * Revenue chart data over time
   */
  @Get('revenue')
  async getRevenueChart(
    @Request() req,
    @Query('period') period?: 'day' | 'week' | 'month',
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getRevenueChart(
      req.user.id,
      period || 'day',
      days || 30,
    );
  }

  /**
   * GET /analytics/tours?days=30
   * Tour performance comparison
   */
  @Get('tours')
  async getTourPerformance(
    @Request() req,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getTourPerformance(req.user.id, days);
  }

  /**
   * GET /analytics/geography?days=30
   * Where bookings come from (by country)
   */
  @Get('geography')
  async getGeography(
    @Request() req,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getGeography(req.user.id, days);
  }

  /**
   * GET /analytics/sources?days=30
   * How visitors find tours
   */
  @Get('sources')
  async getSources(
    @Request() req,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getSources(req.user.id, days);
  }

  /**
   * GET /analytics/monthly
   * Monthly summary with growth metrics
   */
  @Get('monthly')
  async getMonthlySummary(@Request() req) {
    return this.analyticsService.getMonthlySummary(req.user.id);
  }

  /**
   * POST /analytics/track-view
   * Track a tour view (called from frontend)
   */
  @Post('track-view')
  @HttpCode(201)
  async trackView(
    @Request() req,
    @Body() body: {
      tourId: string;
      source?: string;
      deviceType?: string;
      country?: string;
      referrerUrl?: string;
    },
  ) {
    // View tracking is handled by the interceptor
    // This endpoint exists for manual tracking if needed
    return { success: true };
  }
}
