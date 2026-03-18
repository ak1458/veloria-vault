import { NextRequest, NextResponse } from "next/server";
import { getTierDiscountInfo } from "@/lib/coupon-calculator";

// GET /api/coupons/tier-info?itemCount=2
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemCount = parseInt(searchParams.get("itemCount") || "0");
    
    const tierInfo = getTierDiscountInfo(itemCount);
    
    return NextResponse.json({
      success: true,
      ...tierInfo,
    });
  } catch (error) {
    console.error("Tier info error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get tier info" },
      { status: 500 }
    );
  }
}
