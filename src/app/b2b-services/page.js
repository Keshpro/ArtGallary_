"use client";
import { useState } from "react";
import { Fraunces, Space_Mono } from "next/font/google";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Flame,
  Moon,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * FRAME LAYOUT — measured directly off b2b-lounge-bg.jpg (685 x 448 px).
 * All values are % of the background image's width/height, so as long as
 * the container keeps the SAME aspect ratio as the source photo
 * (685 / 448), these three boxes will sit exactly on top of the three
 * real picture frames on the wall, at any screen size.
 *
 * If you swap in a different background photo, re-measure and update
 * these numbers (top/height are shared because all 3 frames are level;
 * left/width differ slightly per frame).
 */
const BG_ASPECT_RATIO = "685 / 448";

const FRAME_LAYOUT = {
  top: 6.7, // %
  height: 39.3, // %
  frames: [
    { left: 16.6, width: 21.3 }, // left frame
    { left: 41.8, width: 21.0 }, // center frame
    { left: 66.1, width: 20.9 }, // right frame
  ],
};

// How much bigger than the real photographed frames each preset renders.
// Frames grow from their own center, so they stay centered on the wall spots.
// 1.15 is close to the ceiling — past that the left/center/right frames
// start touching each other given how closely they're hung in the photo.
const SIZE_SCALE = {
  fit: 1, // matches the frames exactly as photographed
  bold: 1.08,
  statement: 1.15,
};

function getScaledFrame(base, scale) {
  const center = base.left + base.width / 2;
  const width = base.width * scale;
  return { left: center - width / 2, width };
}

export default function B2BServicesPage() {
  const [ambientLight, setAmbientLight] = useState("gallery");
  const [frameColor, setFrameColor] = useState("black");

  // Swap these for the user's own artwork — they just need to be portrait
  // orientation to read naturally inside the matted frames.
  const triptychArt = [
    "/img/fish.jpg",
    "/img/mokey.webp",
    "/img/mouth.webp",
  ];

  const frameBorderColor =
    frameColor === "black"
      ? "#161619"
      : frameColor === "white"
      ? "#ffffff"
      : "#6c4723";

  const ambientFilter =
    ambientLight === "gallery"
      ? "contrast(1.05) brightness(1)"
      : ambientLight === "espresso"
      ? "sepia(0.18) contrast(0.98) brightness(0.9)"
      : "contrast(1.02) brightness(0.65) grayscale(0.1)";

  const packages = [
    {
      id: "bistro",
      tag: "Bespoke Curation",
      title: "Espresso & Bistro Elite",
      desc: "Tailored explicitly for modern cafes and rustic luxury roasteries. Includes high-texture botanical artwork adjusted for warm architectural profiles.",
      perks: [
        "Custom color-burn alignment",
        "Vibrant oil pastel resistance coating",
        "Complementary obsidian framing",
      ],
    },
    {
      id: "corporate",
      tag: "High Volume Curation",
      title: "Boutique Hospitality & Offices",
      desc: "Designed for premium hotel suites, luxury lounges, and creative corporate headquarters. Large-scale multi-panel configurations.",
      perks: [
        "Spatial dimension analysis",
        "Insured global gallery transit",
        "On-site installation blueprint",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans antialiased pb-24">
      {/* HERO HEADER */}
      <div className="relative w-full h-[280px] bg-gradient-to-b from-zinc-900/30 to-transparent border-b border-zinc-900/40 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="z-10 max-w-3xl space-y-3">
          <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Architectural Partnership Matrix
          </span>
          <h1
            className={`${fraunces.className} text-3xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase`}
          >
            Commercial <span className="italic font-light text-zinc-400">Curation</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            We transform modern blank commercial walls into high-end psychological gallery spaces.
            Elevating customer dwell time and premium brand retention across elite properties.
          </p>
        </div>
      </div>

      {/* INTERACTIVE SIMULATOR */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 mt-6 space-y-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-900 z-20">
            <div>
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-amber-500 block mb-0.5">
                Spatial Curation Blueprint
              </span>
              <h3 className={`${fraunces.className} text-lg font-black text-zinc-200 tracking-tight`}>
                Calibrate Triptych Lounge Installation
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 gap-1">
                {[
                  { id: "black", l: "Obsidian" },
                  { id: "white", l: "Minimal White" },
                  { id: "wood", l: "Luxury Wood" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrameColor(f.id)}
                    className={`py-1.5 px-3 rounded-lg text-[9px] uppercase font-bold transition ${
                      frameColor === f.id
                        ? "bg-amber-500 text-black shadow-md"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {f.l}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80 gap-1">
                {[
                  { id: "gallery", l: "Spotlight", i: Sun },
                  { id: "espresso", l: "Bistro Glow", i: Flame },
                  { id: "obsidian", l: "Shadow", i: Moon },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAmbientLight(m.id)}
                    className={`py-1.5 px-3 rounded-lg text-[9px] uppercase font-bold flex items-center gap-1 transition ${
                      ambientLight === m.id
                        ? "bg-amber-500 text-black shadow-md"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <m.i className="w-3 h-3" />
                    {m.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/*
            BACKGROUND CANVAS
            aspectRatio locked to the source photo's own ratio (685:448).
            Because object-fit: cover on an element with the SAME ratio as
            its source image never crops, the % coordinates below stay
            pixel-accurate at every screen size — no drift, no guessing.
          */}
          <div
            className="w-full max-w-275 mx-auto rounded-2xl relative overflow-hidden bg-[#dcd3c9] border border-zinc-900/60 shadow-inner"
            style={{ aspectRatio: BG_ASPECT_RATIO }}
          >
            {/* Background lounge photo — drop b2b-lounge-bg.jpg into /public/img/ */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <Image
                src="/img/b2b.jpg"
                alt="Bespoke studio lounge with gallery wall"
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover object-center"
              />
            </div>

            {/* Ambient multiplier overlay */}
            <div
              className="absolute inset-0 transition-colors duration-1000 mix-blend-multiply z-10 pointer-events-none"
              style={{
                backgroundColor:
                  ambientLight === "gallery"
                    ? "rgba(15, 15, 20, 0.18)"
                    : ambientLight === "espresso"
                    ? "rgba(38, 27, 12, 0.28)"
                    : "rgba(6, 6, 8, 0.55)",
              }}
            />

            {/* Spotlight ray emulation */}
            <div
              className="absolute top-0 left-0 right-0 h-4/5 pointer-events-none transition-opacity duration-1000 blur-2xl z-[15]"
              style={{
                background:
                  "radial-gradient(ellipse at top, rgba(201,162,75,0.12), transparent 70%)",
                opacity: ambientLight === "gallery" ? 1 : ambientLight === "espresso" ? 0.7 : 0.15,
              }}
            />

            {/* TRIPTYCH FRAMES — positioned to match the real frames in the photo */}
            {FRAME_LAYOUT.frames.map((f, index) => (
              <div
                key={index}
                className="absolute z-20 transition-all duration-500"
                style={{
                  left: `${f.left}%`,
                  top: `${FRAME_LAYOUT.top}%`,
                  width: `${f.width}%`,
                  height: `${FRAME_LAYOUT.height}%`,
                }}
              >
                {/* thin outer frame border */}
                <div
                  className="w-full h-full transition-colors duration-500"
                  style={{
                    border: `solid ${frameColor === "white" ? "5px" : "4px"} ${frameBorderColor}`,
                    boxShadow:
                      "0 18px 34px -10px rgba(0,0,0,0.55), inset 0 0 2px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* wide white mat, like the real prints on the wall */}
                  <div className="w-full h-full bg-[#f3eee5] p-[9%]">
                    <div className="w-full h-full overflow-hidden">
                      <img
                        src={triptychArt[index]}
                        alt={`Curation artwork ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-1000"
                        style={{ filter: ambientFilter }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-20">
        <section className="space-y-6">
          <div className="text-center md:text-left">
            <span className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-600 block">
              Commercial Scale Blueprint
            </span>
            <h2 className={`${fraunces.className} text-xl md:text-2xl font-black text-zinc-200 mt-1`}>
              Tailored Corporate Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-colors duration-500 hover:border-amber-500/10"
              >
                <div className="space-y-4">
                  <span className="text-[8px] uppercase font-mono font-bold tracking-widest bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-amber-500 w-fit block">
                    {pkg.tag}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 tracking-tight">{pkg.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{pkg.desc}</p>
                  </div>
                  <ul className="space-y-1.5 pt-2">
                    {pkg.perks.map((perk, i) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span className="text-amber-500 text-[12px]">✦</span> {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider py-2.5 rounded-xl text-[9px] transition"
                  >
                    Request Commercial Quote <ArrowRight className="w-3 h-3 text-zinc-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900/60 pt-12">
          {[
            {
              icon: ShieldCheck,
              title: "Museum Preservation",
              desc: "Coated with archival varnish against UV rays and heavy coffee vapor moisture environment.",
            },
            {
              icon: Sparkles,
              title: "Exclusive Licensing",
              desc: "Option to mint authenticated physical artwork paired with secure digital backup tokens.",
            },
            {
              icon: Briefcase,
              title: "Bulk Curation Offers",
              desc: "Tiered commercial discounts available for high-volume interior fit-outs.",
            },
          ].map((v, idx) => (
            <div key={idx} className="bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-4 space-y-2">
              <v.icon className="w-4 h-4 text-amber-500" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">{v.title}</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}