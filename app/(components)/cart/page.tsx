"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/app/context/CartContext"; 
import ProtectedRoute from "@/components/ProtectedRoute"; 
import Link from "next/link";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";

export default function CartPage() {
  // Access cart methods and state from Context
  const { 
    getLoggedUserCart, 
    cartProducts, 
    totalCartPrice, 
    numOfCartItems,
    updateCartProductQuantity,
    deleteCartItem
  } = useContext(CartContext)!;

  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      await getLoggedUserCart();
      setIsLoading(false);
    };
    fetchCart();
  }, []); 

  // Handler for updating item quantity (prevents count below 1)
  const handleUpdateQuantity = (id: string, count: number) => {
    if (count < 1) return; 
    updateCartProductQuantity(id, count);
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading Cart...</div>;
  }

  return (
    <ProtectedRoute>
      <section className="bg-stone-50 min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <FaShoppingBag className="text-red-700" /> My Shopping Cart
          </h1>

          {/* Conditional Rendering: Empty Cart State */}
          {cartProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
                <Link href="/" className="bg-red-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-800 transition">
                    Start Shopping
                </Link>
            </div>
          ) : (
            // Conditional Rendering: Populated Cart State
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Cart Items List */}
                <div className="flex-grow space-y-4">
                    {cartProducts.map((item: any) => (
                        <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row items-center gap-6 relative">
                            
                            {/* Product Image */}
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                                <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-contain" />
                            </div>

                            {/* Product Details */}
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="font-bold text-lg text-gray-800">{item.product.title}</h3>
                                <p className="text-gray-500 text-sm">{item.price} EGP</p>
                                <p className="text-red-700 font-bold mt-1">Total: {item.price * item.count} EGP</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-lg">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product.id, item.count - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full hover:bg-red-50 text-red-700 transition"
                                >
                                    <FaMinus size={10} />
                                </button>
                                <span className="font-bold text-lg w-6 text-center">{item.count}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product.id, item.count + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full hover:bg-red-50 text-red-700 transition"
                                >
                                    <FaPlus size={10} />
                                </button>
                            </div>

                            {/* Remove Item Button */}
                            <button 
                                onClick={() => deleteCartItem(item.product.id)}
                                className="text-gray-400 hover:text-red-600 transition p-2"
                                title="Remove item"
                            >
                                <FaTrash size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h3>
                        
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Total Items</span>
                            <span className="font-bold">{numOfCartItems}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-6 text-2xl font-bold text-red-700">
                            <span>Total Price</span>
                            <span>{totalCartPrice} EGP</span>
                        </div>

                        {/* Navigate to Checkout Page */}
                        <Link 
                            href="/checkout"
                            className="block w-full text-center bg-red-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition shadow-red-200 shadow-lg"
                        >
                            Checkout Now
                        </Link>
                    </div>
                </div>

            </div>
          )}

        </div>
      </section>
    </ProtectedRoute>
  );
}