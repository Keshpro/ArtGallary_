"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ShoppingCart, X, ArrowRight, SlidersHorizontal, Sparkles, ShieldCheck, Award, Truck, Link, ArrowUpRight, MessageSquare, Coffee, Grid } from "lucide-react";
import ArtCarousel from "@/components/ArtCarousel";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4); // මුලින්ම ආර්ට්ස් 4ක් පමණක් පෙන්වීමට
  
  // Checkout Modal State
  const [selectedArt, setSelectedArt] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Clients & Showcases Data for Cafe/Restaurant Theme
  const clients = ["The Espresso Club", "Aura Fine Dining", "Nesta Luxury Hotel", "Minimalist Cafe", "Urban Canvas Bistro", "Vogue Lounge"];
  
  const showcases = [
    { id: 1, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop", space: "Aura Dining Hall" },
    { id: 2, img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=600&auto=format&fit=crop", space: "The Espresso Club Lounge" },
    { id: 3, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop", space: "Nesta Executive Suite" },
    { id: 4, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop", space: "Minimalist Bistro Wall" }
  ];

  const feedbacks = [
    { id: 1, name: "Ranil De Silva", role: "Owner, Aura Fine Dining", text: "The charcoal masterpieces transformed our main dining hall into a luxury gallery. Our premium clients constantly compliment the depth of the art." },
    { id: 2, name: "Sarah Jennifer", role: "Interior Lead, Nesta Group", text: "Absolute perfection. The curation, frame quality, and emotional texture of the pieces matched our high-end minimalist hotel aesthetics flawlessly." },
    { id: 3, name: "Ahamad Bilal", role: "Founder, The Espresso Club", text: "Fast logistics and verified authenticity. Having these original pieces hanging on our rustic brick cafe walls raised our brand image instantly." }
  ];

  // Fetch Artworks from Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, "artworks"), orderBy("createdAt", "desc"));
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

  // Handle Form Checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      artworkId: selectedArt.id,
      artworkTitle: selectedArt.title,
      price: selectedArt.price,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Your order has been placed successfully! Check your email. 🚀");
        setName(""); setEmail(""); setPhone(""); setAddress(""); setSelectedArt(null);
      } else {
        alert("Failed to process order.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-amber-500/20 font-sans antialiased overflow-x-hidden">
      
      {/* SECTION 1: TOP CAROUSEL ADS/FEATURED */}
      <ArtCarousel />

      {/* SECTION 2: OUR CLIENTS BRAND LOGO BAR */}
      <section className="w-full bg-zinc-950/60 py-6 border-y border-zinc-900/40 mt-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-6 justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Trusted By Premium Spaces:</span>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-40">
            {clients.map((client, i) => (
              <span key={i} className="text-xs font-black tracking-tight uppercase hover:opacity-100 transition duration-300 text-zinc-400 cursor-default">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: VALUE PROPOSITION BADGES */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/60 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Certified Original</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Every piece comes with a signed certificate.</p>
          </div>
        </div>
        <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/60 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400"><Award className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Premium Gallery Grade</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Handcrafted using luxury archival materials.</p>
          </div>
        </div>
        <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/60 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400"><Truck className="w-5 h-5" /></div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Secure Courier Logistics</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Insured safe delivery straight to your studio.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: GLASSY CONTROLLER CONSOLE */}
      <section className="max-w-7xl mx-auto px-6 mt-14">
        <div className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_#f59e0b]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Popular Selection Console</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80 animate-spin [animation-duration:6s]" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-100 mt-0.5">
                Curated Pieces: <span className="text-amber-500 font-mono text-2xl ml-1">{loading ? ".." : artworks.length}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 z-10">
            <div className="hidden sm:flex items-center bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-1">
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-lg shadow-sm">All Creations</button>
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 text-zinc-500 hover:text-zinc-300 transition">Physical</button>
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 text-zinc-500 hover:text-zinc-300 transition">Digital NFT</button>
            </div>
            <button type="button" className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-bold px-4 py-3 rounded-xl transition">
              <SlidersHorizontal className="w-3.5 h-3.5" />Sort
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: ART CATALOG GRID WITH SEE MORE ACTION */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-6 h-6 border border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : artworks.length === 0 ? (
          <p className="text-center text-zinc-600 text-xs py-12 font-medium tracking-wide">THE ACTIVE CATALOG IS CURRENTLY EMPTY.</p>
        ) : (
          <div className="space-y-12">
            {/* Displaying slice based on dynamic visibleCount state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artworks.slice(0, visibleCount).map((art) => (
                <div key={art.id} className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-2xl overflow-hidden transition-all duration-500 hover:border-zinc-700/60 shadow-lg">
                  <div className="relative aspect-4/5 w-full bg-[#0d0d0f] overflow-hidden border-b border-zinc-950">
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1 group-hover:text-amber-400 transition duration-300 truncate">{art.title}</h3>
                    <p className="text-[11px] text-zinc-500 mb-4 h-8 line-clamp-2 leading-relaxed">{art.description}</p>
                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Value</span>
                        <span className="text-sm font-black font-mono text-zinc-100 tracking-tight">LKR {art.price?.toLocaleString()}</span>
                      </div>
                      <button onClick={() => setSelectedArt(art)} className="flex items-center gap-1.5 bg-zinc-900 hover:bg-amber-500 hover:text-black text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition duration-300 border border-zinc-800/80 hover:border-amber-400">Acquire Art</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic See More Trigger Button */}
            {artworks.length > visibleCount && (
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-amber-400 text-xs font-bold px-6 py-3.5 rounded-xl transition duration-300 shadow-md group"
                >
                  <Grid className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
                  See More Masterpieces
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* SECTION 6: CAFE & RESTURANT SHOWCASE WITH SMOOTH SCROLL EFFECTS */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-zinc-900/50">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded-full text-amber-400 text-[9px] uppercase font-bold tracking-widest">
            <Coffee className="w-3 h-3" /> Spatial Curation
          </div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-100 mt-2 tracking-tight">Curated For Luxury Spaces</h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-md">See how our custom canvas and graphite frames elevate modern premium bistros and high-end cafes.</p>
        </div>

        {/* Animated Showcase Grid with Hover Parallax-like Movement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcases.map((space) => (
            <div key={space.id} className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-md transition-all duration-500 hover:-translate-y-1">
              <img src={space.img} alt={space.space} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[8px] uppercase font-bold tracking-widest text-amber-500">Live Installation</span>
                <h4 className="text-xs font-bold text-zinc-200 mt-0.5">{space.space}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: MEET THE CREATOR SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-zinc-900/40">
        <div className="w-full bg-linear-to-br from-zinc-900/40 to-zinc-950 border border-zinc-900/60 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex-shrink-0 grayscale hover:grayscale-0 transition duration-500">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" alt="Lead Artist Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">The Creative Mind</span>
            <h3 className="text-xl font-black text-zinc-100 mt-1 mb-3 tracking-tight">Behind The Masterpieces</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
              Every stroke represents a fusion of fine emotion and contemporary depth. Specializing in physical canvas curation and fine detail portraits, each masterpiece hosted here is a unique heirloom item designed to transform modern living environments.
            </p>
            <div className="mt-5 flex justify-center md:justify-start gap-4">
              <a href="#" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-amber-400 transition">
                <Link className="w-3.5 h-3.5" />View Portfolio<ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CUSTOMER FEEDBACKS (TESTIMONIALS) */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-zinc-900/50">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded-full text-amber-400 text-[9px] uppercase font-bold tracking-widest">
            <MessageSquare className="w-3 h-3" /> Reviews
          </div>
          <h2 className="text-xl font-black text-zinc-100 mt-2 tracking-tight">Voice Of Our Patrons</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900/80 rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
              <p className="text-xs text-zinc-400 leading-relaxed italic mb-6">"{fb.text}"</p>
              <div className="border-t border-zinc-950 pt-4">
                <h4 className="text-xs font-bold text-zinc-200">{fb.name}</h4>
                <span className="text-[10px] text-zinc-500 font-medium">{fb.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: LUXURY MINIMAL FOOTER */}
      <footer className="w-full border-t border-zinc-900/80 bg-[#070708] py-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest font-semibold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 KreativeLabs Art. All Rights Reserved.</span>
          <div className="flex gap-6 text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition">Terms</a>
            <a href="#" className="hover:text-zinc-300 transition">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* SECTION 10: GLASSY CHECKOUT MODAL */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedArt(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-900 transition"><X className="w-4 h-4" /></button>
            <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Secured Acquisition</span>
            <h2 className="text-lg font-black text-zinc-100 mt-3 mb-1">Confirm Request</h2>
            <p className="text-xs text-zinc-400 mb-5">Acquiring masterpiece: <span className="text-zinc-200 font-bold">{selectedArt.title}</span></p>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200" placeholder="e.g., John Doe" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200" placeholder="name@domain.com" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Phone Contact</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200" placeholder="07XXXXXXXX" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Shipping Destination</label>
                <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200 resize-none" placeholder="Complete home or studio address..." />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-6 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Total Value</span>
                  <span className="text-base font-black font-mono text-amber-500">LKR {selectedArt.price?.toLocaleString()}</span>
                </div>
                <button type="submit" disabled={submitting} className="flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-[10px] transition duration-300 disabled:opacity-50 shadow-lg shadow-amber-500/10">
                  {submitting ? "Verifying..." : "Submit Invoice"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}