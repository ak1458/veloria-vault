import { 
  Coupon, 
  DiscountCalculation, 
  CartCoupon,
  TIERED_DISCOUNTS,
  COD_FEE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST 
} from "@/types/coupon";
import { CartItem } from "@/store/cart";

export interface CalculationInput {
  items: CartItem[];
  appliedCouponCodes: string[];
  isPrepaid: boolean;
  customerId?: number;
}

// In-memory store for active coupons (in production, use database)
const activeCoupons: Map<string, Coupon> = new Map([
  ["ABC", {
    id: "coupon-abc",
    code: "ABC",
    type: "percentage",
    amount: 5,
    description: "Extra 5% off with code ABC",
    isActive: true,
    isAutomatic: false,
    usageCount: 0,
  }],
  ["SAVE10", {
    id: "coupon-save10",
    code: "SAVE10",
    type: "percentage",
    amount: 10,
    description: "Get 10% off your order",
    minPurchase: 1000,
    isActive: true,
    isAutomatic: false,
    usageCount: 0,
  }],
  ["FLAT200", {
    id: "coupon-flat200",
    code: "FLAT200",
    type: "fixed_cart",
    amount: 200,
    description: "₹200 off on orders above ₹2000",
    minPurchase: 2000,
    isActive: true,
    isAutomatic: false,
    usageCount: 0,
  }],
]);

export function calculateDiscounts(input: CalculationInput): DiscountCalculation {
  const { items, appliedCouponCodes, isPrepaid } = input;
  
  // Calculate base values
  const originalSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Determine tier discount
  let tierDiscountPercent = 0;
  let prepaidBonusPercent = 0;
  let appliedTierLabel = "";
  
  if (itemCount >= TIERED_DISCOUNTS.buy2.minQuantity) {
    tierDiscountPercent = TIERED_DISCOUNTS.buy2.discountPercent;
    prepaidBonusPercent = TIERED_DISCOUNTS.buy2.prepaidBonusPercent || 0;
    appliedTierLabel = TIERED_DISCOUNTS.buy2.label;
  } else if (itemCount >= TIERED_DISCOUNTS.buy1.minQuantity) {
    tierDiscountPercent = TIERED_DISCOUNTS.buy1.discountPercent;
    appliedTierLabel = TIERED_DISCOUNTS.buy1.label;
  }
  
  // Calculate tier discount amount
  const tierDiscountAmount = Math.round((originalSubtotal * tierDiscountPercent) / 100);
  
  // Calculate prepaid bonus (only for Buy 2+ and prepaid)
  let prepaidDiscountAmount = 0;
  if (isPrepaid && prepaidBonusPercent > 0) {
    prepaidDiscountAmount = Math.round((originalSubtotal * prepaidBonusPercent) / 100);
  }
  
  // Calculate manual coupon discounts
  let manualCouponDiscountAmount = 0;
  const appliedCoupons: CartCoupon[] = [];
  
  for (const code of appliedCouponCodes) {
    const coupon = activeCoupons.get(code.toUpperCase());
    if (!coupon || !coupon.isActive) continue;
    
    // Check minimum purchase
    if (coupon.minPurchase && originalSubtotal < coupon.minPurchase) {
      continue;
    }
    
    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      continue;
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      continue;
    }
    
    let discountAmount = 0;
    
    switch (coupon.type) {
      case "percentage":
        discountAmount = Math.round((originalSubtotal * coupon.amount) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
        break;
        
      case "fixed_cart":
        discountAmount = coupon.amount;
        break;
        
      case "fixed_product":
        // Apply to each applicable product
        discountAmount = items.reduce((sum, item) => {
          if (!coupon.productIds || coupon.productIds.includes(item.id)) {
            return sum + (coupon.amount * item.quantity);
          }
          return sum;
        }, 0);
        break;
    }
    
    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, originalSubtotal);
    
    manualCouponDiscountAmount += discountAmount;
    appliedCoupons.push({
      coupon,
      discountAmount,
      appliedTo: "subtotal",
    });
  }
  
  // Calculate shipping
  const subtotalAfterDiscounts = originalSubtotal - tierDiscountAmount - prepaidDiscountAmount - manualCouponDiscountAmount;
  const shippingCost = subtotalAfterDiscounts >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  
  // Calculate COD fee
  const codFee = !isPrepaid ? COD_FEE : 0;
  
  // Calculate final total
  const finalTotal = subtotalAfterDiscounts + shippingCost + codFee;
  
  // Build savings breakdown
  const savingsBreakdown: { label: string; amount: number }[] = [];
  
  if (tierDiscountAmount > 0) {
    savingsBreakdown.push({ label: appliedTierLabel, amount: tierDiscountAmount });
  }
  
  if (prepaidDiscountAmount > 0) {
    savingsBreakdown.push({ label: "Prepaid Bonus (5%)", amount: prepaidDiscountAmount });
  }
  
  appliedCoupons.forEach(({ coupon, discountAmount }) => {
    savingsBreakdown.push({ label: `Coupon: ${coupon.code}`, amount: discountAmount });
  });
  
  if (shippingCost === 0 && subtotalAfterDiscounts >= FREE_SHIPPING_THRESHOLD) {
    savingsBreakdown.push({ label: "Free Shipping", amount: STANDARD_SHIPPING_COST });
  }
  
  return {
    originalSubtotal,
    itemCount,
    isPrepaid,
    appliedCoupons,
    tierDiscount: tierDiscountAmount,
    prepaidDiscount: prepaidDiscountAmount,
    manualCouponDiscount: manualCouponDiscountAmount,
    codFee,
    shippingCost,
    finalTotal,
    savingsBreakdown,
  };
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
  const coupon = activeCoupons.get(code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" };
  }
  
  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is not active" };
  }
  
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, error: "This coupon has expired" };
  }
  
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }
  
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return { valid: false, error: `Minimum purchase of ₹${coupon.minPurchase} required` };
  }
  
  return { valid: true, coupon };
}

export function getTierDiscountInfo(itemCount: number): { 
  currentTier: string | null; 
  nextTier: string | null; 
  itemsNeededForNext: number;
  discountPercent: number;
} {
  if (itemCount >= TIERED_DISCOUNTS.buy2.minQuantity) {
    return {
      currentTier: TIERED_DISCOUNTS.buy2.label,
      nextTier: null,
      itemsNeededForNext: 0,
      discountPercent: TIERED_DISCOUNTS.buy2.discountPercent,
    };
  } else if (itemCount >= TIERED_DISCOUNTS.buy1.minQuantity) {
    return {
      currentTier: TIERED_DISCOUNTS.buy1.label,
      nextTier: TIERED_DISCOUNTS.buy2.label,
      itemsNeededForNext: TIERED_DISCOUNTS.buy2.minQuantity - itemCount,
      discountPercent: TIERED_DISCOUNTS.buy1.discountPercent,
    };
  } else {
    return {
      currentTier: null,
      nextTier: TIERED_DISCOUNTS.buy1.label,
      itemsNeededForNext: TIERED_DISCOUNTS.buy1.minQuantity - itemCount,
      discountPercent: 0,
    };
  }
}

// For admin use - add new coupon
export function addCoupon(coupon: Coupon): void {
  activeCoupons.set(coupon.code.toUpperCase(), coupon);
}

// For admin use - remove coupon
export function removeCoupon(code: string): boolean {
  return activeCoupons.delete(code.toUpperCase());
}

// Get all active coupons (for admin)
export function getActiveCoupons(): Coupon[] {
  return Array.from(activeCoupons.values());
}
