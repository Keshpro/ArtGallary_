"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { X, ArrowRight, SlidersHorizontal, Sparkles, Grid3X3, Star, MessageSquare, Maximize2 } from "lucide-react";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Curation View States
  const [selectedArt, setSelectedArt] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [buyingMode, setBuyingMode] = useState(false);

  // Form Inputs States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔥 Review & Comments States
  const [reviewerName, setReviewerName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // 🔥 Average Rating එක ගණනය කරන ලොජික් එක
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 5.0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // 🔥 Firebase Submit Review & Comment Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName || !commentText) return;
    setSubmittingReview(true);

    const newReview = {
      reviewerName,
      commentText,
      rating: parseInt(ratingValue),
      timestamp: new Date().toLocaleDateString("en-US")
    };

    try {
      const artRef = doc(db, "artworks", selectedArt.id);
      
      // Firestore ArrayUnion හරහා reviews array එකට අලුත් comment එක එකතු කිරීම
      await updateDoc(artRef, {
        reviews: arrayUnion(newReview)
      });

      // Local State එක ක්ෂණිකව අප්ඩේට් කිරීම
      setSelectedArt((prev) => ({
        ...prev,
        reviews: prev.reviews ? [...prev.reviews, newReview] : [newReview]
      }));

      setReviewerName("");
      setCommentText("");
      alert("Your curation critique has been added! ✨");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle Acquisition/Checkout Invoice
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
        alert("Invoice generated! Check your email. 🚀");
        setName(""); setEmail(""); setPhone(""); setAddress(""); 
        setBuyingMode(false); setViewingDetails(false); setSelectedArt(null);
      } else {
        alert("Failed to process order.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-amber-500/20 font-sans antialiased pb-24">
      
      {/* HERO BANNER AREA */}
      <div className="relative w-full h-[220px] bg-zinc-900/10 border-b border-zinc-900/30 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <h1 className="text-3xl md:text-5xl font-black mt-3 bg-linear-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent uppercase tracking-tight">The Art Vault</h1>
      </div>

      {/* DYNAMIC METRICS CONSOLE */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_#f59e0b]" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inventory Sync</span>
              <h2 className="text-lg font-extrabold tracking-tight text-zinc-100 mt-0.5">Available Masterpieces: <span className="text-amber-500 font-mono text-xl ml-1">{loading ? ".." : artworks.length}</span></h2>
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 text-xs font-bold px-4 py-3 rounded-xl transition"><SlidersHorizontal className="w-3.5 h-3.5" /> Matrix</button>
        </div>
      </section>

      {/* INVENTORY GRID AREA */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {loading ? (
          <div className="flex justify-center items-center py-24"><div className="w-6 h-6 border border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : artworks.length === 0 ? (
          <div className="text-center bg-zinc-900/10 border border-zinc-900 rounded-2xl py-16"><Grid3X3 className="w-8 h-8 text-zinc-700 mx-auto mb-3" /><p className="text-zinc-500 text-xs uppercase tracking-wide">No assets loaded.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map((art) => {
              const avgRating = calculateAverageRating(art.reviews);
              return (
                <div key={art.id} className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-900/80 rounded-2xl overflow-hidden transition-all duration-500 hover:border-zinc-700/60 shadow-lg relative">
                  <div className="relative aspect-[4/5] w-full bg-[#0d0d0f] overflow-hidden border-b border-zinc-950">
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-800 text-amber-400 text-[10px] font-bold font-mono">
                      <Star className="w-3 h-3 fill-amber-400" /> {avgRating}
                    </div>
                    {/* View Details Action Trigger */}
                    <button onClick={() => { setSelectedArt(art); setViewingDetails(true); }} className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-bold gap-2">
                      <Maximize2 className="w-4 h-4 text-amber-500" /> Inspect Masterpiece
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-zinc-200 tracking-tight truncate mb-1">{art.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mb-3">Scale: {art.size || 'Custom Size'}</p>
                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                      <span className="text-sm font-black font-mono text-zinc-100">LKR {art.price?.toLocaleString()}</span>
                      <button onClick={() => { setSelectedArt(art); setViewingDetails(true); }} className="text-[10px] bg-zinc-900 hover:bg-amber-500 hover:text-black font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition border border-zinc-800/80 hover:border-amber-400">View & Critique</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 🔥 MAIN DETAILS INSPECTION & COMMENTING MODAL (PREMIUM DUAL GRID) */}
      {viewingDetails && selectedArt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in duration-300">
            
            <button onClick={() => { setViewingDetails(false); setBuyingMode(false); }} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1.5 rounded-xl bg-zinc-900/50 border border-zinc-850 transition"><X className="w-4 h-4" /></button>

            {/* LEFT SIDE: GRAPHICS & CORE ATTRIBUTES */}
            <div className="space-y-4">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-900 shadow-inner">
                <img src={selectedArt.imageUrl} alt={selectedArt.title} className="w-full h-full object-cover" />
              </div>
              <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-xl p-4 space-y-2">
                <h2 className="text-xl font-black tracking-tight text-zinc-100">{selectedArt.title}</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{selectedArt.description}</p>
                <div className="flex justify-between items-center border-t border-zinc-900 pt-3 mt-2">
                  <div>
                    <span className="block text-[8px] uppercase font-bold text-zinc-500 font-mono">Dimensions</span>
                    <span className="text-xs font-bold text-zinc-300">{selectedArt.size || 'Bespoke Medium'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase font-bold text-zinc-500 font-mono">Curation Value</span>
                    <span className="text-base font-black font-mono text-amber-500">LKR {selectedArt.price?.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setBuyingMode(true)} className="w-full mt-3 bg-linear-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition shadow-md">Acquire Masterpiece Frame</button>
              </div>
            </div>

            {/* RIGHT SIDE: LIVE REVIEWS, COMMENTS & SUBMIT FORM */}
            <div className="flex flex-col justify-between space-y-6">
              
              {/* Reviews History Display List */}
              <div className="flex-1 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Collector Critiques ({selectedArt.reviews?.length || 0})
                </h3>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {!selectedArt.reviews || selectedArt.reviews.length === 0 ? (
                    <p className="text-[11px] text-zinc-600 italic py-6">No evaluations have been written for this masterpiece yet.</p>
                  ) : (
                    selectedArt.reviews.map((rev, idx) => (
                      <div key={idx} className="bg-zinc-900/30 border border-zinc-900/50 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-300">{rev.reviewerName}</span>
                          <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold font-mono">
                            <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">"{rev.commentText}"</p>
                        <span className="block text-[8px] text-zinc-600 text-right font-mono">{rev.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Review Form Block */}
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide mb-3">Leave Curation Critique</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Collector Name</label>
                      <input type="text" required value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Curation Rating</label>
                      <select value={ratingValue} onChange={e => setRatingValue(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-amber-500 transition">
                        <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                        <option value="4">⭐⭐⭐⭐ Good (4)</option>
                        <option value="3">⭐⭐⭐ Average (3)</option>
                        <option value="2">⭐⭐ Fair (2)</option>
                        <option value="1">⭐ Poor (1)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Critique Comment</label>
                    <textarea rows={2} required value={commentText} onChange={e => setCommentText(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition resize-none" placeholder="Share your architectural or emotional perspective..." />
                  </div>
                  <button type="submit" disabled={submittingReview} className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-amber-400 text-zinc-300 font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition disabled:opacity-50">
                    {submittingReview ? "Submitting Critique..." : "Submit Curation Review"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* GLASSY SECURED ACQUISITION MODAL (INVOICE GENERATOR) */}
      {buyingMode && selectedArt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setBuyingMode(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1 rounded-lg transition"><X className="w-4 h-4" /></button>
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
                <button type="submit" disabled={submitting} className="flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 text-black font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-[10px] transition duration-300 disabled:opacity-50 shadow-lg shadow-amber-500/10">
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