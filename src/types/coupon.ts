export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed_cart" | "fixed_product" | "tiered" | "prepaid_bonus";
  amount: number;
  description: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  expiryDate?: string;
  isActive: boolean;
  excludeSaleItems?: boolean;
  productIds?: number[];
  excludedProductIds?: number[];
  categoryIds?: number[];
  excludedCategoryIds?: number[];
  // Tiered discount specific
  tiers?: {
    minQuantity: number;
    discountPercent: number;
    bonusPrepaidDiscount?: number;
  }[];
  // For automatic coupons (like tiered discounts)
  isAutomatic: boolean;
}

export interface CartCoupon {
  coupon: Coupon;
  discountAmount: number;
  appliedTo: "subtotal" | "shipping" | "total";
}

export interface DiscountCalculation {
  originalSubtotal: number;
  itemCount: number;
  isPrepaid: boolean;
  appliedCoupons: CartCoupon[];
  tierDiscount: number;
  prepaidDiscount: number;
  manualCouponDiscount: number;
  codFee: number;
  shippingCost: number;
  finalTotal: number;
  savingsBreakdown: {
    label: string;
    amount: number;
  }[];
}

export const TIERED_DISCOUNTS = {
  buy1: {
    minQuantity: 1,
    discountPercent: 15,
    label: "Buy 1 Get 15% Off",
  },
  buy2: {
    minQuantity: 2,
    discountPercent: 20,
    prepaidBonusPercent: 5,
    label: "Buy 2 Get 20% Off + 5% Prepaid",
  },
};

export const COD_FEE = 149;
export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_COST = 150;
