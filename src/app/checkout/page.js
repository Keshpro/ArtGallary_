"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Fraunces, Space_Mono } from "next/font/google";
import Link from "next/link"; 
import { ShieldCheck, ShoppingBag, User, Phone, Mail, MapPin, CreditCard, ArrowRight } from "lucide-react";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600"], style: ["italic", "normal"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// 💡 YOUR ACTIVE GOOGLE WEB APP PIPELINE LINK
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCPRZOfdgD3nd2QjRyjDIMyWV3yuJWzndyOBgTdq7u-gWuHAw1zrGiU7jcowL-jzgX/exec";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const totalPrice = cart.reduce((total, item) => total + (item.price || 0), 0);
  const artworksList = cart.map(item => `- ${item.title} (NZD ${item.price})`).join("\n");

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    const orderPayload = {
      name,
      phone,
      email,
      address,
      artworks: artworksList,
      totalPrice: totalPrice.toLocaleString()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      setOrderSuccess(true);
      clearCart(); 
    } catch (err) {
      console.error("Order deployment crashed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-500 animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className={`${fraunces.className} text-2xl font-black text-zinc-100`}>Acquisition Initiated</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your order matrix has been securely pinned to our Google sheets architecture. A studio representative will contact you shortly via phone for courier confirmation.
          </p>
          <Link href="/gallery" className="inline-block bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition hover:border-amber-500/30">
            Return To Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 px-6 py-12">
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* LEFT: INFORMATION ENTRY FORM (7 COLS) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div>
            <span className="text-[8px] font-mono font-black uppercase tracking-widest text-amber-500 block mb-1">Secure Secure Node</span>
            <h2 className={`${fraunces.className} text-xl font-black text-zinc-200 tracking-tight`}>Patron Logistics Checkout</h2>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-amber-500/30 text-zinc-300 transition" placeholder="John Doe" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-amber-500/30 text-zinc-300 transition" placeholder="006 *********" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-amber-500/30 text-zinc-300 transition" placeholder="Enter Your Verified Email" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500">Shipping / Delivery Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-3.5 h-3.5 text-zinc-600" />
                <textarea required rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-amber-500/30 text-zinc-300 transition resize-none" placeholder="Enter your shipping address" />
              </div>
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-amber-500/80 mt-0.5" />
              <div>
                <h4 className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">Cash on Delivery / Bank Transfer Only</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">To optimize local logistics in New Zealand, payments are verified post-submission through direct studio handling management.</p>
              </div>
            </div>

            <button type="submit" disabled={loading || cart.length === 0} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider py-4 rounded-xl text-xs transition duration-300 shadow-xl disabled:opacity-30">
              {loading ? "Syncing Pipeline..." : "Confirm & Place Artwork Order"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT: SUMMARY MATRIX SPECIMEN (5 COLS) */}
        <div className="lg:col-span-5 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 h-fit space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Specimen Ledger</h3>
          </div>

          {cart.length === 0 ? (
            <p className="text-[11px] font-mono text-zinc-600 uppercase text-center py-6">Your acquisition ledger is empty.</p>
          ) : (
            <div className="space-y-3 divide-y divide-zinc-900/40">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="max-w-[70%]">
                    <h4 className="text-xs font-bold text-zinc-300 truncate">{item.title}</h4>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase">Original Canvas</span>
                  </div>
                  <span className={`${spaceMono.className} text-xs text-amber-500 font-bold`}>LKR {item.price?.toLocaleString()}</span>
                </div>
              ))}
              
              <div className="pt-4 flex items-center justify-between font-bold text-sm text-zinc-200 border-t border-zinc-900">
                <span className="uppercase text-[10px] tracking-wider text-zinc-500">Gross Total</span>
                <span className={`${spaceMono.className} text-base text-amber-500`}>LKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}