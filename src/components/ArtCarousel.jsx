"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🔥 ඇඩ්මින් පැනල් එකෙන් තොරව ස්ථාවරව ක්‍රියාත්මක වන ප්‍රිමියම් කැරූසල් දත්ත පද්ධතිය
const STATIC_SLIDES = [
  {
    id: "slide-1",
    title: "Premium Curation for Luxury Cafes",
    subtitle: "Transform your bistro walls into a high-end gallery space with Aggrani's bold oil pastel masterpieces. Connect with our studio today for exclusive commercial packages and special offers.",
    image: "/img/carousel1.jpeg"
  },
  {
    id: "slide-2",
    title: "Bespoke Spatial Architecture",
    subtitle: "Custom-tailored vibrant oil pastel illustrations and fine-line animal symbolism. Engineered to elevate modern espresso bistros and premium hospitality environments.",
    image: "/img/carousel2.jpeg"
  },
  {
    id: "slide-3",
    title: "Spatial Texture Symphony",
    subtitle: "Handcrafted using archival materials designed to elevate high-end bistros, corporate lounges, and luxury spaces.",
    image: "/img/carousel3.jpeg"
  }
];

export default function ArtCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? STATIC_SLIDES.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === STATIC_SLIDES.length - 1 ? 0 : prev + 1));

  // ස්වයංක්‍රීයව තත්පර 5න් 5ට ස්ලයිඩර් එක මාරු වීමේ ලොජික් එක
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 relative group select-none">
      <div className="w-full h-[280px] md:h-[380px] rounded-2xl relative overflow-hidden bg-zinc-950 border border-zinc-900/60 shadow-lg">
        
        {/* Sliding Wrapper */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {STATIC_SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative flex-shrink-0">
              {/* Dark Glassy Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
              
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover opacity-50 transition-scale duration-500 group-hover:scale-[1.01]" 
              />
              
              {/* Promotional Content Text Area */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 max-w-xl animate-in fade-in duration-500">
                <span className="text-[8px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md mb-2.5 inline-block">
                  Live Spotlight
                </span>
                <h2 className="text-xl md:text-3xl font-black text-zinc-100 mb-1.5 uppercase tracking-tight leading-none">
                  {slide.title}
                </h2>
                <p className="text-[11px] md:text-xs text-zinc-400 leading-relaxed font-medium">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controllers Buttons */}
        <button type="button" onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-4 z-20 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition opacity-0 group-hover:opacity-100 shadow-md">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-4 z-20 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition opacity-0 group-hover:opacity-100 shadow-md">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}