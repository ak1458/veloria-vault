"use client";

import { useCartStore } from "@/store/cart";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Information" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment" },
];

export default function CheckoutPage() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 3000 ? 0 : 150;
  const total = subtotal + shipping;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    shippingMethod: "standard",
    paymentMethod: "card",
  });

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOrderPlaced(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-sm w-full text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-serif text-lg mb-4 text-gray-800">Your cart is empty</p>
          <Link href="/shop" className="bg-[#1a1a1a] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors block text-center">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="pt-32 min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-serif text-2xl text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-sm text-gray-500 mb-6 font-medium">Thank you for your purchase. Your order has been placed successfully.</p>
          <Link href="/shop" className="bg-[#1a1a1a] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors block text-center">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#faf8f5] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === s.id ? "bg-[#b59a5c] text-white" : currentStep > s.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {currentStep > s.id ? <Check size={12} /> : s.id}
                  </div>
                  <span className={`text-xs font-medium ${currentStep === s.id ? "text-gray-900 font-semibold" : "text-gray-400"}`}>{s.label}</span>
                  {idx < steps.length - 1 && <div className="h-[1px] w-8 bg-gray-200 hidden md:block" /> }
                </div>
              ))}
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-gray-800 mb-2">Customer Information</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input required type="email" placeholder="email@address.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  
                  <h3 className="font-serif text-lg text-gray-800 mt-6 mb-2">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                      <input required type="text" placeholder="John" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                      <input required type="text" placeholder="Doe" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                    <input required type="text" placeholder="Apartment, suit, street no." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                      <input required type="text" placeholder="New Delhi" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postal Code</label>
                      <input required type="text" placeholder="110001" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                    <input required type="text" placeholder="+91 9876543210" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#b59a5c]" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-gray-800 mb-2">Shipping Method</h3>
                  <div className="space-y-3">
                    <label className="border border-gray-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#b59a5c]">
                      <div className="flex items-center space-x-3">
                        <input type="radio" name="shipping" defaultChecked className="text-[#b59a5c] focus:ring-[#b59a5c]" />
                        <div>
                          <p className="text-sm font-semibold">Standard Shipping</p>
                          <p className="text-xs text-gray-400">Takes 4-7 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">{shipping > 0 ? `₹${shipping}` : "FREE"}</span>
                    </label>
                    <label className="border border-gray-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#b59a5c] opacity-60">
                      <div className="flex items-center space-x-3">
                        <input disabled type="radio" name="shipping" className="text-[#b59a5c] focus:ring-[#b59a5c]" />
                        <div>
                          <p className="text-sm font-semibold">Express Shipping (Prepaid Only)</p>
                          <p className="text-xs text-gray-400">Taking 2-3 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-400">N/A</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-gray-800 mb-2">Payment Option</h3>
                  <div className="space-y-3">
                    <label className="border border-gray-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#b59a5c]">
                      <div className="flex items-center space-x-3">
                        <input type="radio" name="payment" defaultChecked className="text-[#b59a5c]" />
                        <div className="flex items-center space-x-2">
                          <CreditCard size={20} className="text-gray-500" />
                          <p className="text-sm font-semibold">UPI / Online / Card </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs font-bold text-gray-400">
                        <span>Visa</span>
                        <span>•</span>
                        <span>RuPay</span>
                      </div>
                    </label>
                    <label className="border border-gray-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#b59a5c] opacity-60 cursor-not-allowed">
                      <div className="flex items-center space-x-3">
                        <input disabled type="radio" name="payment" className="text-[#b59a5c]" />
                        <p className="text-sm font-semibold">Cash On Delivery (Unavaliable)</p>
                      </div>
                      <span className="text-xs text-[#b59a5c] font-medium">Prepaid Only</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                {currentStep > 1 ? (
                  <button type="button" onClick={handlePrevStep} className="text-sm text-gray-500 font-medium hover:text-black">
                    Back
                  </button>
                ) : <div />}
                <button type="submit" className="flex items-center space-x-2 bg-[#1a1a1a] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b59a5c] transition-colors">
                  <span>{currentStep === 3 ? "Complete Order" : "Continue"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <h3 className="font-serif text-lg text-gray-800 mb-6 border-b border-gray-50 pb-3">Order Summary</h3>
              <div className="space-y-4 max-h-[250px] overflow-y-auto mb-6 pr-2 scrollbar-style">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 rounded border flex-shrink-0">
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-gray-900 text-white w-4 h-4 rounded-full text-center flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 truncate mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 uppercase">{item.category}</p>
                    </div>
                    <p className="font-bold text-xs text-gray-800">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><Truck size={14} /> Shipping</span>
                  <span className="font-bold text-[#b59a5c]">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
