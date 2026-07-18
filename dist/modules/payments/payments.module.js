"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const stripe_event_entity_1 = require("./entities/stripe-event.entity");
const payout_entity_1 = require("./entities/payout.entity");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const stripe_service_1 = require("./stripe.service");
const pricing_engine_1 = require("./pricing.engine");
const bookings_module_1 = require("../bookings/bookings.module");
const tours_module_1 = require("../tours/tours.module");
const users_module_1 = require("../users/users.module");
const cache_module_1 = require("../../core/cache/cache.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment, stripe_event_entity_1.StripeEvent, payout_entity_1.Payout]),
            (0, common_1.forwardRef)(() => bookings_module_1.BookingsModule),
            (0, common_1.forwardRef)(() => tours_module_1.ToursModule),
            users_module_1.UsersModule,
            cache_module_1.CacheModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, stripe_service_1.StripeService, pricing_engine_1.PricingEngine],
        exports: [payments_service_1.PaymentsService, pricing_engine_1.PricingEngine, stripe_service_1.StripeService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map