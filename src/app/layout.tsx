import type { Metadata } from "next";
import { Inter, Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import PremiumHeader from "@/components/PremiumHeader";
import PremiumFooter from "@/components/PremiumFooter";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: {
    default: "Veloria Vault | Luxury Leather Handbags",
    template: "%s | Veloria Vault",
  },
  description:
    "Timeless leather goods for the modern minimalist. Handcrafted genuine leather handbags, totes, satchels and clutches.",
  openGraph: {
    title: "Veloria Vault | Luxury Leather Handbags",
    description: "Timeless leather goods for the modern minimalist.",
    url: "/",
    siteName: "Veloria Vault",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="top"
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} ${lato.variable} antialiased bg-[#faf8f5] text-gray-900`}
        style={{ fontFamily: 'var(--font-lato), var(--font-sans), sans-serif' }}
      >
        <PremiumHeader />
        <main>{children}</main>
        <PremiumFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
