"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { Target } from "lucide-react"; 
import { UserContext } from "@/app/context/UserContext"; 
import { jwtDecode } from "jwt-decode"; 

// Interface for API Error Response
interface ApiErrorResponse {
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  
  // Access global user state methods
  const { setUserToken, setUserData } = useContext(UserContext)!;

  // Local state for form inputs and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Send login request to API
      const res = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", {
        email,
        password
      });

      if (res.data.message === "success") {
        const { token } = res.data;

        // 2. Persist token in LocalStorage to maintain session on refresh
        localStorage.setItem("userToken", token);
        
        // 3. Decode token to extract user details
        const decoded = jwtDecode(token);

        // 4. Update global context state
        setUserToken(token);
        setUserData(decoded);

        // 5. Success feedback and redirection
        toast.success("Welcome back!", { duration: 2000 });
        
        setTimeout(() => {
            router.push("/");
        }, 500);
      }

    } catch (error) {
      // Handle errors safely using AxiosError type
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || "Incorrect email or password";
      
      console.error("Login Error:", err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      
      {/* Left Side: Hero Image & Branding */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black/40"></div>
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="relative z-20 text-white text-center p-12">
            <h2 className="text-5xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-xl text-gray-200 max-w-md mx-auto">
                Join our community and access the best deals on fashion, electronics, and more.
            </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 bg-stone-50 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
            
            {/* Form Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-700 mb-4">
                    <Target size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Sign in to Target</h1>
                <p className="text-gray-500 mt-2">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaEnvelope />
                        </div>
                        <input 
                            type="email" 
                            required
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 block">Password</label>
                        <a href="#" className="text-xs font-semibold text-red-700 hover:text-red-800">Forgot password?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaLock />
                        </div>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-red-700 text-white py-3.5 rounded-xl font-bold hover:bg-red-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        "Signing in..." 
                    ) : (
                        <> <FaSignInAlt /> Sign In </>
                    )}
                </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/signup" className="font-bold text-red-700 hover:underline">
                    Create account
                </Link>
            </div>

        </div>
      </div>
    </div>
  );
}