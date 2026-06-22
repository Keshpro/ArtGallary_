"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fraunces } from "next/font/google";
import { Menu, X, Palette, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext"; // 🔥 Global Cart Context Integration

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const GOLD = "#C9A24B";
const GOLD_SOFT = "#E9C683";

const navLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/artists", label: "Artists" },
  { href: "/b2b-services", label: "B2B Services" },
  { href: "/contact", label: "Contact" },
];

function BrushStroke({ active, className = "", strokeWidth = 2.5 }) {
  return (
    <svg
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`brush-stroke ${active ? "brush-stroke--active" : ""} ${className}`}
    >
      <path
        pathLength="1"
        d="M2 9 C 28 4, 46 12, 70 7 S 118 2, 150 8 S 196 11, 218 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { cart } = useCart(); // 🔥 Live Global Cart Count Tracker
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className={`w-full sticky top-0 z-50 backdrop-blur-md transition-all duration-300 border-b ${
        scrolled ? "bg-zinc-950/95 border-zinc-800 shadow-lg shadow-black/20" : "bg-zinc-950/80 border-zinc-900"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-all duration-300 group-hover:-rotate-3 group-hover:border-[#C9A24B]/40 group-hover:shadow-[0_0_18px_rgba(201,162,75,0.25)]">
            <Palette className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <span className={`${fraunces.className} font-semibold tracking-wide text-sm md:text-base uppercase`}>
            <span className="text-zinc-100">Aggrani</span>
            <span
              style={{
                background: `linear-gradient(90deg, ${GOLD_SOFT}, ${GOLD})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Karunarathna
            </span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link relative pb-1.5 transition duration-200 hover:text-zinc-200"
                style={{ color: active ? GOLD : undefined }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-full" style={{ color: GOLD }}>
                  <BrushStroke active={active} className="h-1.5 w-full" strokeWidth={2.5} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* DESKTOP INTERFACES: ONLY SHOPPING BAG */}
        <div className="hidden md:flex items-center">
          <Link
            href="/cart"
            className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 relative transition duration-300 group"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition" />
            {cart.length > 0 && (
              <span 
                className="absolute -top-1.5 -right-1.5 text-[9px] font-mono font-black text-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-md"
                style={{ background: GOLD }}
              >
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE ACTIONS (CART + TRIGGER) */}
        <div className="flex md:hidden items-center gap-3">
          
          {/* MOBILE QUICK CART ICON */}
          <Link
            href="/cart"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 relative transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {cart.length > 0 && (
              <span 
                className="absolute -top-1.5 -right-1.5 text-[8px] font-mono font-black text-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: GOLD }}
              >
                {cart.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-[#C9A24B]/30 transition"
          >
            <span key={isOpen ? "x" : "menu"} className="block animate-in zoom-in-50 duration-200">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </span>
          </button>
        </div>
      </div>

      {/* bottom hairline overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, rgba(201,162,75,0.3), transparent)` }}
      />

      {/* MOBILE DROP-DOWN MENU (CLEAN & FULLY RESPONSIVE) */}
      {isOpen && (
        <div className="md:hidden w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-6 py-6 space-y-6 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-col gap-0.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${i * 60}ms`, color: active ? GOLD : undefined }}
                  className="animate-in fade-in slide-in-from-left-2 fill-mode-both duration-300 flex items-center justify-between py-3 border-b border-zinc-900/40 transition hover:text-zinc-200"
                >
                  {link.label}
                  {active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />}
                </Link>
              );
            })}
          </div>

          {/* MOBILE CART IN-MENU REDIRECT LINK (FOR MAXIMUM UX) */}
          <Link
            onClick={() => setIsOpen(false)}
            href="/cart"
            style={{ animationDelay: `${navLinks.length * 60}ms` }}
            className="animate-in fade-in slide-in-from-left-2 fill-mode-both duration-300 flex items-center justify-between w-full bg-zinc-900/50 border border-zinc-900 text-zinc-300 text-xs font-semibold px-4 py-3.5 rounded-xl transition hover:border-amber-500/20"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Review Your Cart Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-mono">{cart.length} Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </Link>
        </div>
      )}

      <style jsx global>{`
        .brush-stroke path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 0.84, 0.44, 1);
        }
        .brush-stroke--active path,
        .nav-link:hover .brush-stroke path {
          stroke-dashoffset: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .brush-stroke path {
            transition: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </nav>
  );
}