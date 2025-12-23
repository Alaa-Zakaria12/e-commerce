"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from "react-icons/fa";
import { Target } from "lucide-react"; 

// 1. Define Zod Validation Schema
// Enforces strict rules for registration fields
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rePassword: z.string().min(6, "rePassword must be at least 6 characters"),
  // Regex to validate Egyptian phone numbers (010, 011, 012, 015)
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid phone number (must be 010/011/012/015)"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"], // Attach error to the rePassword field
});

// Type definition for mapped validation errors
type FormErrors = {
  [key: string]: string[] | undefined;
};

// Interface for API Error Response
interface ApiErrorResponse {
  message: string;
}

export default function SignupPage() {
  const router = useRouter();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: ""
  });

  // State for validation errors and loading status
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error immediately when user types to improve UX
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Reset previous errors

    // 1. Validate data using Zod
    const result = signupSchema.safeParse(formData);

    // 2. Handle Validation Failures
    if (!result.success) {
      // Map Zod errors to the corresponding fields
      setErrors(result.error.flatten().fieldErrors);
      
      setIsLoading(false);
      return; // Stop execution
    }

    // 3. Submit Valid Data to API
    try {
      const res = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", formData);

      if (res.data.message === "success") {
        // Success Feedback
        toast.success("Account created successfully!");
        
        // Redirect to login after a short delay
        setTimeout(() => {
            router.push("/login");
        }, 1500);
      }

    } catch (error) {
      // Handle API Errors safely
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = err.response?.data?.message || "Sign up failed";
      
      console.error("Signup Error:", err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            {/* --- Name Input --- */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  // Conditional styling for error state
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                />
              </div>
              {/* Error Message Display */}
              {errors.name && <p className="text-red-600 text-xs mt-1 ml-1 font-medium">{errors.name[0]}</p>}
            </div>

            {/* --- Email Input --- */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  name="email"
                  type="text"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1 ml-1 font-medium">{errors.email[0]}</p>}
            </div>

            {/* --- Phone Input --- */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaPhone />
                </div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number (01xxxxxxxxx)"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1 ml-1 font-medium">{errors.phone[0]}</p>}
            </div>

            {/* --- Password Input --- */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                />
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1 ml-1 font-medium">{errors.password[0]}</p>}
            </div>

            {/* --- Re-Password Input --- */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  name="rePassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.rePassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.rePassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                />
              </div>
              {errors.rePassword && <p className="text-red-600 text-xs mt-1 ml-1 font-medium">{errors.rePassword[0]}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 mt-6"
            >
              {isLoading ? "Creating Account..." : (
                  <span className="flex items-center gap-2">
                      <FaUserPlus /> Sign Up
                  </span>
              )}
            </button>

          <div className="text-center text-sm text-gray-500 mt-4">
             Already have an account?{' '}
             <Link href="/login" className="font-bold text-red-700 hover:underline">
                 Login here
             </Link>
          </div>

        </form>
      </div>
    </div>
  );
}