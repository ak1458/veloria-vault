"use client";

import { useState, useEffect } from "react";
import { Tag, X, Loader2, Check, Sparkles } from "lucide-react";
import { useCouponStore } from "@/store/cart-coupon";
import { useCartStore } from "@/store/cart";
import { getTierDiscountInfo } from "@/lib/coupon-calculator";

export default function CouponSection() {
  const [couponInput, setCouponInput] = useState("");
  const [tierInfo, setTierInfo] = useState<{
    currentTier: string | null;
    nextTier: string | null;
    itemsNeededForNext: number;
    discountPercent: number;
  } | null>(null);
  
  const { 
    appliedCouponCodes, 
    calculation, 
    isLoading, 
    error,
    addCoupon, 
    removeCoupon,
    calculateDiscounts,
  } = useCouponStore();
  
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate tier info
  useEffect(() => {
    const info = getTierDiscountInfo(itemCount);
    setTierInfo(info);
  }, [itemCount]);

  // Recalculate discounts when items or coupons change
  useEffect(() => {
    calculateDiscounts(items);
  }, [items, appliedCouponCodes, calculateDiscounts]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    await addCoupon(couponInput.trim());
    setCouponInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyCoupon();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-serif text-lg text-gray-800 mb-4">Discounts & Offers</h3>
      
      {/* Tier Discount Banner */}
      {tierInfo?.currentTier && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#b59a5c]/10 to-[#b59a5c]/5 border border-[#b59a5c]/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b59a5c]" />
            <span className="text-sm font-medium text-gray-800">
              Active: {tierInfo.currentTier}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            {tierInfo.discountPercent}% off applied automatically
          </p>
        </div>
      )}

      {/* Next Tier Progress */}
      {tierInfo?.nextTier && tierInfo.itemsNeededForNext > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Add <span className="font-semibold text-[#b59a5c]">{tierInfo.itemsNeededForNext}</span> more item
            {tierInfo.itemsNeededForNext > 1 ? "s" : ""} to unlock{" "}
            <span className="font-medium">{tierInfo.nextTier}</span>
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b59a5c] transition-all duration-300"
              style={{ width: `${(itemCount / (itemCount + tierInfo.itemsNeededForNext)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Enter coupon code (e.g., ABC)"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#b59a5c] uppercase"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleApplyCoupon}
          disabled={isLoading || !couponInput.trim()}
          className="px-4 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#b59a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      {/* Applied Coupons */}
      {appliedCouponCodes.length > 0 && (
        <div className="space-y-2 mb-4">
          {appliedCouponCodes.map((code) => {
            const couponDetail = calculation?.appliedCoupons.find(
              (c) => c.coupon.code === code
            );
            return (
              <div
                key={code}
                className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{code}</span>
                    {couponDetail && (
                      <p className="text-xs text-green-600">
                        -₹{couponDetail.discountAmount.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeCoupon(code)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Coupons Hint */}
      {appliedCouponCodes.length === 0 && (
        <p className="text-xs text-gray-400">
          Try codes: <span className="font-medium text-gray-600">ABC</span> for 5% off
        </p>
      )}
    </div>
  );
}
