"use client";

import { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

// Configuration for static slider images
const slides = [
  { id: 1, img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" }, // General Shopping
  { id: 2, img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" }, // Fashion
  { id: 3, img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" }, // Electronics
];

export default function MainSlider() {
  const [current, setCurrent] = useState(0);

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  // Auto-slide functionality (interval: 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => { nextSlide(); }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-gray-100 mb-8 shadow-sm">
      
      {/* Render slides with fade transition */}
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.img})` }} />
        </div>
      ))}

      {/* Navigation Controls */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full transition-all text-gray-800" aria-label="Previous Slide">
        <FaChevronLeft />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-3 rounded-full transition-all text-gray-800" aria-label="Next Slide">
        <FaChevronRight />
      </button>
      
    </div>
  );
}