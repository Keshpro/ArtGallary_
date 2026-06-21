"use client";
import { Eye, Target, Compass, Sparkles, Building2, Layers } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      id: 1,
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      title: "Our Vision",
      text: "To bridge the gap between fine gallery art and functional modern architecture, ensuring every premium space holds a silent psychological emotional depth."
    },
    {
      id: 2,
      icon: <Target className="w-5 h-5 text-amber-400" />,
      title: "Our Mission",
      text: "To handcraft museum-grade mixed media and portrait installations using archival elements, tailored explicitly to enhance luxury commercial atmospheres."
    },
    {
      id: 3,
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      title: "Spatial Curation",
      text: "We don't just sell frames; we curate layout presence. Every painting's contrast ratio is tuned to blend smoothly with commercial spot lighting arrays."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans antialiased pb-24">
      
      {/* HEADER HERO AREA */}
      <div className="relative w-full h-[250px] bg-gradient-to-b from-zinc-900/30 to-transparent border-b border-zinc-900/30 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            The Agency & Core Curation Philosophy
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3 tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent uppercase">
            About Our Collective
          </h1>
        </div>
      </div>

      {/* CORE CONTENT LAYOUT */}
      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-16">
        
        {/* BRAND MANIFESTO SECTION */}
        <section className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/80 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 text-amber-500 flex-shrink-0">
            <Layers className="w-8 h-8" />
          </div>
          
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-lg font-black tracking-tight text-zinc-200">The KreativeLabs Art Philosophy</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Powered by the technological and creative design engine of <strong>KreativeLabs</strong>, our art collective redefines spatial aesthetic luxury. We specialize in mapping elite handcrafted paintings directly into architectural interior schemes. We serve as the creative bridge between high-concept artistic expression and the demanding luxury environments of modern corporate, hotel, and cafe spaces.
            </p>
          </div>
        </section>

        {/* THREE CORE VALUES PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.id} className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 w-fit mb-4 shadow-inner">
                  {v.icon}
                </div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">{v.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{v.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* B2B SPATIAL TARGETING STATEMENT */}
        <section className="border-t border-zinc-900/60 pt-12">
          <div className="w-full bg-gradient-to-br from-zinc-950 to-zinc-900/30 border border-zinc-900/60 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Architectural Alignment
              </span>
              <h3 className="text-base font-black text-zinc-200 tracking-tight">Tailored Curation For Hospitality & Commercial Spaces</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Blank commercial walls decrease consumer dwell time and dilute high-end brand premium value. Our tailored curation process ensures that every canvas layout, color balance, and scale option directly answers the architectural layout of fine dining settings, premium workspaces, and luxury hotel lounges.
              </p>
            </div>

            <div className="md:col-span-4 bg-zinc-950/50 border border-zinc-850 rounded-2xl p-4 text-center">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2 animate-pulse" />
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Archival Guarantee</h4>
              <p className="text-[9px] text-zinc-500 mt-1">100% verified asset curation backed by premium certified logistics.</p>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}