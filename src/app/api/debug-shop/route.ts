import { NextResponse } from "next/server";
import { getProducts, getVariationProducts } from "@/lib/woocommerce";

export async function GET() {
  try {
    console.log("--- DEBUG SHOP API START ---");
    const products = await getVariationProducts();
    console.log(`--- DEBUG SHOP API END. Found: ${products.length} ---`);
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.slice(0, 3) // Sample
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
