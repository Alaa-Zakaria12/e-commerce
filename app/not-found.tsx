import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      
      {/* Background Decoration: Large transparent 404 text for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="text-[20rem] font-black text-gray-100 opacity-60">404</span>
      </div>

      {/* Main Content Card with Glassmorphism effect */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full">
        
        {/* Animated Warning Icon */}
        <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-6 rounded-full text-red-600 animate-bounce">
                <FaExclamationTriangle size={40} />
            </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Page Not Found</h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Return Home Button */}
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <FaHome /> Go to Homepage
        </Link>
      </div>

    </section>
  );
}