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
    { id: 1, icon: Palette, title: "Original Pieces", value: 40, suffix: "+" },
    { id: 2, icon: Coffee, title: "Cafe Installations", value: 12, suffix: "" },
    { id: 3, icon: Award, title: "Exhibitions Held", value: 3, suffix: "", pad: 2 },
  ];

  const featuredWorks = [
    {
      id: 1,
      title: "Silent Depths",
      type: "Charcoal on Archival Paper",
      year: "2025",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Ethereal Echoes",
      type: "Oil Canvas Masterpiece",
      year: "2026",
      img: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Rustic Essence",
      type: "Bistro Textured Acrylic",
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
        <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden border-b border-zinc-900/30 px-6 py-16 text-center md:min-h-[460px]">
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
              The Mind Behind The Brush
            </span>

            <h1
              className={`${fraunces.className} hero-title mt-5 text-4xl tracking-tight sm:text-6xl md:text-7xl`}
            >
              <span className="font-light text-zinc-100">Artist </span>
              <span
                className="font-medium italic"
                style={{
                  background: `linear-gradient(90deg, #E9C683, ${GOLD}, #8B6F2E)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Profile
              </span>
            </h1>

            <div className="hero-stroke mt-6 flex justify-center" style={{ color: GOLD }}>
              <BrushStroke active className="h-3 w-44 md:w-60" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <main className="mx-auto mt-4 grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-12">
          {/* LEFT COLUMN: PICTURE & CORE STATS (4 COLS) */}
          <div className="space-y-6 lg:col-span-4">
            <div
              ref={card.ref}
              className={`reveal ${
                card.visible ? "reveal--visible" : ""
              } relative overflow-hidden rounded-3xl border border-zinc-900/80 bg-zinc-900/20 p-6 text-center shadow-xl backdrop-blur-md`}
            >
              {/* Cinematic Profile Frame */}
              <div
                className="group relative mx-auto h-40 w-40 overflow-hidden rounded-2xl border bg-zinc-950 shadow-lg transition-transform duration-500 hover:-translate-y-1"
                style={{ borderColor: "rgba(201,162,75,0.25)" }}
              >
                <img
                  src="/aaa.webp"
                  alt="Lead Artist"
                  className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </div>

              <h2 className="mt-5 text-xl font-black tracking-tight text-zinc-100">
                Lead Resident Curator
              </h2>
              <p
                className="mt-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                KreativeLabs Exclusives
              </p>

              <div className="mx-auto my-4 h-px w-12 bg-zinc-800" />

              {/* Pull quote with oversized serif mark */}
              <div className="relative mt-4 px-2">
                <span
                  aria-hidden="true"
                  className={`${fraunces.className} pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 select-none text-6xl italic`}
                  style={{ color: "rgba(201,162,75,0.18)" }}
                >
                  &ldquo;
                </span>
                <p
                  className={`${fraunces.className} relative text-sm italic leading-relaxed text-zinc-300`}
                >
                  Art is the physical manifestation of unvoiced emotion, tailored to ground
                  modern chaotic spaces.
                </p>
              </div>

              {/* Sync Links */}
              <div className="mt-6 flex justify-center gap-4 border-t border-zinc-950 pt-4">
                <a
                  href="#"
                  className="flex items-center gap-1 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition hover:text-[#E9C683] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: GOLD }}
                >
                  <LinkIcon className="h-3 w-3" /> Instagram <ArrowUpRight className="h-2.5 w-2.5" />
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

          {/* RIGHT COLUMN: BIOGRAPHY & SHOWCASE (8 COLS) */}
          <div className="space-y-10 lg:col-span-8">
            {/* Biography Section */}
            <div
              ref={bio.ref}
              className={`reveal ${bio.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <SectionHeading icon={Heart}>Creative Journey</SectionHeading>
              <div className="space-y-4 rounded-2xl border border-zinc-900/80 bg-zinc-900/10 p-6 text-xs leading-relaxed text-zinc-400 shadow-sm backdrop-blur-md">
                <p>
                  Specializing in contemporary mixed media, fine line portraiture, and
                  textured graphite canvas structures, our lead resident artist creates
                  bespoke visual additions designed to add silent luxury to modern spaces.
                </p>
                <p>
                  Every single piece in this gallery is carefully handcrafted using
                  top-tier archival materials, heavy structural gesso, and raw charcoal
                  mediums. This ensures that the deep emotional contrasts do not fade over
                  time, making each painting a generational heirloom item.
                </p>
              </div>
            </div>

            {/* Spatial Design Focus */}
            <div
              ref={philosophy.ref}
              className={`reveal ${philosophy.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <SectionHeading icon={ShieldCheck}>B2B Spatial Philosophy</SectionHeading>
              <div className="rounded-2xl border border-zinc-900/80 bg-zinc-900/10 p-6 text-xs leading-relaxed text-zinc-400 shadow-sm backdrop-blur-md">
                <p>
                  We believe that art shouldn&apos;t just exist in cold museums. Our
                  primary curation pipeline focuses directly on high-end minimalist
                  commercial locations like{" "}
                  <strong className="font-semibold" style={{ color: "#E9C683" }}>
                    premium espresso bistros, fine dining halls, and boutique hotels
                  </strong>
                  . By matching contrast ratios to ambient interior spot lighting, each
                  workpiece alters the architecture of the wall it claims.
                </p>
              </div>
            </div>

            {/* Signature Masterpieces Grid */}
            <div
              ref={works.ref}
              className={`reveal ${works.visible ? "reveal--visible" : ""} space-y-4`}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Personal Favorites Portfolio
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