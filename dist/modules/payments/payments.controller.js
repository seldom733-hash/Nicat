"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const stripe_service_1 = require("./stripe.service");
const users_service_1 = require("../users/users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const constants_1 = require("../../common/constants");
const initiate_payment_dto_1 = require("./dto/initiate-payment.dto");
const refund_payment_dto_1 = require("./dto/refund-payment.dto");
const create_connect_account_dto_1 = require("./dto/create-connect-account.dto");
let PaymentsController = PaymentsController_1 = class PaymentsController {
    paymentsService;
    stripeService;
    usersService;
    logger = new common_1.Logger(PaymentsController_1.name);
    constructor(paymentsService, stripeService, usersService) {
        this.paymentsService = paymentsService;
        this.stripeService = stripeService;
        this.usersService = usersService;
    }
    async initiatePayment(dto, req) {
        return this.paymentsService.initiatePayment(dto.bookingId, req.user.id, dto.useCheckoutSession, dto.successUrl, dto.cancelUrl);
    }
    async getPaymentHistory(req, page, limit) {
        return this.paymentsService.getPaymentHistory(req.user.id, page, limit);
    }
    async getPaymentByBookingId(bookingId) {
        return this.paymentsService.getPaymentByBookingId(bookingId);
    }
    async getPaymentById(id) {
        return this.paymentsService.getPaymentById(id);
    }
    async refundPayment(dto, req) {
        return this.paymentsService.refundPayment(dto.paymentId, req.user.id, dto.amount, dto.reason);
    }
    async createStripeConnect(dto, req) {
        const user = await this.usersService.findById(req.user.id);
        if (user.stripeAccountId) {
            const accountLink = await this.stripeService.createAccountLink(user.stripeAccountId, dto.refreshUrl, dto.returnUrl);
            return {
                accountId: user.stripeAccountId,
                onboardingUrl: accountLink.url,
                isExisting: true,
            };
        }
        const account = await this.stripeService.createConnectedAccount(user.email, dto.country || user.country || 'US', {
            userId: user.id,
            email: user.email,
        });
        await this.usersService.updateStripeAccount(user.id, account.id);
        const accountLink = await this.stripeService.createAccountLink(account.id, dto.refreshUrl, dto.returnUrl);
        return {
            accountId: account.id,
            onboardingUrl: accountLink.url,
            isExisting: false,
        };
    }
    async getStripeConnectStatus(req) {
        return this.paymentsService.getStripeConnectStatus(req.user.id);
    }
    async getStripeDashboard(req) {
        const user = await this.usersService.findById(req.user.id);
        if (!user.stripeAccountId) {
            return { url: null, message: 'Stripe аккаунт не подключен' };
        }
        const loginLink = await this.stripeService.createLoginLink(user.stripeAccountId);
        return { url: loginLink.url };
    }
    async getStripeBalance(req) {
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
    async requestPayout(amount, req) {
        return this.paymentsService.requestPayout(req.user.id, amount);
    }
    async getPayoutHistory(req, page, limit) {
        return this.paymentsService.getPayoutHistory(req.user.id, page, limit);
    }
    async handleWebhook(req) {
        const signature = req.headers['stripe-signature'];
        const rawBody = req.rawBody || req.body;
        if (!rawBody) {
            return { error: 'Отсутствует тело запроса' };
        }
        if (!signature) {
            return { error: 'Отсутствует подпись webhook' };
        }
        try {
            const event = await this.stripeService.constructWebhookEvent(Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(JSON.stringify(rawBody)), signature);
            await this.paymentsService.handleWebhook(event);
            return { received: true };
        }
        catch (error) {
            this.logger.error(`Webhook ошибка: ${error.message}`);
            return { error: 'Webhook верификация не удалась' };
        }
    }
    async getWebhookEvents(page, limit, eventType) {
        return this.paymentsService.getWebhookEvents(page, limit, eventType);
    }
    async getFailedWebhookEvents() {
        return this.paymentsService.getFailedWebhookEvents();
    }
    async retryWebhookEvent(id) {
        await this.paymentsService.retryWebhookEvent(id);
        return { message: 'Событие поставлено на повторную обработку' };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Инициировать платеж за бронирование' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Платеж успешно инициирован' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiate_payment_dto_1.InitiatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить историю платежей пользователя' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить платеж по ID бронирования' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentByBookingId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить детали платежа' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Post)('refund'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constants_1.UserRole.ADMIN, constants_1.UserRole.HOST),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Вернуть средства по платежу' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Возврат успешно выполнен' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_payment_dto_1.RefundPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Post)('stripe/connect'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Создать Stripe Connect аккаунт для хозяина тура' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Stripe Connect аккаунт создан' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_connect_account_dto_1.CreateConnectAccountDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createStripeConnect", null);
__decorate([
    (0, common_1.Get)('stripe/connect/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить статус Stripe Connect аккаунта' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getStripeConnectStatus", null);
__decorate([
    (0, common_1.Get)('stripe/connect/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить ссылку на Stripe Dashboard для хозяина' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getStripeDashboard", null);
__decorate([
    (0, common_1.Get)('stripe/connect/balance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить баланс Stripe Connect аккаунта' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getStripeBalance", null);
__decorate([
    (0, common_1.Post)('payout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Запросить вывод средств' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)('amount')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "requestPayout", null);
__decorate([
    (0, common_1.Get)('payout/history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Получить историю выплат' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayoutHistory", null);
__decorate([
    (0, common_1.Post)('stripe/webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe Webhook endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook обработан' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('admin/webhook-events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Получить события webhook (админ)' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('eventType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getWebhookEvents", null);
__decorate([
    (0, common_1.Get)('admin/webhook-events/failed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Получить неудачные события webhook (админ)' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getFailedWebhookEvents", null);
__decorate([
    (0, common_1.Post)('admin/webhook-events/:id/retry'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constants_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Повторить обработку неудачного webhook (админ)' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "retryWebhookEvent", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        stripe_service_1.StripeService,
        users_service_1.UsersService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map