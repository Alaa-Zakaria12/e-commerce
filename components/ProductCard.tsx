"use client";

import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/app/context/CartContext";
import { WishlistContext } from "@/app/context/WishlistContext";
import Link from "next/link";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductProps {
  imageCover: string;
  title: string;
  price: number;
  category: { name: string };
  description: string;
  ratingsAverage: number;
  id?: string | number;
  _id?: string; 
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  
  // Access global contexts
  const { addToCart } = useContext(CartContext)!;
  const { addToWishlist, removeFromWishlist, wishlistDetails } = useContext(WishlistContext)!;
  
  // Local state to track wishlist status for this specific product
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Sync local state with global wishlist data
  useEffect(() => {
    // Check if the current product ID exists in the global wishlist array
    const exists = wishlistDetails.some((item: any) => item.id === product._id);
    
    // FIX: Only update state if the value has actually changed to prevent infinite loops
    setIsInWishlist((prev) => {
        if (prev !== exists) return exists;
        return prev;
    });
  }, [wishlistDetails, product._id]);

  // Handle Wishlist Toggle (Add/Remove)
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to details page
    
    if (isInWishlist) {
      removeFromWishlist(product._id!);
    } else {
      addToWishlist(product._id!);
    }
    
    // Optimistic UI update for better user experience
    setIsInWishlist(!isInWishlist);
  };

  // Handle Add to Cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product._id!);
  }

  return (
    <div className="block h-full group relative">
      
      {/* Wishlist Toggle Button (Heart Icon) */}
      <button 
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-300"
        aria-label="Toggle Wishlist"
      >
        {isInWishlist ? (
            <FaHeart className="text-red-600 text-xl animate-pulse" /> 
        ) : (
            <FaRegHeart className="text-gray-600 text-xl hover:text-red-600" />
        )}
      </button>

      {/* Main Product Link */}
      <Link href={`/product/${product._id}`}>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            
            {/* Product Image */}
            <div className="relative h-64 w-full bg-gray-100">
            <img 
                src={product.imageCover} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col flex-grow">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                {product.category?.name}
            </span>

            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                {product.title}
            </h3>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                {product.description}
            </p>

            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100">
                <span className="text-xl font-bold text-gray-900">
                {product.price} EGP
                </span>
                
                <div className="flex items-center gap-1 text-yellow-500">
                <FaStar size={16} />
                <span className="text-sm font-medium text-gray-700">
                    {product.ratingsAverage}
                </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button 
                onClick={handleAddToCart}
                className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
                <FaShoppingCart size={18} />
                Add to Cart
            </button>

            </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;