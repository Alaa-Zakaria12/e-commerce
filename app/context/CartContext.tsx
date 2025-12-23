"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";

// Define the Context Interface
interface CartContextType {
  numOfCartItems: number;
  cartId: string | null;
  totalCartPrice: number;
  cartProducts: any[];
  addToCart: (productId: string) => Promise<any>;
  getLoggedUserCart: () => Promise<any>;
  updateCartProductQuantity: (productId: string, newCount: number) => Promise<any>;
  deleteCartItem: (productId: string) => Promise<any>;
  clearCart: () => void;
  createCashOrder: (shippingAddress: any) => Promise<any>;
  createOnlineOrder: (shippingAddress: any) => Promise<any>;
}

export const CartContext = createContext<CartContextType | null>(null);

export default function CartContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  
  // Cart State
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  
  const { userToken } = useContext(UserContext)!;

  // Helper to get headers dynamically (ensures token is fresh)
  const getHeaders = () => ({
    token: typeof window !== "undefined" ? localStorage.getItem("userToken") || "" : "",
  });

  // --- Cart Operations ---

  // 1. Add Product to Cart
  async function addToCart(productId: string) {
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/cart`, 
        { productId }, 
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        toast.success(data.message);
        setNumOfCartItems(data.numOfCartItems);
        setCartId(data.data._id);
        if(data.data.totalCartPrice) setTotalCartPrice(data.data.totalCartPrice);
      }
      return data;
    } catch (error: any) {
      toast.error("Failed to add product");
      console.error(error);
    }
  }

  // 2. Get User Cart
  async function getLoggedUserCart() {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/cart`, 
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        setNumOfCartItems(data.numOfCartItems);
        setCartId(data.data._id);
        setTotalCartPrice(data.data.totalCartPrice);
        setCartProducts(data.data.products);
      }
      return data;
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  }

  // 3. Update Item Quantity
  async function updateCartProductQuantity(productId: string, newCount: number) {
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`, 
        { count: newCount }, 
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        setNumOfCartItems(data.numOfCartItems);
        setTotalCartPrice(data.data.totalCartPrice);
        setCartProducts(data.data.products);
        toast.success("Cart updated");
      }
      return data;
    } catch (error) {
      toast.error("Failed to update cart");
    }
  }

  // 4. Remove Item from Cart
  async function deleteCartItem(productId: string) {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`, 
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        setNumOfCartItems(data.numOfCartItems);
        setTotalCartPrice(data.data.totalCartPrice);
        setCartProducts(data.data.products);
        toast.success("Item removed"); // Changed from error to success for better UX
      }
      return data;
    } catch (error) {
      toast.error("Failed to remove item");
    }
  }

  // 5. Clear Local Cart State (Used after successful checkout)
  function clearCart() {
    setNumOfCartItems(0);
    setTotalCartPrice(0);
    setCartProducts([]);
    setCartId(null);
  }

  // --- Checkout Operations ---

  // 6. Create Cash Order
  async function createCashOrder(shippingAddress: any) {
    if (!cartId) return;
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        { shippingAddress },
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        toast.success("Order Placed Successfully! 🎉");
        clearCart();
        router.push("/allorders"); 
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order");
    }
  }

  // 7. Create Online Order (Stripe Payment)
  async function createOnlineOrder(shippingAddress: any) {
    if (!cartId) return;
    try {
      // Determine current URL for redirection after payment
      const currentUrl = window.location.origin; 
      
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${currentUrl}`,
        { shippingAddress },
        { headers: getHeaders() }
      );

      if (data.status === "success") {
        toast.loading("Redirecting to payment gateway...");
        // Redirect user to Stripe checkout page
        window.location.href = data.session.url;
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize payment");
    }
  }

  // Initial fetch when user token changes
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getLoggedUserCart();
    }
  }, [userToken]);

  return (
    <CartContext.Provider value={{ 
        numOfCartItems, 
        cartId, 
        totalCartPrice, 
        cartProducts,
        addToCart, 
        getLoggedUserCart, 
        updateCartProductQuantity, 
        deleteCartItem,
        clearCart,
        createCashOrder,
        createOnlineOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}