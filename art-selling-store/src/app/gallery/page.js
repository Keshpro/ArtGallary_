"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ShoppingCart, X, ArrowRight, SlidersHorizontal, Sparkles, Grid3X3 } from "lucide-react";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Checkout Modal State
  const [selectedArt, setSelectedArt] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch ALL Artworks from Firebase Firestore
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
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-amber-500/20 font-sans antialiased pb-24">
      
      {/* HEADER HERO AREA */}
      <div className="relative w-full h-[220px] bg-gradient-to-b from-zinc-900/20 to-transparent border-b border-zinc-900/30 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="z-10">
          <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Complete Active Inventory
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3 tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent uppercase">
            The Art Vault
          </h1>
        </div>
      </div>

      {/* DYNAMIC CONSOLE BLOCK */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_#f59e0b]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inventory Status</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-zinc-100 mt-0.5">
                Total Available Masterpieces: <span className="text-amber-500 font-mono text-xl ml-1">{loading ? ".." : artworks.length}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="hidden sm:flex items-center bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-1">
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-lg shadow-sm">All Assets</button>
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 text-zinc-500 hover:text-zinc-300 transition">Physical</button>
              <button type="button" className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 text-zinc-500 hover:text-zinc-300 transition">Digital NFT</button>
            </div>
            <button type="button" className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-bold px-4 py-3 rounded-xl transition">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Matrix
            </button>
          </div>
        </div>
      </section>

      {/* FULL INVENTORY GRID */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-6 h-6 border border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center bg-zinc-900/10 border border-zinc-900 rounded-2xl py-16">
            <Grid3X3 className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">No artworks are listed in the gallery vault right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <div 
                key={art.id} 
                className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-2xl overflow-hidden transition-all duration-500 hover:border-zinc-700/60 shadow-lg"
              >
                {/* Image Showcase Frame */}
                <div className="relative aspect-[4/5] w-full bg-[#0d0d0f] overflow-hidden border-b border-zinc-950">
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Space */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1 group-hover:text-amber-400 transition duration-300 truncate">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mb-4 h-8 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Value</span>
                      <span className="text-sm font-black font-mono text-zinc-100 tracking-tight">
                        LKR {art.price?.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedArt(art)} 
                      className="flex items-center gap-1.5 bg-zinc-900 hover:bg-amber-500 hover:text-black text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition duration-300 border border-zinc-800/80 hover:border-amber-400"
                    >
                      Acquire Art
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* GLASSY CHECKOUT MODAL POPUP */}
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
                <button type="submit" disabled={submitting} className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-[10px] transition duration-300 disabled:opacity-50 shadow-lg shadow-amber-500/10">
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