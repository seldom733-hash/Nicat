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
export declare class PricingEngine {
    private readonly DEFAULT_COMMISSION_RATE;
    calculateTotalPrice(basePricePerPerson: number, numberOfPassengers: number, commissionRate: number, currency?: string): PricingResult;
    calculateDynamicPricing(basePrice: number, demandFactor?: number, seasonFactor?: number, earlyBirdDiscount?: number, groupDiscount?: number): number;
    calculateGroupDiscount(numberOfPassengers: number, baseDiscountPercent?: number): number;
}
