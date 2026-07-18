import { Injectable } from '@nestjs/common';

export interface PricingResult {
  basePricePerPerson: number;
  numberOfPassengers: number;
  subtotal: number;
  commissionRate: number;
  platformCommission: number;
  hostPayout: number;
  totalPrice: number;
  currency: string;
}

@Injectable()
export class PricingEngine {
  private readonly DEFAULT_COMMISSION_RATE = 15; // 15%

  calculateTotalPrice(
    basePricePerPerson: number,
    numberOfPassengers: number,
    commissionRate: number,
    currency: string = 'USD',
  ): PricingResult {
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

  calculateDynamicPricing(
    basePrice: number,
    demandFactor: number = 1,
    seasonFactor: number = 1,
    earlyBirdDiscount: number = 0,
    groupDiscount: number = 0,
  ): number {
    let price = basePrice;

    // Apply demand multiplier (1.0 = normal, 1.2 = high demand)
    price *= demandFactor;

    // Apply season multiplier
    price *= seasonFactor;

    // Apply discounts
    price *= 1 - earlyBirdDiscount;
    price *= 1 - groupDiscount;

    return Math.round(price * 100) / 100;
  }

  calculateGroupDiscount(numberOfPassengers: number, baseDiscountPercent: number = 5): number {
    if (numberOfPassengers >= 10) return baseDiscountPercent * 3;
    if (numberOfPassengers >= 5) return baseDiscountPercent * 2;
    if (numberOfPassengers >= 3) return baseDiscountPercent;
    return 0;
  }
}
