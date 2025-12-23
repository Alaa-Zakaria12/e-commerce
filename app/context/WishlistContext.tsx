"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";

// Define Wishlist Context Interface
interface WishlistContextType {
  wishlistCount: number;
  wishlistDetails: any[]; // Array of product objects
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
  getLoggedUserWishlist: () => Promise<any>;
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

export default function WishlistContextProvider({ children }: { children: ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistDetails, setWishlistDetails] = useState<any[]>([]);
  
  const { userToken } = useContext(UserContext)!;

  // Helper to get headers dynamically
  const getHeaders = () => ({
    token: typeof window !== "undefined" ? localStorage.getItem("userToken") || "" : "",
  });

  // 1. Add Item to Wishlist
  async function addToWishlist(productId: string) {
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/wishlist`,
        { productId },
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        toast.success(data.message);
        setWishlistCount(data.data.length);
        // Note: The API returns an array of IDs here, not full product objects.
        // We rely on getLoggedUserWishlist to fetch full details if needed immediately.
      }
      return data;
    } catch (error: any) {
      toast.error("Failed to add to wishlist");
    }
  }

  // 2. Remove Item from Wishlist
  async function removeFromWishlist(productId: string) {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        toast.success(data.message);
        setWishlistCount(data.data.length);
        
        // Optimistic UI update: Filter out the removed item immediately
        const newWishlist = wishlistDetails.filter((item) => item.id !== productId);
        setWishlistDetails(newWishlist);
      }
      return data;
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  }

  // 3. Get User Wishlist
  async function getLoggedUserWishlist() {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/wishlist`, 
        { headers: getHeaders() }
      );
      
      if (data.status === "success") {
        setWishlistCount(data.count);
        setWishlistDetails(data.data); // Data here contains full product objects
      }
      return data;
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  }

  // Initial fetch when user token changes
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getLoggedUserWishlist();
    }
  }, [userToken]);

  return (
    <WishlistContext.Provider value={{ 
        wishlistCount, 
        wishlistDetails,
        addToWishlist, 
        removeFromWishlist, 
        getLoggedUserWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}