/**
 * Secure Razorpay Order Creation
 * Key is stored server-side only
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

const createOrderSchema = z.object({
  amount: z.number().positive(),
  orderId: z.string(),
  orderNumber: z.string(),
  customerDetails: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(
      `razorpay:${clientIP}`,
      RATE_LIMITS.CHECKOUT.limit,
      RATE_LIMITS.CHECKOUT.windowMs
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    // Validate environment
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("[Razorpay] Missing credentials");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Validate input
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Create Razorpay order
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(validated.amount * 100), // Convert to paise
        currency: "INR",
        receipt: validated.orderNumber,
        notes: {
          order_id: validated.orderId,
          customer_email: validated.customerDetails.email,
          customer_name: validated.customerDetails.name,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Razorpay] Order creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 }
      );
    }

    const razorpayOrder = await response.json();

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: RAZORPAY_KEY_ID, // Safe to expose - this is the public key
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    console.error("[Razorpay] Error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
