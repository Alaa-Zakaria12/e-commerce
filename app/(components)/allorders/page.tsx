"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function AllOrdersPage() {
  // State management for orders list and loading status
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders specific to the logged-in user
  async function getUserOrders() {
    try {
      // Retrieve token and decode to extract User ID
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded.id;

      // Fetch user orders from API using the extracted ID
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`);
      
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Trigger fetch on component mount
  useEffect(() => {
    getUserOrders();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading Orders...</div>;
  }

  return (
    <ProtectedRoute>
      <section className="bg-stone-50 min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <FaBoxOpen className="text-red-700" /> My Orders History
          </h1>

          {/* Render empty state or list of orders */}
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-100">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">No orders found yet</h2>
                <Link href="/" className="bg-red-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-800 transition">
                    Start Shopping
                </Link>
            </div>
          ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                        
                        {/* Order Header: ID & Status Badges */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                            <div>
                                <h3 className="text-gray-500 text-sm">Order ID</h3>
                                <p className="font-bold text-gray-800">#{order.id}</p>
                            </div>
                            
                            <div className="flex gap-3">
                                {/* Payment Status Badge */}
                                {order.isPaid ? (
                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                        <FaCheckCircle /> Paid
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                                        <FaTimesCircle /> Unpaid
                                    </span>
                                )}

                                {/* Delivery Status Badge */}
                                {order.isDelivered ? (
                                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                        <FaCheckCircle /> Delivered
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                                        <FaClock /> Processing
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Order Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {order.cartItems.map((item: any) => (
                                <div key={item._id} className="flex items-center gap-3 bg-stone-50 p-2 rounded-lg">
                                    <img 
                                        src={item.product.imageCover} 
                                        alt={item.product.title} 
                                        className="w-16 h-16 object-contain bg-white rounded-md border border-stone-200"
                                    />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.title}</h4>
                                        <p className="text-xs text-gray-500">
                                            {item.count} x {item.price} EGP
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer: Payment Method & Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-gray-500 text-sm">Payment Method</p>
                                <p className="font-bold text-gray-800 uppercase">{order.paymentMethodType}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm">Total Amount</p>
                                <p className="text-2xl font-bold text-red-700">{order.totalOrderPrice} EGP</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
          )}

        </div>
      </section>
    </ProtectedRoute>
  );
}