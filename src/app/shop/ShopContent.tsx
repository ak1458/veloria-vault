"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PremiumProductCard from "@/components/PremiumProductCard";
import type { WCProduct, WCCategory } from "@/lib/woocommerce";
import { Search } from "lucide-react";

const CATEGORY_TABS = [
  { slug: "tote-bag", label: "Tote" },
  { slug: "satchel-bag", label: "Satchel" },
  { slug: "sling-bag", label: "Sling" },
  { slug: "crossbody", label: "Crossbody" },
  { slug: "clutch", label: "Clutch" },
  { slug: "wallet", label: "Wallet" },
];

interface ShopContentProps {
  initialCategories: WCCategory[];
  initialProducts: WCProduct[];
}

function getSearchParams() {
  if (typeof window === "undefined") return { category: undefined, search: undefined };
  const url = new URL(window.location.href);
  return {
    category: url.searchParams.get("category") || undefined,
    search: url.searchParams.get("search") || undefined,
  };
}

export default function ShopContent({ initialCategories, initialProducts }: ShopContentProps) {
  const [mounted, setMounted] = useState(false);
  const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [localSearch, setLocalSearch] = useState("");

  // Function to update state from URL
  const updateStateFromURL = useCallback(() => {
    const params = getSearchParams();
    setCategorySlug(params.category);
    setSearchTerm(params.search);
    setLocalSearch(params.search || "");
  }, []);

  useEffect(() => {
    setMounted(true);
    updateStateFromURL();
  }, [updateStateFromURL]);

  // Listen for URL changes (for client-side navigation)
  useEffect(() => {
    if (!mounted) return;

    const handlePopState = () => {
      updateStateFromURL();
    };

    // Listen for browser back/forward buttons
    window.addEventListener("popstate", handlePopState);

    // Also check URL periodically for changes (for Link clicks)
    let lastUrl = window.location.href;
    const checkUrlChange = () => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        updateStateFromURL();
      }
    };
    const interval = setInterval(checkUrlChange, 100);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(interval);
    };
  }, [mounted, updateStateFromURL]);

  // Filter categories to only show those in CATEGORY_TABS
  const categories = useMemo(() => {
    return initialCategories
      .filter((c) => CATEGORY_TABS.some((t) => t.slug === c.slug))
      .sort((left, right) => {
        const leftIndex = CATEGORY_TABS.findIndex((t) => t.slug === left.slug);
        const rightIndex = CATEGORY_TABS.findIndex((t) => t.slug === right.slug);
        return leftIndex - rightIndex;
      });
  }, [initialCategories]);

  // Filter products based on category and search
  const products = useMemo(() => {
    let filtered = initialProducts;

    if (categorySlug) {
      filtered = filtered.filter((product) =>
        product.categories.some((category) => category.slug === categorySlug)
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search) ||
        product.categories.some((c) => c.name.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [initialProducts, categorySlug, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (localSearch.trim()) {
      url.searchParams.set("search", localSearch.trim());
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.delete("category");
    window.location.href = url.toString();
  };

  const handleCategoryClick = (slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set("category", slug);
    } else {
      url.searchParams.delete("category");
    }
    url.searchParams.delete("search");
    window.location.href = url.toString();
  };

  const getCategoryLabel = (slug: string) => {
    const tab = CATEGORY_TABS.find((t) => t.slug === slug);
    return tab?.label || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Show loading state before mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white pb-20 lg:pb-0">
        <div className="relative bg-[#1a1a1a] py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white text-center">
              SHOP
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* Hero Banner */}
      <div className="relative bg-[#1a1a1a] py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "url('https://veloriavault.com/wp-content/uploads/2026/01/Bag-14-15-16-4-scaled.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white text-center">
            {searchTerm ? "SEARCH RESULTS" : "SHOP"}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-200 border ${
                !categorySlug && !searchTerm
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-black"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-200 border ${
                  categorySlug === category.slug
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-200 hover:border-black"
                }`}
              >
                {getCategoryLabel(category.slug)}
              </button>
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

        {/* Products Grid */}
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
            <button
              onClick={() => handleCategoryClick(null)}
              className="inline-flex items-center px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-[#b59a5c] transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
