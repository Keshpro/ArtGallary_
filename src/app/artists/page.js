"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces, Space_Mono } from "next/font/google";
import {
  Coffee,
  Palette,
  Award,
  ShieldCheck,
  Heart,
  ArrowUpRight,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Zap
} from "lucide-react";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const GOLD = "#C9A24B";

/* ---------- small hooks ---------- */

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useCountUp(end, visible, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = null;
    let frame;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [visible, end, duration]);

  return value;
}

/* ---------- signature element: hand-drawn brush underline ---------- */

function BrushStroke({ active, className = "", strokeWidth = 2 }) {
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

/* ---------- section heading with the brush motif ---------- */

function SectionHeading({ icon: Icon, children }) {
  const { ref, visible } = useReveal(0.5);
  return (
    <div ref={ref} className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
        <Icon className="h-3.5 w-3.5" style={{ color: GOLD }} /> {children}
      </h3>
      <BrushStroke active={visible} className="h-2.5 w-20" strokeWidth={2.5} />
    </div>
  );
}

/* ---------- metric card with count-up ---------- */

function MetricCard({ icon: Icon, title, value, suffix = "", pad }) {
  const { ref, visible } = useReveal(0.4);
  const count = useCountUp(value, visible);
  const display = pad ? String(count).padStart(pad, "0") : String(count);

  return (
    <div
      ref={ref}
      className={`reveal ${
        visible ? "reveal--visible" : ""
      } flex flex-col gap-3 rounded-xl border border-zinc-900/60 bg-zinc-900/10 p-4 backdrop-blur-sm transition-colors duration-500 hover:border-[color:rgba(201,162,75,0.3)] lg:flex-row lg:items-center`}
    >
      <div className="w-fit rounded-lg border border-zinc-800 bg-zinc-950 p-2">
        <Icon className="h-4 w-4" style={{ color: GOLD }} />
      </div>
      <div>
        <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-500">
          {title}
        </span>
        <span className={`${spaceMono.className} text-sm font-black text-zinc-200`}>
          {display}
          {suffix}
        </span>
      </div>
    </div>
  );
}

/* ---------- featured work card ---------- */

function FeaturedWorkCard({ work }) {
  return (
    <div className="work-card group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/10 shadow-sm backdrop-blur-md transition-colors duration-500 hover:border-[color:rgba(201,162,75,0.3)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0d0d0f]">
        <img
          src={work.img}
          alt={work.title}
          className="h-full w-full object-cover opacity-70 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="border-t border-zinc-900 p-4">
        <span className={`${spaceMono.className} text-[8px] text-zinc-500`}>
          {work.year} &bull; {work.type}
        </span>
        <h4 className="mt-0.5 truncate text-xs font-bold text-zinc-200">
          <span className="transition-colors duration-300 group-hover:text-[#E9C683]">
            {work.title}
          </span>
        </h4>
        <BrushStroke active={false} className="mt-1.5 h-2 w-14" strokeWidth={2} />
      </div>
    </div>
  );
}

/* ---------- main artist console page ---------- */

export default function ArtistPage() {
  const metrics = [
    { id: 1, icon: Palette, title: "Bespoke Creations", value: 25, suffix: "+" },
    { id: 2, icon: Coffee, title: "Spatial Showcases", value: 8, suffix: "" },
    { id: 3, icon: Award, title: "Curation Galleries", value: 2, suffix: "", pad: 2 },
  ];

  const featuredWorks = [
    {
      id: 1,
      title: "Wild Sovereignty",
      type: "Original Oil Pastel on Archival Canvas",
      year: "2025",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Vibrant Echoes",
      type: "Hand-Drawn Heavy Pattern",
      year: "2026",
      img: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "The Guardian's Soul",
      type: "Animal Symbolism Masterpiece",
      year: "2026",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const bio = useReveal(0.3);
  const philosophy = useReveal(0.3);
  const works = useReveal(0.15);
  const card = useReveal(0.3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070708] font-sans text-zinc-100 antialiased flex flex-col justify-between">
      
      <div>
        {/* ambient film grain engine overlay */}
        <svg
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.035] mix-blend-overlay"
          aria-hidden="true"
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* HEADER HERO AREA */}
        <div className="relative flex min-h-[350px] w-full items-center justify-center overflow-hidden border-b border-zinc-900/30 px-6 py-12 text-center md:min-h-[400px]">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="ambient-glow absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, rgba(201,162,75,0.12), transparent 70%)`,
              }}
            />
          </div>

          <div className="relative z-10">
            <span
              className="hero-badge inline-block rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-widest"
              style={{
                color: GOLD,
                background: "rgba(201,162,75,0.08)",
                borderColor: "rgba(201,162,75,0.2)",
              }}
            >
              ✦ Art Portfolio ✦
            </span>

            <h1
              className={`${fraunces.className} hero-title mt-5 text-4xl tracking-tight sm:text-6xl md:text-7xl font-black`}
            >
              <span className="font-light text-zinc-100">Aggrani </span>
              <span
                className="font-medium italic"
                style={{
                  background: `linear-gradient(90deg, #E9C683, ${GOLD}, #8B6F2E)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Karunarathna
              </span>
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-3 font-mono">Original Oil Pastel Art & Illustrations</p>

            <div className="hero-stroke mt-6 flex justify-center" style={{ color: GOLD }}>
              <BrushStroke active className="h-3 w-44 md:w-60" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <main className="mx-auto mt-4 grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-12">
          
          {/* LEFT COLUMN: BIGGER IMAGE & CORE STATS (4 COLS) */}
          <div className="space-y-6 lg:col-span-4">
            <div
              ref={card.ref}
              className={`reveal ${
                card.visible ? "reveal--visible" : ""
              } relative overflow-hidden rounded-3xl border border-zinc-900/80 bg-zinc-900/20 p-6 text-center shadow-xl backdrop-blur-md`}
            >
              {/* 🔥 ULTRA-WIDE CINEMATIC PROFILE FRAME (LARGER ACCORDING TO USER REQUEST) */}
              <div
                className="group relative w-full h-7 md:h-72 overflow-hidden rounded-2xl border bg-zinc-950 shadow-lg transition-all duration-500 hover:border-amber-500/30"
                style={{ borderColor: "rgba(201,162,75,0.15)" }}
              >
                <img
                  src="/aaa.webp"
                  alt="Aggrani Karunarathna"
                  className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                
                {/* Geolocation Tag Overlay */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-zinc-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[9px] font-bold tracking-wider text-zinc-300 uppercase">
                  <MapPin className="w-3 h-3 text-amber-500" /> Christchurch, NZ
                </div>
              </div>

              <h2 className="mt-5 text-base font-black tracking-tight text-zinc-100 uppercase">
                Aggrani Karunarathna
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                  Emerging Resident Artist
                </p>
              </div>

              <div className="mx-auto my-4 h-px w-12 bg-zinc-800" />

              {/* Pull quote with oversized serif mark */}
              <div className="relative mt-2 px-2">
                <span
                  aria-hidden="true"
                  className={`${fraunces.className} pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 select-none text-6xl italic`}
                  style={{ color: "rgba(201,162,75,0.15)" }}
                >
                  &ldquo;
                </span>
                <p
                  className={`${fraunces.className} relative text-xs italic leading-relaxed text-zinc-400`}
                >
                  Bold Colours, Wild Beauty — Curation designed to bring nature's raw emotional depth into modern architecture.
                </p>
              </div>

              {/* Sync Links */}
              <div className="mt-5 flex justify-center gap-4 border-t border-zinc-950 pt-4">
                <a
                  href="#"
                  className="flex items-center gap-1 rounded text-[9px] font-bold uppercase tracking-wider text-zinc-500 transition hover:text-[#E9C683]"
                >
                  <LinkIcon className="h-3 w-3" /> Digital Archive <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {/* Metrics Column Blocks */}
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {metrics.map((m) => (
                <MetricCard key={m.id} {...m} />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: REAL BIOGRAPHY & CREATIVE SHOWCASE (8 COLS) */}
          <div className="space-y-10 lg:col-span-8">
            
            {/* Biography Section */}
            <div
              ref={bio.ref}
              className={`reveal ${bio.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <SectionHeading icon={Heart}>The Artist's Soul</SectionHeading>
              <div className="space-y-5 rounded-2xl border border-zinc-900/80 bg-zinc-900/10 p-6 text-xs leading-relaxed text-zinc-400 shadow-sm backdrop-blur-md">
                <p>
                  I am <strong className="text-zinc-200 font-semibold">Aggrani Karunarathna</strong>, a 23-year-old emerging contemporary artist currently based in the vibrant creative landscapes of <strong className="text-amber-400 font-semibold">Christchurch, New Zealand</strong>. My professional focus centers heavily around the intricate manipulation of vibrant oil pastel illustrations and fine-line structural details.
                </p>
                <p>
                  My visual style represents an avant-garde fusion of explosive, bold color palettes, meticulous structural patterns, and deep <strong className="text-zinc-200 font-semibold">animal symbolism</strong>. Every artifact is a unique statement of absolute patience, continuous joy, and untamed human emotion translated onto archival heavy canvases.
                </p>
              </div>
            </div>

            {/* Creative Core Pillar Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Oil Pastel Medium", icon: Palette },
                { label: "Animal Symbolism", icon: Sparkles },
                { label: "Vibrant Bold Colors", icon: Zap },
                { label: "Bespoke One-of-a-Kind", icon: ShieldCheck }
              ].map((pill, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-3 flex items-center gap-2.5 transition hover:border-amber-500/10">
                  <pill.icon className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{pill.label}</span>
                </div>
              ))}
            </div>

            {/* Spatial Curation Focus */}
            <div
              ref={philosophy.ref}
              className={`reveal ${philosophy.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <SectionHeading icon={ShieldCheck}>Wild Beauty Integration</SectionHeading>
              <div className="rounded-2xl border border-zinc-900/80 bg-zinc-900/10 p-6 text-xs leading-relaxed text-zinc-400 shadow-sm backdrop-blur-md">
                <p>
                  By exploring the delicate intersection where nature's wild textures meet contemporary decorative art, my curation pipeline targets modern architectural structures. Every hand-drawn canvas is calibrated with complex depth ratios to transform residential studios, upscale dining environments, and corporate spaces into premium sanctuaries of raw organic elegance.
                </p>
              </div>
            </div>

            {/* Signature Masterpieces Grid */}
            <div
              ref={works.ref}
              className={`reveal ${works.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Signature Masterpieces Portfolio
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {featuredWorks.map((work) => (
                  <FeaturedWorkCard key={work.id} work={work} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FIXED PREMIUM BRAND FOOTER INTEGRATION */}
      <Footer />

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.9s cubic-bezier(0.16, 0.84, 0.44, 1),
            transform 0.9s cubic-bezier(0.16, 0.84, 0.44, 1);
        }
        .reveal--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .brush-stroke path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset 1.1s cubic-bezier(0.16, 0.84, 0.44, 1);
        }
        .brush-stroke--active path,
        .work-card:hover .brush-stroke path {
          stroke-dashoffset: 0;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes drawStroke {
          from {
            stroke-dashoffset: 1;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes driftGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-52%, -47%) scale(1.06);
          }
        }

        .hero-badge {
          animation: fadeUp 0.7s cubic-bezier(0.16, 0.84, 0.44, 1) both;
          animation-delay: 0.05s;
        }
        .hero-title {
          animation: fadeUp 0.9s cubic-bezier(0.16, 0.84, 0.44, 1) both;
          animation-delay: 0.2s;
        }
        .hero-stroke {
          animation: fadeUp 0.9s cubic-bezier(0.16, 0.84, 0.44, 1) both;
          animation-delay: 0.5s;
        }
        .hero-stroke .brush-stroke path {
          animation: drawStroke 1.1s cubic-bezier(0.16, 0.84, 0.44, 1) both;
          animation-delay: 0.65s;
        }
        .ambient-glow {
          animation: driftGlow 14s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .hero-badge,
          .hero-title,
          .hero-stroke,
          .hero-stroke .brush-stroke path,
          .ambient-glow,
          .brush-stroke path {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}