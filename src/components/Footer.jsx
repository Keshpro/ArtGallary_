"use client";
import Link from "next/link";
import { Layers, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-zinc-900 bg-[#070708] text-zinc-400 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
        
        {/* BRAND & STUDIO MOTTO */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase tracking-widest cursor-default">
            <Layers className="w-4 h-4" />
            <span>KreativeLabs Art</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm leading-relaxed font-medium">
            Fine-emotion and contemporary depth fused into physical canvas curation. Transforming modern premium bistros, luxury lounges, and bespoke living environments.
          </p>
        </div>

        {/* QUICK NAVIGATION & ZENITH LINK */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-200 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/" className="hover:text-amber-400 transition duration-300">
                  Home Matrix
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition duration-300 flex items-center gap-0.5">
                  The Art Vault <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition duration-300">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 hover:text-zinc-400 transition pt-4 text-left block"
          >
            [ Back To Zenith ↑ ]
          </button>
        </div>

      </div>

      {/* LOWER BASEBAR */}
      <div className="w-full border-t border-zinc-900/60 bg-zinc-950/40 py-6 text-[10px] uppercase tracking-widest font-semibold text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {currentYear} KreativeLabs Art Engine. All Rights Reserved.</span>
          <div className="flex gap-6 text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-300 transition">Terms Matrix</a>
            <a href="/dashboard" className="hover:text-zinc-300 transition">Privacy Layer</a>
            <a href="#" className="hover:text-zinc-300 transition">Architectural Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}