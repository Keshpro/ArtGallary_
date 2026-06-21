"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Palette, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/40 transition duration-300">
            <Palette className="w-5 h-5 text-amber-500" />
          </div>
          <span className="font-extrabold tracking-wider bg-linear-to-r from-zinc-100 via-zinc-200 to-amber-400 bg-clip-text text-transparent text-sm md:text-base uppercase">
            KreativeLabs Art
          </span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Link href="/gallery" className="hover:text-amber-400 transition duration-200">Gallery</Link>
          <Link href="/artists" className="hover:text-amber-400 transition duration-200">Artists</Link>
          <Link href="/about" className="hover:text-amber-400 transition duration-200">About</Link>
          <Link href="/contact" className="hover:text-amber-400 transition duration-200">Contact</Link>
        </div>

        {/* DESKTOP DASHBOARD BUTTON */}
        <div className="hidden md:flex items-center">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/80 text-zinc-300 hover:text-amber-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-300"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU */}
      {isOpen && (
        <div className="md:hidden w-full bg-zinc-950 border-b border-zinc-900 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link onClick={() => setIsOpen(false)} href="/gallery" className="hover:text-amber-400 transition">Gallery</Link>
            <Link onClick={() => setIsOpen(false)} href="/artists" className="hover:text-amber-400 transition">Artists</Link>
            <Link onClick={() => setIsOpen(false)} href="/about" className="hover:text-amber-400 transition">About</Link>
            <Link onClick={() => setIsOpen(false)} href="/contact" className="hover:text-amber-400 transition">Contact</Link>
          </div>
          
          <div className="border-t border-zinc-900 pt-4">
            <Link 
              onClick={() => setIsOpen(false)}
              href="/dashboard" 
              className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold py-3 rounded-xl"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}