"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ArtCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 🔥 Firebase collection එක 'carousel' ලෙස නිවැරදිව Sync කිරීම
    const unsubscribe = onSnapshot(collection(db, "carousel"), (snapshot) => {
      const slideList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setSlides(slideList);
    });
    return () => unsubscribe();
  }, []);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (slides.length === 0) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex, slides]);

  // Carousel එකේ ඩේටා නැතිනම් පෙන්වන පිරිසිදු Loading ස්ටේට් එක
  if (slides.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="w-full h-[250px] md:h-[350px] rounded-2xl bg-zinc-900/10 border border-zinc-900 animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-zinc-500 font-medium tracking-wide">
          <div className="w-5 h-5 border border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>SYNCHRONIZING RECENT BILLBOARD EXHIBITIONS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 relative group select-none">
      <div className="w-full h-[280px] md:h-[380px] rounded-2xl relative overflow-hidden bg-zinc-950 border border-zinc-900/60 shadow-lg">
        
        {/* Sliding Wrapper */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative flex-shrink-0">
              {/* Dark Glassy Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
              
              {/* 🔥 ඩෑෂ්බෝඩ් එකෙන් දාන slide.image එක හරියටම මෙතනින් කියවයි */}
              <img 
                src={slide.image} 
                alt={slide.title || "Announcement"} 
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