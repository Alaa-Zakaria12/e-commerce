"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";
import { Target } from "lucide-react"; 

interface ApiErrorResponse {
  message: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call API to send reset code to email
      const res = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        email
      });

      if (res.data.statusMsg === "success") {
        toast.success("Reset code sent to your email");
        // 2. Redirect to the verification page
        router.push("/verify-code"); 
      }

    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope />
            </div>
            <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

      </div>
    </div>
  );
}