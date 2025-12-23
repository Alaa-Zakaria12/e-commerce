"use client";

import { useContext, useEffect, useState } from "react";
import { WishlistContext } from "@/app/context/WishlistContext";
import { CartContext } from "@/app/context/CartContext"; 
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { FaTrash, FaShoppingCart, FaHeartBroken } from "react-icons/fa";

export default function WishlistPage() {
  // Access global contexts
  const { getLoggedUserWishlist, wishlistDetails, removeFromWishlist } = useContext(WishlistContext)!;
  const { addToCart } = useContext(CartContext)!; 
  
  // UI States
  const [isLoading, setIsLoading] = useState(true); // Initial page load
  const [loadingCart, setLoadingCart] = useState<string | null>(null); // Track specific button loading state

  // Fetch wishlist data on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      await getLoggedUserWishlist();
      setIsLoading(false);
    };
    fetchWishlist();
  }, []);

  // Handle Add to Cart action with local loading state
  const handleAddToCart = async (id: string) => {
    setLoadingCart(id); // Start loading for this specific item
    await addToCart(id);
    setLoadingCart(null); // Stop loading
    // Optional: removeFromWishlist(id); // Uncomment to auto-remove from wishlist after adding to cart
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading Wishlist...</div>;
  }

  return (
    <ProtectedRoute>
      <section className="bg-stone-50 min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <FaHeartBroken className="text-red-700" /> My Wishlist
          </h1>

          {/* Conditional Rendering: Empty State vs Product Grid */}
          {wishlistDetails.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-100">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">Your wishlist is empty</h2>
                <Link href="/" className="bg-stone-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">
                    Explore Products
                </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistDetails.map((product: any) => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 flex flex-col relative group">
                        
                        {/* Remove from Wishlist Button */}
                        <button 
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-4 right-4 bg-red-50 text-red-700 p-2 rounded-full hover:bg-red-700 hover:text-white transition-colors z-10"
                            title="Remove from wishlist"
                        >
                            <FaTrash size={14} />
                        </button>

                        {/* Product Image & Details Link */}
                        <Link href={`/product/${product.id}`}>
                            <div className="h-48 w-full bg-gray-50 rounded-xl overflow-hidden mb-4 p-4">
                                <img src={product.imageCover} alt={product.title} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-1 mb-1" title={product.title}>{product.title}</h3>
                            <p className="text-red-700 font-bold mb-4">{product.price} EGP</p>
                        </Link>

                        {/* Add to Cart Button */}
                        <button 
                            onClick={() => handleAddToCart(product.id)}
                            disabled={loadingCart === product.id}
                            className="mt-auto w-full border-2 border-gray-200 text-gray-700 py-2 rounded-xl font-bold hover:border-red-700 hover:text-red-700 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loadingCart === product.id ? "Adding..." : (
                                <> <FaShoppingCart /> Add to Cart </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
          )}

        </div>
      </section>
    </ProtectedRoute>
  );
}