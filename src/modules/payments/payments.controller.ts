import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Req,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/constants';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { CreateConnectAccountDto } from './dto/create-connect-account.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
  ) {}

  // ==================== Инициализация платежа ====================

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Инициировать платеж за бронирование' })
  @ApiResponse({ status: 201, description: 'Платеж успешно инициирован' })
  @ApiBearerAuth()
  async initiatePayment(
    @Body() dto: InitiatePaymentDto,
    @Request() req: any,
  ) {
    return this.paymentsService.initiatePayment(
      dto.bookingId,
      req.user.id,
      dto.useCheckoutSession,
      dto.successUrl,
      dto.cancelUrl,
    );
  }

  // ==================== История платежей ====================

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить историю платежей пользователя' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPaymentHistory(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentsService.getPaymentHistory(req.user.id, page, limit);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить платеж по ID бронирования' })
  @ApiBearerAuth()
  async getPaymentByBookingId(
    @Param('bookingId') bookingId: string,
  ) {
    return this.paymentsService.getPaymentByBookingId(bookingId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить детали платежа' })
  @ApiBearerAuth()
  async getPaymentById(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.paymentsService.getPaymentById(id);
  }

  // ==================== Возврат средств ====================

  @Post('refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.HOST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вернуть средства по платежу' })
  @ApiResponse({ status: 200, description: 'Возврат успешно выполнен' })
  @ApiBearerAuth()
  async refundPayment(
    @Body() dto: RefundPaymentDto,
    @Request() req: any,
  ) {
    return this.paymentsService.refundPayment(
      dto.paymentId,
      req.user.id,
      dto.amount,
      dto.reason,
    );
  }

  // ==================== Stripe Connect ====================

  @Post('stripe/connect')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать Stripe Connect аккаунт для хозяина тура' })
  @ApiResponse({ status: 201, description: 'Stripe Connect аккаунт создан' })
  @ApiBearerAuth()
  async createStripeConnect(
    @Body() dto: CreateConnectAccountDto,
    @Request() req: any,
  ) {
    const user = await this.usersService.findById(req.user.id);

    if (user.stripeAccountId) {
      // Аккаунт уже существует — обновляем ссылку
      const accountLink = await this.stripeService.createAccountLink(
        user.stripeAccountId,
        dto.refreshUrl,
        dto.returnUrl,
      );
      return {
        accountId: user.stripeAccountId,
        onboardingUrl: accountLink.url,
        isExisting: true,
      };
    }

    // Создаем новый аккаунт
    const account = await this.stripeService.createConnectedAccount(
      user.email,
      dto.country || user.country || 'US',
      {
        userId: user.id,
        email: user.email,
      },
    );

    await this.usersService.updateStripeAccount(user.id, account.id);

    const accountLink = await this.stripeService.createAccountLink(
      account.id,
      dto.refreshUrl,
      dto.returnUrl,
    );

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
      isExisting: false,
    };
  }

  @Get('stripe/connect/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить статус Stripe Connect аккаунта' })
  @ApiBearerAuth()
  async getStripeConnectStatus(@Request() req: any) {
    return this.paymentsService.getStripeConnectStatus(req.user.id);
  }

  @Get('stripe/connect/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить ссылку на Stripe Dashboard для хозяина' })
  @ApiBearerAuth()
  async getStripeDashboard(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);

    if (!user.stripeAccountId) {
      return { url: null, message: 'Stripe аккаунт не подключен' };
    }

    const loginLink = await this.stripeService.createLoginLink(user.stripeAccountId);
    return { url: loginLink.url };
  }

  @Get('stripe/connect/balance')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить баланс Stripe Connect аккаунта' })
  @ApiBearerAuth()
  async getStripeBalance(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);

    if (!user.stripeAccountId) {
      return { available: [], pending: [] };
    }

    const balance = await this.stripeService.getConnectedAccountBalance(user.stripeAccountId);
    return {
      available: balance.available.map((b) => ({
        amount: b.amount / 100,
        currency: b.currency,
      })),
      pending: balance.pending.map((b) => ({
        amount: b.amount / 100,
        currency: b.currency,
      })),
    };
  }

  // ==================== Выплаты ====================

  @Post('payout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Запросить вывод средств' })
  @ApiBearerAuth()
  async requestPayout(
    @Body('amount') amount: number,
    @Request() req: any,
  ) {
    return this.paymentsService.requestPayout(req.user.id, amount);
  }

  @Get('payout/history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить историю выплат' })
  @ApiBearerAuth()
  async getPayoutHistory(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentsService.getPayoutHistory(req.user.id, page, limit);
  }

  // ==================== Webhook ====================

  @Post('stripe/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe Webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook обработан' })
  async handleWebhook(@Req() req: any) {
    const signature = req.headers['stripe-signature'] as string;
    const rawBody = req.rawBody || req.body;

    if (!rawBody) {
      return { error: 'Отсутствует тело запроса' };
    }

    if (!signature) {
      return { error: 'Отсутствует подпись webhook' };
    }

    try {
      const event = await this.stripeService.constructWebhookEvent(
        Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(JSON.stringify(rawBody)),
        signature,
      );

      await this.paymentsService.handleWebhook(event);

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook ошибка: ${error.message}`);
      return { error: 'Webhook верификация не удалась' };
    }
  }

  // ==================== Админские эндпоинты ====================

  @Get('admin/webhook-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получить события webhook (админ)' })
  @ApiBearerAuth()
  async getWebhookEvents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('eventType') eventType?: string,
  ) {
    return this.paymentsService.getWebhookEvents(page, limit, eventType);
  }

  @Get('admin/webhook-events/failed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получить неудачные события webhook (админ)' })
  @ApiBearerAuth()
  async getFailedWebhookEvents() {
    return this.paymentsService.getFailedWebhookEvents();
  }

  @Post('admin/webhook-events/:id/retry')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Повторить обработку неудачного webhook (админ)' })
  @ApiBearerAuth()
  async retryWebhookEvent(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.paymentsService.retryWebhookEvent(id);
    return { message: 'Событие поставлено на повторную обработку' };
  }
}
