"use client";
import Link from "next/link";
import { Fraunces, Space_Mono } from "next/font/google";
import { MapPin, ArrowUpRight } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const GOLD = "#C9A24B";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050506] border-t border-zinc-900/60 pt-16 pb-8 px-6 mt-auto relative overflow-hidden">
      {/* Background Decorative Subtle Mesh */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(201,162,75,0.15), transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 z-10 relative">
        
        {/* COLUMN 1: BRAND IDENTITY (8 COLS) */}
        <div className="md:col-span-8 space-y-4">
          <Link href="/" className="inline-block">
            <h3 className={`${fraunces.className} text-xl font-medium tracking-tight text-zinc-100`}>
              Aggrani <span className="italic text-zinc-400 font-light" style={{ color: GOLD }}>Karunarathna</span>
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
            Original Oil Pastel Art & Illustrations. Custom architectural curation meticulously engineered to transform modern premium interiors and luxury spaces.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500/60" /> Christchurch, New Zealand
          </div>
        </div>

        {/* COLUMN 2: QUICK NAVIGATION (4 COLS) */}
        <div className="md:col-span-4 space-y-3">
          <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 font-mono">
            Navigation
          </span>
          <ul className="space-y-2 text-xs font-medium">
            {[
              { label: "The Studio Gallery", path: "/" },
              { label: "Artist Portrait", path: "/artists" },
              { label: "Privacy Policy", path: "/dashboard" },
            ].map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.path} 
                  className="text-zinc-400 hover:text-[#E9C683] transition duration-300 flex items-center gap-1 group w-fit"
                >
                  {link.label}
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* LOWER BOTTOM ARCHITECTURE BAR */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-mono tracking-wider z-10 relative">
        <p>&copy; {currentYear} Aggrani Karunarathna. All rights reserved.</p>
        <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition duration-300">
          <span>Architectured & Developed by</span>
          <span className="font-bold text-zinc-300 tracking-wide">Keshan Panditharathna</span>
        </div>
      </div>
    </footer>
  );
}