"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { getRelativeProductLink, type WCProduct } from "@/lib/woocommerce";
import { Heart, Star } from "lucide-react";

interface PremiumProductCardProps {
  product: WCProduct;
  imageLoading?: "lazy" | "eager";
  showWishlist?: boolean;
}

export default function PremiumProductCard({
  product,
  imageLoading = "lazy",
  showWishlist = false,
}: PremiumProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const wishlisted = isInWishlist(product.id);
  const productLink = getRelativeProductLink(product);
  const price = Number(product.price || product.regular_price || 0);
  const regularPrice = Number(product.regular_price || 0);
  const onSale = product.on_sale && price < regularPrice;
  
  const image = product.images[0]?.src || "/images/bag-placeholder.svg";
  const categoryName = product.categories[0]?.name || "Luxury Bag";

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      originalPrice: onSale ? regularPrice : undefined,
      image,
      category: categoryName,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image,
      category: categoryName,
    });
    openCart();
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Image Container - Large image with rounded corners */}
      <Link href={productLink} className="block relative aspect-square overflow-hidden rounded-xl bg-[#e5e2dd]">
        {/* Wishlist Heart */}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              wishlisted 
                ? "bg-white text-red-500" 
                : "bg-white/90 text-gray-600 hover:text-red-500"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        )}

        {/* Sale Badge */}
        {onSale && (
          <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-black text-white text-[10px] font-bold tracking-wider rounded">
            SALE
          </div>
        )}

        {/* Product Image - Large, fills container */}
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={imageLoading}
        />
      </Link>

      {/* Product Info - Consistent spacing */}
      <div className="pt-3 text-center flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
          <Link href={productLink} className="hover:text-[#b59a5c] transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-xs text-gray-500 mb-2">{categoryName}</p>
        
        {/* Star Rating */}
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="text-[#b59a5c] fill-[#b59a5c]" />
          ))}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          {onSale && (
            <span className="text-xs text-gray-400 line-through">
              &#8377;{regularPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900">
            &#8377;{price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Add to Cart Button - Black like original */}
        <button
          onClick={handleAddToCart}
          className="mt-auto w-full py-2.5 bg-black text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-gray-800 transition-colors"
          style={{ fontFamily: 'var(--font-lato), sans-serif' }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
