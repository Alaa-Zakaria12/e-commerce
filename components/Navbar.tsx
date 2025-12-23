"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "@/app/context/UserContext"; 
import { CartContext } from "@/app/context/CartContext"; 
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaSignOutAlt, FaBoxOpen, FaHeart, FaChevronDown } from "react-icons/fa";
import { Target } from "lucide-react"; 

export default function Navbar() {
  // UI States for menus
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Desktop profile dropdown
  
  const router = useRouter();
  const pathname = usePathname();

  // Access Global Contexts (Auth & Cart)
  const { userToken, setUserToken, userData } = useContext(UserContext)!;
  const { numOfCartItems } = useContext(CartContext)!;

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUserToken(null);
    router.push("/login");
  };

  // Handle click outside to close dropdown menu
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main navigation links configuration
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/product" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 text-red-700 font-bold text-2xl">
            <Target size={32} />
            <span>Target</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`font-medium transition-colors hover:text-red-700 ${
                  pathname === link.href ? "text-red-700 border-b-2 border-red-700" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Authentication & User Controls */}
          <div className="hidden md:flex items-center gap-6">
            
            {userToken ? (
              <div className="flex items-center gap-4">
                
                {/* Cart Icon with Counter */}
                <Link href="/cart" className="relative text-gray-700 hover:text-red-700 transition-colors">
                  <FaShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {numOfCartItems}
                  </span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 text-gray-700 hover:text-red-700 font-semibold transition-colors focus:outline-none"
                    >
                        <span className="bg-red-100 text-red-700 p-2 rounded-full"><FaUser size={14}/></span>
                        <span>Hi, {userData?.name || "User"}</span>
                        <FaChevronDown size={12} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu Content */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-fadeIn">
                            
                            <Link 
                                href="/allorders" 
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <FaBoxOpen /> My Orders
                            </Link>
                            
                            <Link 
                                href="/wishlist" 
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <FaHeart /> Wishlist
                            </Link>

                            <div className="h-px bg-gray-100 my-1 mx-4"></div>

                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    )}
                </div>

              </div>
            ) : (
              // Guest State (Login/Register)
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-700 font-medium hover:text-red-700">Login</Link>
                <Link 
                  href="/signup" 
                  className="bg-red-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-800 transition-shadow shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Toggle Button */}
          <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-stone-50 pb-4 rounded-b-2xl shadow-inner">
            <div className="flex flex-col space-y-4 p-4">
              
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-gray-700 hover:text-red-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-200" />
              
              {/* Mobile User Controls */}
              {userToken ? (
                <>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <FaUser /> Signed in as <span className="font-bold text-gray-800">{userData?.name}</span>
                  </div>
                  
                  <Link href="/cart" className="flex items-center gap-2 text-gray-700 font-bold hover:text-red-700" onClick={() => setIsOpen(false)}>
                     <FaShoppingCart /> Cart ({numOfCartItems})
                  </Link>
                  
                  <Link href="/allorders" className="flex items-center gap-2 text-gray-700 font-bold hover:text-red-700" onClick={() => setIsOpen(false)}>
                     <FaBoxOpen /> My Orders
                  </Link>

                  <Link href="/wishlist" className="flex items-center gap-2 text-gray-700 font-bold hover:text-red-700" onClick={() => setIsOpen(false)}>
                     <FaHeart /> Wishlist
                  </Link>

                  <button onClick={handleLogout} className="text-red-700 font-bold flex items-center gap-2 mt-2">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="text-center w-full py-2 border border-gray-300 rounded-lg text-gray-700">Login</Link>
                  <Link href="/signup" className="text-center w-full py-2 bg-red-700 text-white rounded-lg">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}