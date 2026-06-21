"use client";
import { Coffee, Palette, Award, ShieldCheck, Heart, ArrowUpRight, Link as LinkIcon } from "lucide-react";

export default function ArtistPage() {
  // Artist Metrics/Achievements
  const metrics = [
    { id: 1, icon: <Palette className="w-4 h-4 text-amber-400" />, title: "Original Pieces", value: "40+" },
    { id: 2, icon: <Coffee className="w-4 h-4 text-amber-400" />, title: "Cafe Installations", value: "12" },
    { id: 3, icon: <Award className="w-4 h-4 text-amber-400" />, title: "Exhibitions Held", value: "03" },
  ];

  // Featured Masterpieces Showcase inside Artist profile
  const featuredWorks = [
    { id: 1, title: "Silent Depths", type: "Charcoal on Archival Paper", year: "2025", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "Ethereal Echoes", type: "Oil Canvas Masterpiece", year: "2026", img: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "Rustic Essence", type: "Bistro Textured Acrylic", year: "2026", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans antialiased pb-24">
      
      {/* HEADER HERO AREA */}
      <div className="relative w-full h-[250px] bg-gradient-to-b from-zinc-900/30 to-transparent border-b border-zinc-900/30 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            The Mind Behind The Brush
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3 tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent uppercase">
            Artist Profile
          </h1>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        
        {/* LEFT COLUMN: PICTURE & CORE STATS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Glassy Card Wrapper */}
          <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-3xl p-6 shadow-xl relative overflow-hidden text-center">
            
            {/* Cinematic Profile Frame */}
            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 mx-auto grayscale hover:grayscale-0 transition duration-500 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" 
                alt="Lead Artist" 
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-black text-zinc-100 tracking-tight mt-5">Lead Resident Curator</h2>
            <p className="text-[10px] text-amber-500 uppercase font-bold tracking-widest mt-0.5">KreativeLabs Exclusives</p>
            
            <div className="w-12 h-[1px] bg-zinc-800 mx-auto my-4" />

            <p className="text-xs text-zinc-400 leading-relaxed">
              "Art is the physical manifestation of unvoiced emotion, tailored to ground modern chaotic spaces."
            </p>

            {/* Social Links */}
            <div className="mt-6 pt-4 border-t border-zinc-950 flex justify-center gap-4">
              <a href="#" className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-amber-400 transition">
                <LinkIcon className="w-3 h-3" /> Instagram <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Metrics Column Blocks */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            {metrics.map((m) => (
              <div key={m.id} className="bg-zinc-900/10 backdrop-blur-sm border border-zinc-900/60 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 w-fit">{m.icon}</div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold">{m.title}</span>
                  <span className="text-sm font-black font-mono text-zinc-200">{m.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: BIOGRAPHY & SHOWCASE (8 COLS) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Biography Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-amber-500" /> Creative Journey
            </h3>
            <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/80 rounded-2xl p-6 space-y-4 text-xs text-zinc-400 leading-relaxed shadow-sm">
              <p>
                Specializing in contemporary mixed media, fine line portraiture, and textured graphite canvas structures, our lead resident artist creates bespoke visual additions designed to add silent luxury to modern spaces.
              </p>
              <p>
                Every single piece in this gallery is carefully handcrafted using top-tier archival materials, heavy structural gesso, and raw charcoal mediums. This ensures that the deep emotional contrasts do not fade over time, making each painting a generational heirloom item.
              </p>
            </div>
          </div>

          {/* Spatial Design Focus */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> B2B Spatial Philosophy
            </h3>
            <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/80 rounded-2xl p-6 text-xs text-zinc-400 leading-relaxed shadow-sm">
              <p>
                We believe that art shouldn't just exist in cold museums. Our primary curation pipeline focuses directly on high-end minimalist commercial locations like **premium espresso bistros, fine dining halls, and boutique hotels**. By matching contrast ratios to ambient interior spot lighting, each workpiece alters the architecture of the wall it claims.
              </p>
            </div>
          </div>

          {/* Signature Masterpieces Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Personal Favorites Portfolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredWorks.map((work) => (
                <div key={work.id} className="group bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative aspect-[4/3] w-full bg-[#0d0d0f] overflow-hidden">
                    <img src={work.img} alt={work.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-103 transition duration-500" />
                  </div>
                  <div className="p-4 border-t border-zinc-900">
                    <span className="text-[8px] font-mono text-zinc-500">{work.year} &bull; {work.type}</span>
                    <h4 className="text-xs font-bold text-zinc-200 mt-0.5 truncate group-hover:text-amber-400 transition">{work.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}