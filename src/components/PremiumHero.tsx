"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Desktop and mobile use different hero images
const DESKTOP_HERO_IMAGE = "https://veloriavault.com/wp-content/uploads/2026/02/Bag-9-10-3-scaled.jpg";
// Mobile uses the red background image from reference
const MOBILE_HERO_IMAGE = "https://veloriavault.com/wp-content/uploads/2026/02/Bag-17-18-19-20-21-22-4-scaled.jpg";

export default function PremiumHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-bg",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5 }
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=1"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[70vh] md:h-[80vh] lg:h-[85vh] flex items-start lg:items-center pt-50 lg:pt-0 overflow-hidden"
    >
      {/* Desktop Background Image - Gray/brown with model */}
      <div
        className="hero-bg hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${DESKTOP_HERO_IMAGE}')`,
          backgroundPosition: "center 30%",
          zIndex: 0,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Mobile Background Image - Red background with model and bags */}
      <div
        className="hero-bg lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${MOBILE_HERO_IMAGE}')`,
          backgroundPosition: "center center",
          zIndex: 0,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content - Desktop: Left aligned, Mobile: Center aligned */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl text-white lg:text-left text-left mx-20 lg:mx-0">

          <h1
            ref={titleRef}
            className="text-3xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-3 lg:mb-6 tracking-tight"
          >
            <span className="block">LUXURY</span>
            <span className="block italic font-light">locked in leather</span>
          </h1>

          {/* Mobile: Very short text, NO button */}
          <p
            ref={subtitleRef}
            className="lg:hidden text-xs text-gray-100 max-w-[260px] mx-auto leading-relaxed font-light"
          >
            Each piece holds more than design. It is a possession. A presence. A promise.
          </p>

          {/* Desktop: Full text with buttons */}
          <div className="hidden lg:block">
            <p className="text-base lg:text-lg text-gray-200 max-w-lg mb-8 leading-relaxed font-light tracking-wide">
              Each piece holds more than design. It is a possession. A presence. A promise. Handcrafted for the modern minimalist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
