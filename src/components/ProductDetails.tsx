"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { WCProduct } from "@/lib/woocommerce";
import { Heart, ChevronLeft, ChevronRight, Star, Check, Share2, Facebook, Twitter, Instagram, Linkedin, Minus, Plus, ArrowLeftRight } from "lucide-react";

interface ProductDetailsProps {
  product: WCProduct;
  variations: WCProduct[];
}

const colorMap: Record<string, string> = {
  "aria brown": "#734e3e",
  "burgundy": "#570c1b",
  "teal green": "#1c4942",
  "black": "#1a1a1b",
  "brown": "#8b5a2c",
  "tan": "#d2b48c",
  "red": "#e62222",
};

const getSwatchColor = (colorName: string) => {
  const normalized = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key)) return value;
  }
  return "#e2e8f0"; 
};

export default function ProductDetails({ product, variations }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariation, setSelectedVariation] = useState<WCProduct | null>(null);
  const [thumbsIndex, setThumbsIndex] = useState(0);


  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { isInWishlist, toggleItem } = useWishlistStore();
  
  const wishlisted = isInWishlist(product.id);
  
  // Get variation options for color swatches FIRST
  const variationOptions = variations.map(v => {
    const colorAttr = v.attributes.find(a => a.slug === "pa_color" || a.name.toLowerCase().includes("color"));
    return {
      id: v.id,
      color: colorAttr?.option || "",
      slug: v.slug,
      image: (v as any).image?.src || v.images?.[0]?.src || product.images?.[0]?.src || "/images/bag-placeholder.svg",
      price: v.price,
      product: v,
    };
  }).filter(v => v.color);

  // Parent product images — these are always the gallery source of truth
  // WooCommerce returns images in the order set by the admin (cover image first)
  const parentImages = product.images?.length > 0 
    ? product.images 
    : [{ id: 0, src: "/images/bag-placeholder.svg", alt: product.name }];

  // Build the display gallery:
  // - No variation selected: show parent images as-is (WooCommerce order preserved)
  // - Variation selected: put variation's featured image first, then remaining parent images
  const images = (() => {
    if (!selectedVariation) return parentImages;
    
    // Get the variation's featured image
    const variationImageSrc = (selectedVariation as any)?.image?.src 
      || selectedVariation.images?.[0]?.src;
    
    if (!variationImageSrc) return parentImages;
    
    // Create the variation featured image entry
    const variationImage = {
      id: selectedVariation.id,
      src: variationImageSrc,
      alt: selectedVariation.name || product.name,
    };
    
    // Append the rest of the parent gallery (skip the parent's cover image to avoid confusion)
    const restOfGallery = parentImages.slice(1);
    return [variationImage, ...restOfGallery];
  })();
    
  const displayProduct = selectedVariation || product;
  const price = Number(displayProduct.price || displayProduct.regular_price || 0);
  const regularPrice = Number(displayProduct.regular_price || 0);
  const onSale = displayProduct.on_sale && price < regularPrice;
  const categoryName = product.categories?.[0]?.name || "Luxury Bag";
  const categorySlug = product.categories?.[0]?.slug || "bags";

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleVariationSelect = (variation: typeof variationOptions[0]) => {
    setSelectedImage(0);
    setThumbsIndex(0); // Reset slider bounds
    if (selectedVariation?.id === variation.id) {
      setSelectedVariation(null);
    } else {
      setSelectedVariation(variation.product);
    }
  };

  const handleClearVariation = () => {
    setSelectedVariation(null);
    setSelectedImage(0);
    setThumbsIndex(0);
  };

  const handleAddToCart = () => {
    addItem({
      id: displayProduct.id,
      name: displayProduct.name,
      slug: displayProduct.slug,
      price,
      image: images[selectedImage]?.src || "",
      category: categoryName,
    });
    openCart();
  };

  const handleWishlistToggle = () => {
    toggleItem({
      id: displayProduct.id,
      name: displayProduct.name,
      slug: displayProduct.slug,
      price,
      originalPrice: onSale ? regularPrice : undefined,
      image: images[selectedImage]?.src || "",
      category: categoryName,
    });
  };

  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "additional", label: "ADDITIONAL INFO" },
    { id: "reviews", label: `REVIEWS (${product.rating_count || 0})` },
    { id: "shipping", label: "SHIPPING" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-screen bg-[#faf8f5] px-4 md:px-6">
        {/* Image Gallery */}
        <div className="lg:col-span-7 bg-[#faf8f5] p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Desktop Thumbnails (Vertical Slider) */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col items-center gap-2 w-24 flex-shrink-0">
                <button 
                  onClick={() => setThumbsIndex(Math.max(0, thumbsIndex - 1))}
                  disabled={thumbsIndex === 0}
                  className={`p-1 transition-colors ${thumbsIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-[#b59a5c]"}`}
                >
                  <ChevronLeft size={20} className="rotate-90" />
                </button>
                
                <div className="flex flex-col gap-3 w-full">
                  {images.slice(thumbsIndex, thumbsIndex + 3).map((image, i) => {
                    const globalIndex = thumbsIndex + i; 
                    return (
                      <button
                        key={globalIndex}
                        onClick={() => setSelectedImage(globalIndex)}
                        className={`aspect-square w-full bg-white overflow-hidden border-2 transition-all ${
                          selectedImage === globalIndex 
                            ? "border-[#b59a5c]" 
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt || `${product.name} ${globalIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setThumbsIndex(Math.min(images.length - 3, thumbsIndex + 1))}
                  disabled={thumbsIndex >= images.length - 3}
                  className={`p-1 transition-colors ${thumbsIndex >= images.length - 3 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-[#b59a5c]"}`}
                >
                  <ChevronRight size={20} className="rotate-90" />
                </button>
              </div>
            )}

            {/* Main Featured Image Container */}
            <div className="flex-1 relative aspect-square flex items-center justify-center overflow-hidden group">
              <img
                src={images[selectedImage]?.src}
                alt={images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Thumbnail Gallery (Horizontal) */}
          {images.length > 1 && (
            <div className="flex md:hidden gap-2 overflow-x-auto px-1 pb-4 pt-4 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-[#b59a5c]" 
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Sticky sidebar */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:overflow-y-auto px-4 py-8 md:p-12 md:px-16 bg-[#faf8f5] flex flex-col">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/shop?category=${categorySlug}`} className="hover:text-black transition-colors capitalize">
                {categoryName}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Share2 size={18} className="text-gray-600" />
              </button>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </nav>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-serif text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < (Math.round(Number(product.average_rating)) || 5) 
                    ? "text-[#b59a5c] fill-[#b59a5c]" 
                    : "text-gray-300"
                  } 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.rating_count || 3} customer reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl md:text-2xl font-semibold text-[#b59a5c]">
              &#8377;{price.toLocaleString("en-IN")}.00
            </span>
            {onSale && (
              <span className="text-sm text-gray-400 line-through">
                &#8377;{regularPrice.toLocaleString("en-IN")}.00
              </span>
            )}
          </div>

          {/* Short Description */}
          <div className="text-gray-600 text-sm leading-relaxed mb-5">
            {product.short_description ? (
              <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
            ) : (
              <p>Some bags are for special occasions. <em className="italic">{product.name}</em> is for every occasion. It&apos;s just as perfect sitting next to you at a café while you sketch on your iPad as it is on a weekend getaway.</p>
            )}
          </div>

          {/* Color Selection with Image Swatches */}
          {variationOptions.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700">color:</span>
                <span className="text-sm text-gray-900">{selectedVariation?.attributes.find(a => a.slug === "pa_color")?.option || variationOptions[0]?.color}</span>
              </div>
              
              {/* Image Swatches */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {variationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVariationSelect(option)}
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded overflow-hidden border-2 transition-all ${
                      selectedVariation?.id === option.id
                        ? "border-[#b59a5c] ring-1 ring-[#b59a5c]/30" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    title={option.color}
                  >
                    <img
                      src={option.image}
                      alt={option.color}
                      className="w-full h-full object-cover"
                    />
                    {selectedVariation?.id === option.id && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Check size={14} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Clear Button */}
              {selectedVariation && (
                <button 
                  onClick={handleClearVariation}
                  className="text-xs text-gray-500 hover:text-[#b59a5c] flex items-center gap-1"
                >
                  <span>×</span> Clear
                </button>
              )}
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm mb-5">
            <Check size={16} className="text-green-600" />
            <span className="text-green-600 font-medium">In stock</span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3 mb-5">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 h-11 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 h-full hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 min-w-[40px] text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 h-full hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-11 bg-[#b59a5c] text-white font-medium tracking-wider uppercase text-sm hover:bg-[#a08a4f] transition-colors"
            >
              ADD TO CART
            </button>
          </div>

          {/* Compare & Wishlist */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#b59a5c] transition-colors text-sm">
              <ArrowLeftRight size={16} />
              <span>Add to compare</span>
            </button>
            <button 
              onClick={handleWishlistToggle}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm"
            >
              <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
              <span>Add to wishlist</span>
            </button>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-sm text-gray-600 pb-6 border-b border-gray-200">
            {displayProduct.sku && (
              <div className="flex gap-2">
                <span className="text-gray-900 font-medium">SKU:</span>
                <span>{displayProduct.sku}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gray-900 font-medium">Category:</span>
              <Link href={`/shop?category=${categorySlug}`} className="hover:text-[#b59a5c] capitalize">
                {categoryName}
              </Link>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-900 font-medium">Tag:</span>
              <span>{product.name}</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-gray-900 font-medium">Share:</span>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-[#b59a5c] transition-colors">
                  <Facebook size={14} />
                </button>
                <button className="text-gray-400 hover:text-[#b59a5c] transition-colors">
                  <Twitter size={14} />
                </button>
                <button className="text-gray-400 hover:text-[#b59a5c] transition-colors">
                  <Instagram size={14} />
                </button>
                <button className="text-gray-400 hover:text-[#b59a5c] transition-colors">
                  <Linkedin size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium tracking-wide transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "text-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b59a5c]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-4 py-8 md:py-12">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <>
                    <p className="mb-4">Some bags are for special occasions. <em>{product.name}</em> is for every occasion. It&apos;s just as perfect sitting next to you at a café while you sketch on your iPad as it is on a weekend getaway.</p>
                    <ul className="space-y-2 mb-4 list-none pl-0">
                      {[
                        "Zip pocket and slip pocket for easy organisation",
                        "Space for a 10-inch iPad",
                        "Pen holder and card slots for quick access",
                        "Dog-hook keychain to keep keys secure",
                        "Magnetic button inside for small metallic accessories",
                        "Detachable and adjustable shoulder strap",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#b59a5c] mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === "additional" && (
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Width", value: "36 cm" },
                    { label: "Height", value: "28 cm" },
                    { label: "Weight", value: "0.8 kg" },
                    { label: "Hardware", value: "Premium rose gold-toned" },
                    { label: "Zipper", value: "YKK metal" },
                  ].map((spec, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 text-gray-700 font-medium w-1/3">{spec.label}</td>
                      <td className="py-3 text-gray-500">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4 text-xs">No reviews yet. Be the first to review this product!</p>
                <button className="px-5 py-2 bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors">
                  Write a Review
                </button>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="prose prose-sm text-gray-600">
                <p className="mb-3">We offer free shipping on all orders above ₹3000. Orders are typically processed within 1-2 business days.</p>
                <ul className="space-y-1 list-none pl-0">
                  <li>• Free shipping on orders above ₹3000</li>
                  <li>• Standard delivery: 5-7 business days</li>
                  <li>• Cash on delivery available</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
