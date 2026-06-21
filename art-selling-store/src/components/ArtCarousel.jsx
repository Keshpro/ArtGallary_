"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ArtCarousel() {
  // මෙතනට ඔයාට ඕන කරන Ads හෝ Featured Art Images, Titles, Descriptions දාන්න පුළුවන්
  const slides = [
    {
      id: 1,
      title: "Exclusive Midnight Collection",
      subtitle: "Get up to 20% off on premium oil paintings this week.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Meet The Master Artists",
      subtitle: "Join our upcoming dynamic virtual live art auction exhibition.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Custom Charcoal Portraits",
      subtitle: "Order bespoke charcoal masterpieces handcrafted directly from your photos.",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Autoplay Effect (සෑම තත්පර 5කට වරක් ස්ලයිඩරය ඔටෝම මාරු වේ)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 relative group">
      <div className="w-full h-[300px] md:h-[450px] rounded-2xl relative overflow-hidden bg-zinc-900 border border-zinc-800">
        
        {/* Slide Wrapper */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative flex-shrink-0">
              {/* Dark Overlay for Luxury Look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover opacity-80"
              />
              {/* Content Box */}
              <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-20 max-w-xl pr-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2 block">Featured Spot</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-4 z-20 p-2 rounded-full bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 transition opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-4 z-20 p-2 rounded-full bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 transition opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === i ? "bg-amber-500 w-6" : "bg-zinc-600"}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}