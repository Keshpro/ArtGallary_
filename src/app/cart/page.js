"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Calculate Total Value
  const totalPrice = cart.reduce((total, item) => total + (item.price || 0), 0);

  const handleBulkCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    setSubmitting(true);

    // Multi-item Order structure
    const orderData = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      artworks: cart.map(item => ({ id: item.id, title: item.title, price: item.price })),
      totalPrice: totalPrice,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        clearCart();
      } else {
        showToast("Acquisition protocol failed. Please check connectivity.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Something went wrong during data matrix sync.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col justify-between pt-24 font-sans antialiased">
        <div className="max-w-md mx-auto px-6 text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-3xl backdrop-blur-md my-auto shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-zinc-100">Acquisition Dispatched!</h2>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Your premium invoice has been logged into the matrix. Our private courier vault will contact you shortly via email.
          </p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition">
            <ArrowLeft className="w-4 h-4" /> Return to Gallery
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 pt-24 font-sans antialiased flex flex-col justify-between">
      <main className="max-w-6xl mx-auto w-full px-6 pb-24">
        
        {/* PAGE HEADER */}
        <div className="flex items-center gap-3 border-b border-zinc-900/60 pb-6 mb-10">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Vault Collection</span>
            <h1 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tight uppercase">Curation Cart</h1>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center bg-zinc-900/10 border border-zinc-900/50 rounded-2xl backdrop-blur-xs">
            <p className="text-zinc-600 text-xs font-semibold tracking-wide uppercase">Your curation cart is currently empty.</p>
            <Link href="/" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 transition uppercase tracking-wider">
              Browse Artworks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: CART ITEMS LIST (7 COLS) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Selected Items ({cart.length})</h3>
              {cart.map((item) => (
                <div key={item.id} className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-2xl p-4 flex gap-4 items-center justify-between transition hover:border-zinc-800/80 shadow-md">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-900 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 truncate">{item.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Size: {item.size || "Bespoke Frame"}</p>
                      <span className="text-xs font-black font-mono text-amber-500 mt-1 block">LKR {item.price?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.id)} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-red-400 hover:border-red-500/20 transition flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT: CHECKOUT SECURED PROMPT (5 COLS) */}
            <div className="lg:col-span-5 bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400 text-[9px] uppercase font-bold tracking-widest w-fit mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Secured Acquisition Portal
              </div>
              <h2 className="text-base font-black text-zinc-200 uppercase tracking-tight mb-4">Confirm Spatial Request</h2>
              
              <form onSubmit={handleBulkCheckout} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="e.g., John Doe" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="name@domain.com" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Phone Contact</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="07XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Shipping Destination</label>
                  <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition resize-none" placeholder="Complete gallery installation or studio address..." />
                </div>

                {/* MATRIX PRICING SUMMARY */}
                <div className="border-t border-zinc-900 pt-4 mt-6 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Total Value</span>
                    <span className="text-base font-black font-mono text-amber-500">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" disabled={submitting} className="flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-[10px] transition disabled:opacity-50 shadow-md">
                    {submitting ? "Verifying Matrix..." : "Submit All Invoices"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}