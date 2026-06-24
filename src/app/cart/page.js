"use client";
import { useCart } from "@/context/CartContext";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // Calculate Total Value
  const totalPrice = cart.reduce((total, item) => total + (item.price || 0), 0);

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
            <Link href="/gallery" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 transition uppercase tracking-wider">
              Browse Artworks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: CART ITEMS LIST (8 COLS) */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Selected Masterpieces ({cart.length})</h3>
              {cart.map((item) => (
                <div key={item.id} className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-2xl p-4 flex gap-4 items-center justify-between transition hover:border-zinc-800/80 shadow-md">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-900 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 truncate">{item.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Original Oil Pastel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className={`${spaceMono.className} text-xs font-bold text-amber-500 block`}>LKR {item.price?.toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-red-400 hover:border-red-500/20 transition flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: PROCEED TO CHECKOUT SUMMARY (4 COLS) */}
            <div className="lg:col-span-4 bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <h2 className="text-base font-black text-zinc-200 uppercase tracking-tight mb-6 border-b border-zinc-900 pb-4">Acquisition Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className={spaceMono.className}>LKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 pb-4 border-b border-zinc-900">
                  <span>Shipping & Delivery</span>
                  <span className="italic text-zinc-500">Calculated later</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Gross Total</span>
                  <span className={`${spaceMono.className} text-lg font-bold text-amber-500`}>LKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* 💡 THE BUTTON THAT TAKES USER TO CHECKOUT PAGE */}
              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition duration-300 shadow-xl">
                Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}