"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, User, LogOut, ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  if (!isLoggedIn) {
    return (
      <div className="pt-[100px] min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
          
          {/* Left panel - Branding/Theme */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-[#1a1a1a] text-white bg-[url('/wp-content/uploads/2026/01/auth-bg.jpg')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10">
              <Link href="/" className="font-serif text-2xl tracking-wider hover:text-[#b59a5c] transition-colors">
                VELORIA VAULT
              </Link>
              <h2 className="font-serif text-4xl mt-12 font-light leading-snug">
                Crafted for those <br />
                who value <span className="text-[#b59a5c] italic">permanence</span>.
              </h2>
            </div>
            <p className="relative z-10 text-xs text-gray-400 tracking-wider">
              &copy; {new Date().getFullYear()} Veloria Vault. All rights reserved.
            </p>
          </div>

          {/* Right panel - Forms */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {authView === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-2xl text-gray-900">Sign In</h3>
                  <p className="text-sm text-gray-400">Welcome back! Please enter your details.</p>

                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); setIsLoggedIn(true); }}>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c] text-sm" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                      <input required type="password" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c] text-sm" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300 text-[#b59a5c] focus:ring-[#b59a5c]" />
                        <span>Remember me</span>
                      </label>
                      <Link href="#" className="text-[#b59a5c] hover:underline">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full bg-[#1a1a1a] text-white py-3.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors shadow-sm">
                      Sign In
                    </button>
                  </form>

                  <p className="text-center text-xs text-gray-500 pt-4">
                    New to Veloria Vault?{" "}
                    <button onClick={() => setAuthView("register")} className="text-[#b59a5c] font-bold hover:underline">Create Account</button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-2xl text-gray-900">Create Account</h3>
                  <p className="text-sm text-gray-400">Join us for exclusive drops and offers.</p>

                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); setIsLoggedIn(true); }}>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c] text-sm" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c] text-sm" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                      <input required type="password" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c] text-sm" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-[#1a1a1a] text-white py-3.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors shadow-sm">
                      Register
                    </button>
                  </form>

                  <p className="text-center text-xs text-gray-500 pt-4">
                    Already have an account?{" "}
                    <button onClick={() => setAuthView("login")} className="text-[#b59a5c] font-bold hover:underline">Sign In</button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 tracking-wide">
            My Account
          </h1>
          <p className="text-xs text-gray-400">Welcome back, User</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl border border-gray-100 p-4 space-y-1 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium text-sm ${
                      activeTab === item.id ? "bg-[#1a1a1a] text-white" : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-500 hover:bg-red-50 transition-colors font-medium text-sm mt-4 border-t border-gray-50 pt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Content panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="font-serif text-lg md:text-xl text-gray-800 mb-6 pb-3 border-b border-gray-50">Account Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#fcf8e8] p-6 rounded-xl border border-yellow-100 text-center">
                        <p className="text-3xl font-bold text-[#b59a5c]">0</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Total Orders</p>
                      </div>
                      <div className="bg-[#faf8f5] p-6 rounded-xl border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-gray-800">0</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-serif text-lg md:text-xl text-gray-800 mb-6 pb-3 border-b border-gray-50">My Orders</h2>
                  <div className="text-center py-12 flex flex-col items-center">
                    <Package className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm mb-4">You have not placed any orders yet.</p>
                    <Link href="/shop" className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="font-serif text-lg md:text-xl text-gray-800 mb-6 pb-3 border-b border-gray-50">My Wishlist</h2>
                  <p className="text-gray-500 text-sm mb-4">Keep track of items you love.</p>
                  <Link href="/wishlist" className="inline-block text-[#b59a5c] font-bold text-sm hover:underline flex items-center space-x-1">
                    <span>View Wishlist Page</span>
                    <ChevronRight size={16} />
                  </Link>
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
                    <h2 className="font-serif text-lg md:text-xl text-gray-800">Saved Addresses</h2>
                    <button className="text-[#b59a5c] text-xs font-bold uppercase tracking-wider">+ Add New</button>
                  </div>
                  <div className="text-center py-12 flex flex-col items-center">
                    <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No saved addresses</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
