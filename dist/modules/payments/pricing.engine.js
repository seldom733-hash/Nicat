"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingEngine = void 0;
const common_1 = require("@nestjs/common");
let PricingEngine = class PricingEngine {
    DEFAULT_COMMISSION_RATE = 15;
    calculateTotalPrice(basePricePerPerson, numberOfPassengers, commissionRate, currency = 'USD') {
        const subtotal = basePricePerPerson * numberOfPassengers;
        const rate = commissionRate || this.DEFAULT_COMMISSION_RATE;
        const platformCommission = subtotal * (rate / 100);
        const hostPayout = subtotal - platformCommission;
        const totalPrice = subtotal;
        return {
            basePricePerPerson,
            numberOfPassengers,
            subtotal,
            commissionRate: rate,
            platformCommission,
            hostPayout,
            totalPrice,
            currency,
        };
    }
    calculateDynamicPricing(basePrice, demandFactor = 1, seasonFactor = 1, earlyBirdDiscount = 0, groupDiscount = 0) {
        let price = basePrice;
        price *= demandFactor;
        price *= seasonFactor;
        price *= 1 - earlyBirdDiscount;
        price *= 1 - groupDiscount;
        return Math.round(price * 100) / 100;
    }
    calculateGroupDiscount(numberOfPassengers, baseDiscountPercent = 5) {
        if (numberOfPassengers >= 10)
            return baseDiscountPercent * 3;
        if (numberOfPassengers >= 5)
            return baseDiscountPercent * 2;
        if (numberOfPassengers >= 3)
            return baseDiscountPercent;
        return 0;
    }
};
exports.PricingEngine = PricingEngine;
exports.PricingEngine = PricingEngine = __decorate([
    (0, common_1.Injectable)()
], PricingEngine);
//# sourceMappingURL=pricing.engine.js.map