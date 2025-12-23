"use client";

import { useState, useContext } from "react";
import { CartContext } from "@/app/context/CartContext";
import { FaMoneyBillWave, FaCreditCard, FaMapMarkerAlt, FaPhone, FaCity } from "react-icons/fa";
import ProtectedRoute from "@/components/ProtectedRoute";

// Define interface for form data to ensure type safety
interface CheckoutFormData {
  details: string;
  phone: string;
  city: string;
}

export default function CheckoutPage() {
  // Access cart methods from Global Context
  const { createCashOrder, createOnlineOrder, cartId } = useContext(CartContext)!;
  
  // Local state for form inputs
  const [formData, setFormData] = useState<CheckoutFormData>({
    details: "",
    phone: "",
    city: ""
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Trigger appropriate context function based on selected method
    if (paymentMethod === "cash") {
      await createCashOrder(formData);
    } else {
      await createOnlineOrder(formData);
    }
    
    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-stone-50 py-12 px-4 flex justify-center items-center">
        <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-xl border border-stone-100">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shipping Details</h1>
          <p className="text-gray-500 mb-8">Please enter your delivery information.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Address Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaMapMarkerAlt />
                </div>
                <input 
                    type="text" 
                    required
                    placeholder="Street Details / Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
            </div>

            {/* Phone Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaPhone />
                </div>
                <input 
                    type="tel" 
                    required
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
            </div>

            {/* City Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaCity />
                </div>
                <input 
                    type="text" 
                    required
                    placeholder="City"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Cash Option */}
                <div 
                    onClick={() => setPaymentMethod("cash")}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "cash" ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                    <FaMoneyBillWave size={24} />
                    <span className="font-bold">Cash on Delivery</span>
                </div>

                {/* Online Option */}
                <div 
                    onClick={() => setPaymentMethod("online")}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "online" ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                    <FaCreditCard size={24} />
                    <span className="font-bold">Pay Online</span>
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={isLoading || !cartId}
                className="w-full bg-red-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-all shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
                {isLoading ? "Processing..." : (paymentMethod === "cash" ? "Place Order (Cash)" : "Proceed to Payment")}
            </button>

          </form>
        </div>
      </section>
    </ProtectedRoute>
  );
}