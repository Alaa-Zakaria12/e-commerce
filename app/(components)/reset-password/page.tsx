"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Target } from "lucide-react"; 

interface ApiErrorResponse {
  message: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call API to update the password
      // Note: This API requires HTTP PUT method
      const res = await axios.put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        email: email,
        newPassword: newPassword
      });

      // 2. Check for token in response (indicates success)
      if (res.data.token) {
        toast.success("Password reset successfully! Please login.");
        router.push("/login"); 
      }

    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || "Failed to reset password";
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
          <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Create a new strong password for your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Input (Required by API to identify user) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope />
            </div>
            <input
                type="email"
                required
                placeholder="Confirm your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4"
            />
          </div>

          {/* New Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaLock />
            </div>
            <input
                type="password"
                required
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
}