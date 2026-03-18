import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateDiscounts } from "@/lib/coupon-calculator";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Valid postal code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  paymentMethod: z.enum(["card", "cod"]),
  shippingMethod: z.enum(["standard", "express"]),
  isPrepaid: z.boolean().default(true),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      quantity: z.number().min(1),
      price: z.number().positive(),
    })
  ).min(1, "Cart is empty"),
  couponCodes: z.array(z.string()).default([]),
  discounts: z.object({
    tierDiscount: z.number().default(0),
    prepaidDiscount: z.number().default(0),
    manualCouponDiscount: z.number().default(0),
  }).optional(),
  totals: z.object({
    subtotal: z.number(),
    shipping: z.number(),
    codFee: z.number(),
    total: z.number(),
  }),
});

const WC_API_URL = process.env.WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

function getAuthHeader(): string {
  return "Basic " + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = checkoutSchema.parse(body);
    
    if (!WC_API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Recalculate to ensure totals are correct
    const calculation = calculateDiscounts({
      items: validatedData.items.map(item => ({
        ...item,
        slug: "",
        image: "",
        category: "",
      })),
      appliedCouponCodes: validatedData.couponCodes,
      isPrepaid: validatedData.isPrepaid,
    });

    // Prepare coupon lines for WooCommerce
    const couponLines = validatedData.couponCodes.map((code) => ({
      code: code,
    }));

    // Add automatic tier discount as a coupon if applicable
    if (calculation.tierDiscount > 0) {
      couponLines.push({
        code: calculation.itemCount >= 2 ? "BUY2GET20" : "BUY1GET15",
      });
    }

    // Add prepaid bonus as separate coupon if applicable
    if (calculation.prepaidDiscount > 0) {
      couponLines.push({
        code: "PREPAID5",
      });
    }

    // Create WooCommerce order
    const orderData = {
      payment_method: validatedData.paymentMethod === "cod" ? "cod" : "razorpay",
      payment_method_title: validatedData.paymentMethod === "cod" 
        ? "Cash on Delivery" 
        : "UPI / Card / Net Banking",
      set_paid: false,
      status: "pending",
      currency: "INR",
      billing: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address_1: validatedData.address,
        address_2: "",
        city: validatedData.city,
        state: "",
        postcode: validatedData.postalCode,
        country: "IN",
        email: validatedData.email,
        phone: validatedData.phone,
      },
      shipping: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address_1: validatedData.address,
        address_2: "",
        city: validatedData.city,
        state: "",
        postcode: validatedData.postalCode,
        country: "IN",
      },
      line_items: validatedData.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      shipping_lines: [
        {
          method_id: validatedData.shippingMethod,
          method_title: validatedData.shippingMethod === "standard" 
            ? "Standard Shipping" 
            : "Express Shipping",
          total: calculation.shippingCost.toString(),
        },
      ],
      coupon_lines: couponLines,
      fee_lines: calculation.codFee > 0 ? [
        {
          name: "Cash on Delivery Fee",
          total: calculation.codFee.toString(),
          tax_status: "taxable",
        },
      ] : [],
      meta_data: [
        {
          key: "_order_source",
          value: "Next.js Headless",
        },
        {
          key: "_is_prepaid",
          value: validatedData.isPrepaid ? "yes" : "no",
        },
        {
          key: "_tier_discount",
          value: calculation.tierDiscount.toString(),
        },
        {
          key: "_prepaid_discount",
          value: calculation.prepaidDiscount.toString(),
        },
        {
          key: "_manual_coupon_discount",
          value: calculation.manualCouponDiscount.toString(),
        },
        {
          key: "_original_subtotal",
          value: calculation.originalSubtotal.toString(),
        },
        {
          key: "_total_savings",
          value: calculation.savingsBreakdown.reduce((sum, s) => sum + s.amount, 0).toString(),
        },
      ],
      // Add customer if exists
      customer_id: 0, // Will be updated if user is logged in
    };

    const response = await fetch(`${WC_API_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("WooCommerce API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create order", details: errorData },
        { status: 500 }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      status: order.status,
      calculation: {
        subtotal: calculation.originalSubtotal,
        tierDiscount: calculation.tierDiscount,
        prepaidDiscount: calculation.prepaidDiscount,
        manualCouponDiscount: calculation.manualCouponDiscount,
        shipping: calculation.shippingCost,
        codFee: calculation.codFee,
        finalTotal: calculation.finalTotal,
        savingsBreakdown: calculation.savingsBreakdown,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
