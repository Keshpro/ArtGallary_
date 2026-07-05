"use client";
import { useState, useEffect } from "react";
import { Fraunces, Space_Mono } from "next/font/google";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { 
  Eye, 
  ShoppingCart, 
  X, 
  Star, 
  MessageSquare, 
  User,
  Building,
  Send
} from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const GOLD = "#C9A24B";

export default function GalleryPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Global rating statistics map for all product cards
  const [ratingStats, setRatingStats] = useState({});

  // Selected Art for Live Preview Panel
  const [selectedArt, setSelectedArt] = useState(null);
  const [liveComments, setLiveComments] = useState([]);

  // New Review Form States inside Preview Panel
  const [revName, setRevName] = useState("");
  const [revBusiness, setRevBusiness] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revRating, setRevRating] = useState(5); // Default 5 Stars
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch Gallery Artworks from Firebase
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArtworks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 FETCH ALL REVIEWS LIVE TO CALCULATE RATINGS FOR EACH CARD ELIYEN
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const allReviews = snapshot.docs.map(doc => doc.data());
      
      // Calculate average rating and total counts grouping by productId
      const statsMap = {};
      allReviews.forEach(rev => {
        if (!rev.productId) return;
        if (!statsMap[rev.productId]) {
          statsMap[rev.productId] = { totalStars: 0, count: 0 };
        }
        statsMap[rev.productId].totalStars += rev.rating || 5;
        statsMap[rev.productId].count += 1;
      });

      // Format matrix into average float decimals
      const finalStats = {};
      Object.keys(statsMap).forEach(pId => {
        const avg = statsMap[pId].totalStars / statsMap[pId].count;
        finalStats[pId] = {
          average: avg.toFixed(1),
          count: statsMap[pId].count
        };
      });

      setRatingStats(finalStats);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Live Comments & Ratings for the Selected Artwork Drawer
  useEffect(() => {
    if (!selectedArt) {
      setLiveComments([]);
      return;
    }

    const q = query(
      collection(db, "reviews"), 
      where("productId", "==", selectedArt.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLiveComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.warn("Comment sorting requires an index, loading un-indexed fallback.", error);
      const fallbackQuery = query(collection(db, "reviews"), where("productId", "==", selectedArt.id));
      onSnapshot(fallbackQuery, (snap) => {
        setLiveComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    });

    return () => unsubscribe();
  }, [selectedArt]);

  // Handle Review Submission from the Preview Panel
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: selectedArt.id,
        name: revName,
        businessName: revBusiness || null,
        comment: revComment,
        rating: revRating,
        createdAt: serverTimestamp()
      });
      showToast("Review attached to this masterpiece successfully!", "success");
      setRevName(""); setRevBusiness(""); setRevComment(""); setRevRating(5);
    } catch (err) {
      console.error(err);
      showToast("Error publishing review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 px-6 py-12 relative overflow-x-hidden">
      
      {/* Film Grain Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('/grain.png')" }} />

      {/* Header Eyebrow */}
      <div className="max-w-7xl mx-auto text-center mb-16 space-y-3">
        <span className="text-[9px] uppercase font-bold tracking-widest px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-amber-500">
          ✦ Curated Archives ✦
        </span>
        <h1 className={`${fraunces.className} text-3xl md:text-5xl font-black tracking-tight`}>
          ART <span className=" font-bold text-zinc-400">VAULT</span>
        </h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">Original Oil Pastel Masterpieces & Premium Architectural Illustrations.</p>
      </div>

      {/* GALLERY GRID */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-5 h-5 border-t-transparent border-2 rounded-full animate-spin" style={{ borderColor: GOLD }} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artworks.map((art) => {
            const artStats = ratingStats[art.id];
            
            return (
              <div 
                key={art.id} 
                className="group bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/20 shadow-lg relative"
              >
                {/* Image Container */}
                <div 
                  onClick={() => setSelectedArt(art)}
                  className="relative aspect-4/5 w-full overflow-hidden bg-zinc-950 border-b border-zinc-950 cursor-pointer"
                >
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  
                  {/* 🔥 NEW: LIVE RATING BADGE INJECTED AT TOP RIGHT ON THE IMAGE */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-zinc-800/80 px-2 py-1 rounded-lg text-[9px] font-bold font-mono tracking-tight text-zinc-300">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                    <span>{artStats ? `${artStats.average} (${artStats.count})` : "0.0 (0)"}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-md border border-zinc-800 p-3 rounded-full text-amber-400 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 truncate tracking-tight">{art.title}</h3>
                    <span className={`${spaceMono.className} text-[10px] text-amber-500 font-bold block mt-0.5`}>NZD {art.price?.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArt(art)}
                    className="w-full flex items-center justify-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 font-bold uppercase tracking-wider py-2.5 rounded-xl text-[9px] transition duration-300"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-500" />
                    View Details & Reviews
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* THE HIGH-END CINEMATIC LIVE PREVIEW DRAWER PANEL */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedArt(null)} />

          <div className="relative w-full max-w-md h-full bg-[#09090b] border-l border-zinc-900 p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-500">
            
            {/* Upper Section */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Artifact Blueprint</span>
              <button 
                onClick={() => setSelectedArt(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Section: Scrollable Content */}
            <div className="flex-1 overflow-y-auto my-5 pr-1 space-y-6 custom-scrollbar">
              
              <div className="w-full aspect-4/5 rounded-xl overflow-hidden border border-zinc-900 shadow-xl relative bg-zinc-950">
                <img src={selectedArt.imageUrl} alt={selectedArt.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <h2 className={`${fraunces.className} text-xl font-black text-zinc-100 tracking-tight`}>{selectedArt.title}</h2>
                <span className={`${spaceMono.className} text-sm font-black text-amber-500 block`}>NZD {selectedArt.price?.toLocaleString()}</span>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2">{selectedArt.description}</p>
              </div>

              {/* LIVE REVIEWS SUBMISSION ENGINE INSIDE PREVIEW */}
              <div className="bg-zinc-900/20 border border-zinc-900/80 rounded-2xl p-5 shadow-xl space-y-4">
                <div>
                  <span className="text-[8px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">Review Input</span>
                  <h4 className={`${fraunces.className} text-sm font-black text-zinc-200 mt-2`}>Write a Review</h4>
                </div>
                
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Name *</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                        <input type="text" required value={revName} onChange={e => setRevName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-8 pr-2 py-1.5 text-[11px] focus:outline-none focus:border-amber-500/30 transition text-zinc-300" placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bistro Name</label>
                      <div className="relative">
                        <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                        <input type="text" value={revBusiness} onChange={e => setRevBusiness(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-8 pr-2 py-1.5 text-[11px] focus:outline-none focus:border-amber-500/30 transition text-zinc-300" placeholder="Optional" />
                      </div>
                    </div>
                  </div>

                  {/* Star Rating Selection */}
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Rating Ratio</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className="p-0.5 transition transform active:scale-95"
                        >
                          <Star 
                            className="w-4 h-4 transition-colors" 
                            style={{ color: star <= revRating ? GOLD : "#3f3f46" }}
                            fill={star <= revRating ? GOLD : "none"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Commentary *</label>
                    <textarea required rows={2} value={revComment} onChange={e => setRevComment(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-1.5 text-[11px] focus:outline-none focus:border-amber-500/30 transition text-zinc-300 resize-none" placeholder="Your experience with this art..." />
                  </div>

                  <button type="submit" disabled={submittingReview} className="w-full flex items-center justify-center gap-1.5 bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:text-black hover:bg-amber-500 text-zinc-400 font-bold uppercase tracking-wider py-2 rounded-xl text-[9px] transition duration-300 disabled:opacity-40">
                    <Send className="w-2.5 h-2.5" />
                    {submittingReview ? "Submitting Matrix..." : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* Live Comments Output Display */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Patron Commentary</h4>
                  </div>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-mono">{liveComments.length} Nodes</span>
                </div>

                {liveComments.length === 0 ? (
                  <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-xl text-center">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase">No active comment matrices recorded for this art.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveComments.map((comment) => (
                      <div key={comment.id} className="bg-zinc-900/20 border border-zinc-900 p-4 rounded-xl space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-zinc-200">{comment.name}</h5>
                            {comment.businessName && <span className="text-[8px] text-amber-500 font-mono block">{comment.businessName}</span>}
                          </div>
                          
                          {comment.rating && (
                            <div className="flex items-center gap-0.5">
                              {[...Array(comment.rating)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 italic leading-relaxed">"{comment.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Section: Fixed Action */}
            <div className="pt-4 border-t border-zinc-900 bg-[#09090b]">
              <button
                onClick={() => {
                  addToCart(selectedArt);
                  setSelectedArt(null);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 border border-amber-600 hover:bg-amber-600 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition duration-300 shadow-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                Acquire Artwork To Cart
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f1f23;
          border-radius: 10px;
        }
      `}</style>

    </div>
  );
}