"use client";
import { useState, useEffect } from "react";
import { Fraunces, Space_Mono } from "next/font/google";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  Link,
  ArrowUpRight,
  MessageSquare,
  Coffee,
  Grid,
  Heart,
  Search,
  User,
  Building,
  Send,
  Eye,
  Sun,
  Moon,
  Flame,
} from "lucide-react";
import ArtCarousel from "@/components/ArtCarousel";
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
const GOLD_SOFT = "#E9C683";
const FAVORITES_KEY = "kreativelabs_favorites";

/* ---------- small hooks ---------- */

function useReveal(threshold = 0.2) {
  const [node, setNode] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, [node, threshold]);

  return { ref: setNode, visible };
}

function useCountUp(end, trigger, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
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
  }, [trigger, end, duration]);

  return value;
}

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

function Reveal({ children, delay = 0, className = "", threshold = 0.2 }) {
  const { ref, visible } = useReveal(threshold);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function EyebrowHeading({ icon: Icon, eyebrow, title, description }) {
  const { ref, visible } = useReveal(0.4);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} flex flex-col items-center text-center mb-10`}
    >
      <div
        className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest"
        style={{ color: GOLD }}
      >
        <Icon className="w-3 h-3" /> {eyebrow}
      </div>
      <h2 className={`${fraunces.className} text-xl md:text-2xl font-black text-zinc-100 mt-3 tracking-tight`}>
        {title}
      </h2>
      {description && <p className="text-xs text-zinc-500 mt-1 max-w-md">{description}</p>}
      <div className="mt-3" style={{ color: GOLD }}>
        <BrushStroke active={visible} className="h-2.5 w-20" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function ArtCard({ art, isFavorite, onToggleFavorite, onSelect }) {
  return (
    <div className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#C9A24B]/40 shadow-lg">
      <div className="relative aspect-4/5 w-full bg-[#0d0d0f] overflow-hidden border-b border-zinc-950">
        <img
          src={art.imageUrl}
          alt={art.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-zinc-800/80 transition hover:border-[#C9A24B]/50 focus-visible:outline focus-visible:outline-2"
          style={{ outlineColor: GOLD }}
        >
          <Heart
            className="h-3.5 w-3.5 transition-colors duration-300"
            style={{ color: isFavorite ? GOLD : "#71717a" }}
            fill={isFavorite ? GOLD : "none"}
          />
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1 transition duration-300 truncate group-hover:text-[#E9C683]">
          {art.title}
        </h3>
        <p className="text-[11px] text-zinc-500 mb-4 h-8 line-clamp-2 leading-relaxed">{art.description}</p>
        <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5">
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Value</span>
            <span className={`${spaceMono.className} text-sm font-black text-zinc-100 tracking-tight`}>
              NZD {art.price?.toLocaleString()}
            </span>
          </div>
          <button
            onClick={onSelect}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-[#C9A24B] hover:text-black text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition duration-300 border border-zinc-800/80 hover:border-[#C9A24B]"
          >
            <ShoppingCart className="w-3 h-3" />
            Acquire Art
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  // Base Data States
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4); 

  // Filter / search / wishlist state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [favorites, setFavorites] = useState([]);

  // Live Reviews State
  const [reviews, setReviews] = useState([]);
  const [revName, setRevName] = useState("");
  const [revBusiness, setRevBusiness] = useState("");
  const [revComment, setRevComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // 🔥 2026 INTERACTIVE STATE VARIABLES (DEFINED CORRECTLY TO FIX REFERENCEERROR)
  const [ambientLight, setAmbientLight] = useState("gallery");
  const [frameColor, setFrameColor] = useState("black");

  const partnerships = [
    "The Espresso Club", "Aura Fine Dining", "Nesta Luxury Hotel", 
    "Minimalist Cafe", "Urban Canvas Bistro", "Vogue Lounge",
    "Christchurch Collective", "Pacific Fine Art"
  ];

  const showcases = [
    { id: 1, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop", space: "Aura Dining Hall" },
    { id: 2, img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=600&auto=format&fit=crop", space: "The Espresso Club Lounge" },
    { id: 3, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop", space: "Nesta Executive Suite" },
    { id: 4, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop", space: "Minimalist Bistro Wall" }
  ];

  // Fetch Artworks from Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const artList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArtworks(artList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Live Reviews from Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Load saved favorites
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      setFavorites(Array.isArray(stored) ? stored : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  // Reset pagination whenever the active filter or search changes
  useEffect(() => {
    setVisibleCount(4);
  }, [activeFilter, searchQuery]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredArtworks = artworks.filter((art) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      art.title?.toLowerCase().includes(q) ||
      art.description?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeFilter === "favorites") return favorites.includes(art.id);
    if (activeFilter === "digital") return art.type === "digital";
    if (activeFilter === "physical") return (art.type ?? "physical") === "physical";
    return true;
  });

  const isFiltering = activeFilter !== "all" || searchQuery.trim() !== "";

  const filterTabs = [
    { id: "all", label: "All Creations" },
    { id: "physical", label: "Physical" },
    { id: "digital", label: "Digital NFT" },
    { id: "favorites", label: `Favorites${favorites.length ? ` (${favorites.length})` : ""}` },
  ];

  const countUp = useCountUp(artworks.length, !loading);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: revName,
        businessName: revBusiness || null,
        comment: revComment,
        createdAt: serverTimestamp()
      });
      showToast("Thank you! Review published successfully.", "success");
      setRevName(""); setRevBusiness(""); setRevComment("");
    } catch (err) {
      console.error(err);
      showToast("Error publishing review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-[#C9A24B]/20 font-sans antialiased overflow-x-hidden">

      {/* ambient film grain */}
      <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.035] mix-blend-overlay" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* SECTION 1: TOP CAROUSEL ADS/FEATURED */}
      <ArtCarousel />

      {/* 🔥 SECTION 2: 2026 HIGH-TECH INTERACTIVE FRAME & LIGHT SIMULATOR */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <Reveal threshold={0.3}>
          <div className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl">
            
            {/* Dynamic Ambient Background Glow */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-20 blur-3xl transition-all duration-700" 
              style={{
                background: ambientLight === "gallery" 
                  ? "radial-gradient(circle at 70% 50%, rgba(201,162,75,0.25), transparent 60%)"
                  : ambientLight === "espresso"
                  ? "radial-gradient(circle at 70% 50%, rgba(233,198,131,0.18), rgba(139,111,46,0.08), transparent 50%)"
                  : "radial-gradient(circle at 70% 50%, rgba(30,58,138,0.3), rgba(0,0,0,0), transparent 60%)"
              }}
            />

            {/* LEFT SIDE: DYNAMIC INTERACTIVE CONTROLLERS */}
            <div className="lg:col-span-5 space-y-6 z-10">
              <div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-amber-500 w-fit mb-3">
                  <Eye className="w-3 h-3" /> Live Studio Configurator
                </div>
                <h3 className={`${fraunces.className} text-xl md:text-2xl font-black tracking-tight text-zinc-100`}>
                  Visualize Your Masterpiece
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  We deliver all our premium artworks professionally framed. Choose a custom border setup and ambient light profile below to find the absolute perfect match for your interior wall.
                </p>
              </div>

              {/* CONTROLLER 1: CHOOSE CUSTOM FRAME TYPE */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-amber-500" /> 1. Select Custom Frame Border
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "black", label: "Obsidian Black", color: "#000000" },
                    { id: "white", label: "Minimalist White", color: "#ffffff" },
                    { id: "wood", label: "Luxury Wood", color: "#855829" }
                  ].map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setFrameColor(frame.id)}
                      className={`p-3 rounded-xl bg-zinc-900/40 border text-center transition duration-300 ${
                        frameColor === frame.id ? "border-amber-500 text-amber-400 shadow-lg bg-zinc-900" : "border-zinc-900 text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full mx-auto mb-1.5 border border-zinc-800" style={{ backgroundColor: frame.color }} />
                      <span className="block text-[9px] font-black uppercase tracking-wider">{frame.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTROLLER 2: AMBIENT LIGHT RATIO */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> 2. Match Interior Ambient Light
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "gallery", label: "Gallery Spot", icon: Sun },
                    { id: "espresso", label: "Bistro Glow", icon: Flame },
                    { id: "obsidian", label: "Deep Shadow", icon: Moon }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setAmbientLight(mode.id)}
                      className={`p-2.5 rounded-xl border text-center transition duration-300 flex flex-col items-center gap-1 ${
                        ambientLight === mode.id ? "bg-zinc-900 border-amber-500/40 text-amber-400" : "bg-zinc-900/20 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <mode.icon className="w-3.5 h-3.5" />
                      <span className="block text-[9px] font-bold uppercase tracking-wider">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: THE LIVE FRAME GRAPHIC PREVIEW */}
            <div className="lg:col-span-7 flex justify-center items-center z-10 w-full h-72 md:h-96 bg-zinc-900/10 border border-zinc-900/60 rounded-2xl relative overflow-hidden shadow-inner p-6">
              <div 
                className="absolute inset-0 transition-all duration-1000" 
                style={{
                  backgroundColor: ambientLight === "gallery" ? "#0a0a0c" : ambientLight === "espresso" ? "#14110b" : "#040405"
                }}
              />
              
              {/* THE DYNAMIC LIVE FRAMED CANVAS ELEMENT */}
              <div 
                className="relative w-44 md:w-56 aspect-4/5 shadow-2xl transition-all duration-500 rounded-xs"
                style={{
                  border: frameColor === "black" 
                    ? "14px solid #121214" 
                    : frameColor === "white" 
                    ? "14px solid #f4f4f5" 
                    : "14px solid #613b16",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 5px rgba(0,0,0,0.4)"
                }}
              >
                {/* Inner Matte White Mount for Premium Look */}
                <div className="w-full h-full border-[4px] border-zinc-100/10 overflow-hidden bg-black">
                  <img 
                    src="/img/fish.jpg" 
                    className="w-full h-full object-cover transition-all duration-1000"
                    style={{
                      filter: ambientLight === "gallery" 
                        ? "contrast(1.1) brightness(1)" 
                        : ambientLight === "espresso"
                        ? "sepia(0.2) contrast(0.95) brightness(0.85)"
                        : "contrast(1.05) brightness(0.6) grayscale(0.1)"
                    }}
                  />
                </div>
                <div className="absolute inset-0 pointer-events-none shadow-inner bg-gradient-to-tr from-black/20 via-transparent to-white/5" />
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* SECTION 3: VALUE PROPOSITION BADGES */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: "Certified Original", desc: "Every piece comes with a signed certificate of authenticity." },
          { icon: Award, title: "Premium Gallery Grade", desc: "Handcrafted using luxury vibrant oil pastel elements." },
          { icon: Truck, title: "Global Secured Courier", desc: "Insured safe transit straight from Christchurch to your wall." },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 100} threshold={0.4}>
            <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/60 rounded-xl p-4 flex items-center gap-4 transition-colors duration-500 hover:border-[#C9A24B]/30">
              <div className="p-2.5 rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/20" style={{ color: GOLD }}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{item.title}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* SECTION 4: GLASSY CONTROLLER CONSOLE */}
      <section className="max-w-7xl mx-auto px-6 mt-14">
        <div className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(201,162,75,0.1), transparent 70%)" }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Popular Selection Console</span>
                  <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:6s]" style={{ color: GOLD_SOFT, opacity: 0.8 }} />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-100 mt-0.5">
                  Curated Pieces:{" "}
                  <span className={`${spaceMono.className} text-2xl ml-1`} style={{ color: GOLD }}>
                    {loading ? ".." : countUp}
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 z-10">
            <div className="relative w-full md:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks..."
                className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition"
              />
            </div>

            <div className="flex flex-wrap items-center bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-1 gap-1">
              {filterTabs.map((tab) => {
                const active = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                      active ? "bg-zinc-900 border border-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    style={active ? { color: GOLD } : undefined}
                  >
                    {tab.id === "favorites" && <Heart className="w-2.5 h-2.5" fill={active ? GOLD : "none"} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ART CATALOG GRID */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-6 h-6 border-t-transparent rounded-full animate-spin" style={{ borderColor: GOLD, borderTopColor: "transparent", borderWidth: 1 }} />
          </div>
        ) : artworks.length === 0 ? (
          <p className="text-center text-zinc-600 text-xs py-12 font-medium tracking-wide">THE ACTIVE CATALOG IS CURRENTLY EMPTY.</p>
        ) : (
          <div className="space-y-12">
            {filteredArtworks.length === 0 ? (
              <p className="text-center text-zinc-600 text-xs py-12 font-medium tracking-wide">NO MASTERPIECES MATCH YOUR SEARCH.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredArtworks.slice(0, visibleCount).map((art, i) => (
                    <Reveal key={art.id} delay={(i % 4) * 90} threshold={0.1}>
                      <ArtCard
                        art={art}
                        isFavorite={favorites.includes(art.id)}
                        onToggleFavorite={() => toggleFavorite(art.id)}
                        onSelect={() => addToCart(art)} 
                      />
                    </Reveal>
                  ))}
                </div>

                {filteredArtworks.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-bold px-6 py-3.5 rounded-xl transition duration-300 shadow-md group"
                    >
                      <Grid className="w-4 h-4 text-zinc-500 transition group-hover:text-[#C9A24B]" />
                      <span className="transition group-hover:text-[#E9C683]">See More Masterpieces</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* SECTION 6: SPATIAL CURATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-zinc-900/50">
        <EyebrowHeading
          icon={Coffee}
          eyebrow="Spatial Curation"
          title="Curated For Luxury Architectural Spaces"
          description="See how contemporary oil pastel structures and custom frames elevate modern premium bistros and high-end walls."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcases.map((space, i) => (
            <Reveal key={space.id} delay={i * 90} threshold={0.2}>
              <div className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A24B]/30">
                <img src={space.img} alt={space.space} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[8px] uppercase font-bold tracking-widest" style={{ color: GOLD }}>Live Curation</span>
                  <h4 className="text-xs font-bold text-zinc-200 mt-0.5">{space.space}</h4>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION 7: MEET THE CREATOR SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-zinc-900/40">
        <Reveal threshold={0.3}>
          <div className="w-full bg-linear-to-br from-zinc-900/40 to-zinc-950 border border-zinc-900/60 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="group relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex-shrink-0">
              <img src="/aaa.webp" alt="Aggrani Karunarathna Profile" className="w-full h-full object-cover grayscale transition duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>The Creative Mind</span>
              <h3 className={`${fraunces.className} text-xl font-black text-zinc-100 mt-1 mb-3 tracking-tight`}>Behind The Oil Pastel Mastery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                Every stroke represents a fusion of fine emotion, heavy textures, and deep animal symbolism. Based in Christchurch, Aggrani Karunarathna brings bold color dynamics and one-of-a-kind handcrafted heirloom illustrations directly to contemporary living environments.
              </p>
              <div className="mt-5 flex justify-center md:justify-start gap-4">
                <a href="/artists" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition hover:text-[#E9C683]">
                  <Link className="w-3.5 h-3.5" />View Full Portfolio<ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 8: VOICE OF OUR PATRONS (TESTIMONIALS) */}
      <section className="w-full bg-zinc-950/20 py-16 border-t border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <EyebrowHeading icon={MessageSquare} eyebrow="Patron Invoices" title="Voice Of Our Patrons" description="Verifiable feedback received from high-end corporate curators and spatial designers." />
          
          {reviews.length === 0 ? (
            <p className="text-center text-zinc-600 text-xs font-mono py-12">NO VOICES RECORDED IN THIS AREA YET.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((fb) => (
                <Reveal key={fb.id} threshold={0.15}>
                  <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg hover:border-amber-500/10 transition-colors duration-500">
                    <p className="text-xs text-zinc-400 leading-relaxed italic mb-6">"{fb.comment}"</p>
                    <div className="border-t border-zinc-950 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200 tracking-tight">{fb.name}</h4>
                        {fb.businessName && <span className="text-[10px] text-amber-400 font-mono font-medium block mt-0.5">{fb.businessName}</span>}
                      </div>
                      <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 font-mono">Verified Client</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 9: THE FEEDBACK ENGINE */}
      <section className="w-full bg-zinc-950/60 py-16 border-t border-zinc-900/50 relative">
        <div className="max-w-md mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">Secure Feedback Matrix</span>
            <h3 className={`${fraunces.className} text-xl font-black text-zinc-100 mt-4 mb-2`}>Log Your Installation</h3>
            <p className="text-xs text-zinc-500">Are you hosting an original artifact? Share your curation architecture with the collective.</p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-zinc-900/10 p-6 rounded-2xl border border-zinc-900/80 backdrop-blur-md shadow-xl">
            <div>
              <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" required value={revName} onChange={e => setRevName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-amber-500/30 transition text-zinc-300" placeholder="e.g., Alexander Wright" />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bistro / Enterprise Name <span className="text-[7px] text-zinc-600">(Optional)</span></label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" value={revBusiness} onChange={e => setRevBusiness(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-amber-500/30 transition text-zinc-300" placeholder="e.g., Aura Fine Dining" />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Curation Commentary *</label>
              <textarea required rows={4} value={revComment} onChange={e => setRevComment(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500/30 transition text-zinc-300 resize-none" placeholder="Describe the ambient effect on your architecture..." />
            </div>

            <button type="submit" disabled={submittingReview} className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:text-black hover:bg-amber-500 text-zinc-300 font-bold uppercase tracking-wider py-3 rounded-xl text-[10px] transition duration-300 disabled:opacity-40 shadow-md">
              <Send className="w-3 h-3" />
              {submittingReview ? "Processing Core..." : "submit review"}
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 10: INFINITE ANIMATED ALLIANCES TICKER */}
      <section className="w-full bg-zinc-950/40 py-8 border-t border-zinc-900/50 overflow-hidden relative">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-ticker whitespace-nowrap flex gap-16 text-xs font-black tracking-widest uppercase text-zinc-500/30">
            {partnerships.map((partner, i) => (
              <span key={i} className="hover:text-amber-400/60 transition duration-300 cursor-default flex items-center gap-2">
                ✦ {partner}
              </span>
            ))}
          </div>
          <div className="inline-block animate-ticker whitespace-nowrap flex gap-16 text-xs font-black tracking-widest uppercase text-zinc-500/30" aria-hidden="true">
            {partnerships.map((partner, i) => (
              <span key={`dup-${i}`} className="hover:text-amber-400/60 transition duration-300 cursor-default flex items-center gap-2">
                ✦ {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: LUXURY MINIMAL FOOTER */}
      <Footer />

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16, 0.84, 0.44, 1),
            transform 0.8s cubic-bezier(0.16, 0.84, 0.44, 1);
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
        .brush-stroke--active path {
          stroke-dashoffset: 0;
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          display: flex;
          padding-left: 4rem;
          animation: ticker 35s linear infinite;
        }
      `}</style>

    </div>
  );
}