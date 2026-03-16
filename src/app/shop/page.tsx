import ShopContent from "./ShopContent";
import { getCategories, getVariationProducts } from "@/lib/woocommerce";

export const metadata = {
  title: "Shop | Veloria Vault",
  description: "Browse Veloria Vault's collection of luxury leather handbags, totes, satchels, and accessories.",
};

export default async function ShopPage() {
  // Fetch all data at build time - use variations for shop display (they have prices)
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getVariationProducts(),
  ]);

  return (
    <ShopContent 
      initialCategories={categories} 
      initialProducts={allProducts}
    />
  );
}
