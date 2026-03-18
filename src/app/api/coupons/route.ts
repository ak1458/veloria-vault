import { NextRequest, NextResponse } from "next/server";
import { calculateDiscounts, validateCoupon, getTierDiscountInfo } from "@/lib/coupon-calculator";
import { z } from "zod";

const calculateSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  appliedCouponCodes: z.array(z.string()).default([]),
  isPrepaid: z.boolean().default(true),
});

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

// POST /api/coupons/calculate - Calculate discounts for cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = calculateSchema.parse(body);
    
    const calculation = calculateDiscounts({
      items: validatedData.items.map(item => ({
        ...item,
        slug: "",
        image: "",
        category: "",
      })),
      appliedCouponCodes: validatedData.appliedCouponCodes,
      isPrepaid: validatedData.isPrepaid,
    });
    
    return NextResponse.json({
      success: true,
      calculation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Coupon calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate discounts" },
      { status: 500 }
    );
  }
}

// GET /api/coupons/validate?code=ABC&subtotal=1000
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }
    
    const result = validateCoupon(code, subtotal);
    
    return NextResponse.json({
      success: result.valid,
      coupon: result.coupon,
      error: result.error,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
