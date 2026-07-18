import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, TourStatus, BookingStatus } from '../../common/constants';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: UserRole,
  ) {
    return this.adminService.getAllUsers(page, limit, role);
  }

  @Get('tours')
  async getAllTours(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TourStatus,
  ) {
    return this.adminService.getAllTours(page, limit, status);
  }

  @Get('bookings')
  async getAllBookings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: BookingStatus,
  ) {
    return this.adminService.getAllBookings(page, limit, status);
  }

  @Put('tours/:id/moderate')
  async moderateTour(
    @Param('id') id: string,
    @Body('action') action: 'approve' | 'reject',
  ) {
    return this.adminService.moderateTour(id, action);
  }

  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Get('reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getRevenueReport(startDate, endDate);
  }
}
