"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/app/context/CartContext"; 
import { FaShoppingCart } from "react-icons/fa";

interface AddButtonProps {
  productId: string;
}

export default function AddButton({ productId }: AddButtonProps) {
  
  // Access global cart context
  const { addToCart } = useContext(CartContext)!;
  
  // Local state to manage loading status during API calls
  const [loading, setLoading] = useState(false);

  // Handle add-to-cart action
  const handleClick = async () => {
    setLoading(true);
    await addToCart(productId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-red-700 text-white py-3 px-8 rounded-xl font-bold hover:bg-red-800 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {/* Conditionally render loading state or default content */}
      {loading ? (
        <span>Adding...</span>
      ) : (
        <>
          <FaShoppingCart size={20} /> Add to Cart
        </>
      )}
    </button>
  );
}