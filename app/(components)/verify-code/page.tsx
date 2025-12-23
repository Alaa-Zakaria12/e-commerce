"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaKey } from "react-icons/fa";
import { Target } from "lucide-react"; 

interface ApiErrorResponse {
  message: string;
}

export default function VerifyCodePage() {
  const router = useRouter();
  
  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call API to verify the code
      // Note: The API expects the code as a string
      const res = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", {
        resetCode: resetCode
      });

      if (res.data.status === "Success") {
        toast.success("Code verified successfully");
        // 2. Redirect to the create new password page
        router.push("/reset-password"); 
      }

    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || "Invalid or expired code";
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
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Code</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please enter the verification code sent to your email.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaKey />
            </div>
            <input
                type="text"
                required
                placeholder="Enter verification code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm tracking-widest text-center font-bold text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

      </div>
    </div>
  );
}