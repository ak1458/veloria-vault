"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import PremiumProductCard from "@/components/PremiumProductCard";
import type { WCCategory, WCProduct } from "@/lib/woocommerce";
import { Search } from "lucide-react";

interface CategoryTab {
  slug: string;
  label: string;
}

interface ShopPageClientProps {
  products: WCProduct[];
  categories: WCCategory[];
  categoryTabs: CategoryTab[];
  activeCategorySlug?: string;
  searchTerm?: string;
}

export default function ShopPageClient({
  products,
  categories,
  categoryTabs,
  activeCategorySlug,
  searchTerm,
}: ShopPageClientProps) {
  const searchParams = useSearchParams();
  const activeCategory = activeCategorySlug || searchParams.get("category");
  const search = searchTerm || searchParams.get("search");

  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(localSearch.trim())}`;
    } else {
      window.location.href = "/shop";
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter((p) =>
        p.categories.some((c) => c.slug === activeCategory)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, search]);

  // Get label for category
  const getCategoryLabel = (slug: string) => {
    const tab = categoryTabs.find((t) => t.slug === slug);
    return tab?.label || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-[#1a1a1a] py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/wp-content/uploads/2026/01/Bag-8-3-scaled.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-8">
            {activeCategory ? activeCategory.replace(/-/g, ' ').toUpperCase() : "OUR COLLECTION"}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
            <Link
              href="/shop"
              className={`text-[10px] tracking-[0.2em] uppercase py-2 border-b-2 transition-all ${
                !activeCategory ? "border-black text-black font-bold" : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              All Styles
            </Link>
            {categoryTabs.map((tab) => (
              <Link
                key={tab.slug}
                href={`/shop?category=${tab.slug}`}
                className={`text-[10px] tracking-[0.2em] uppercase py-2 border-b-2 transition-all ${
                  activeCategory === tab.slug ? "border-black text-black font-bold" : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Products Grid - 2 columns mobile, 4 columns desktop */}
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumProductCard
                    product={product}
                    imageLoading={index < 8 ? "eager" : "lazy"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-[#b59a5c] transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
