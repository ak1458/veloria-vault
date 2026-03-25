import { NextResponse } from "next/server";
import { getProducts, getVariationProducts, wcFetch } from "@/lib/woocommerce";

export async function GET() {
  try {
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
    const resAny = await fetch(`${process.env.WC_API_URL}/products?per_page=100&status=any`, { headers: { "Authorization": `Basic ${auth}` } });
    const dataAny = await resAny.json();

    return NextResponse.json({
      success: true,
      anyStatusCount: dataAny.length,
      anyStatusTotal: resAny.headers.get("x-wp-total"),
      typeCounts: dataAny.reduce((acc: any, p: any) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {}),
      sample: dataAny.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, type: p.type, status: p.status }))
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
