import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import UserContextProvider from "@/app/context/UserContext";
import CartContextProvider from "@/app/context/CartContext";
import WishlistContextProvider from "@/app/context/WishlistContext"; 
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          <CartContextProvider>
            <WishlistContextProvider> 
            
                <Toaster position="top-right" />
                <Navbar />
                {children}
            
            </WishlistContextProvider>
          </CartContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}