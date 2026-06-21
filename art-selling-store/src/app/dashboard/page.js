"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import ImageUploader from "@/components/ImageUploader";
import { PlusCircle, Trash2, Edit3, Package, Layers, Bell, Check, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  
  // States for Product CRUD
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState(""); 
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingArt, setSavingArt] = useState(false);
  
  // Edit State Management
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // States for Orders Tracking
  const [orders, setOrders] = useState([]);

  // Fetch Live Data from Firebase Firestore
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubProducts(); unsubOrders(); };
  }, []);

  // Trigger Edit Mode (Form එකට සහ Uploader එකට ස්වයංක්‍රීයව පරණ පින්තූරය ඇතුළු සියලුම Data ලබාදීම)
  const startEditProduct = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setSize(product.size || ""); 
    setDescription(product.description);
    
    // Image URL එක සෙට් කරන නිසා ImageUploader එක ඇතුළේ පින්තූරය පෙන්වයි
    setImageUrl(product.imageUrl);
    
    // Smoothly scroll back to top form for easy editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit Mode & Reset Form Fields
  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle(""); setPrice(""); setSize(""); setDescription(""); setImageUrl("");
  };

  // CRUD: Add OR Update Product Handler
  const handleArtworkSubmit = async (e) => {
    e.preventDefault();
    
    // CREATE කරද්දී විතරක් ඉමේජ් එක අනිවාර්ය කිරීම (Edit කරද්දී පරණ එකම ගන්නවා)
    if (!isEditing && !imageUrl) {
      return alert("Upload image first!");
    }
    
    setSavingArt(true);

    try {
      if (isEditing) {
        // 🛠️ UPDATE EXISTING PRODUCT WORKFLOW
        const productRef = doc(db, "products", editId);
        
        // ස්මාර්ට් චෙක් එක: යූසර් අලුත් ඉමේජ් එකක් දැමූවොත් ඒක ගන්නවා, නැත්නම් පරණ එකම තියාගන්නවා
        const finalImageUrl = imageUrl || products.find(product => product.id === editId)?.imageUrl;

        await updateDoc(productRef, {
          title,
          price: parseFloat(price) || 0,
          size, 
          description,
          imageUrl: finalImageUrl, 
          updatedAt: serverTimestamp()
        });
        alert("Masterpiece Updated Successfully! 🔥");
        cancelEdit();
      } else {
        // ➕ CREATE NEW PRODUCT WORKFLOW
        await addDoc(collection(db, "products"), { 
          title, 
          price: parseFloat(price) || 0, 
          size, 
          description, 
          imageUrl, 
          createdAt: serverTimestamp(),
          reviews: [] 
        });
        alert("New Masterpiece Published!");
        setTitle(""); setPrice(""); setSize(""); setDescription(""); setImageUrl("");
      }
    } catch (err) { 
      console.error(err); 
      alert("Error saving data to cloud matrix.");
    } finally { 
      setSavingArt(false); 
    }
  };

  // CRUD: Delete Product
  const handleDeleteProduct = async (id) => {
    if (confirm("Delete this masterpiece permanently?")) {
      await deleteDoc(doc(db, "products", id));
      if (isEditing && editId === id) cancelEdit();
    }
  };

  // Orders: Update Delivery Status
  const handleUpdateOrderStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Pending" ? "Shipped" : "Delivered";
    await updateDoc(doc(db, "orders", id), { status: nextStatus });
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans antialiased flex flex-col md:flex-row">
      
      {/* LEFT NAVIGATION CONSOLE (TAB BAR) */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900/60 p-6 space-y-2 flex-shrink-0">
        <h1 className="text-sm font-black tracking-widest text-amber-500 uppercase mb-6 flex items-center gap-2"><Layers className="w-4 h-4" /> Admin Console</h1>
        
        <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition ${activeTab === "products" ? "bg-zinc-900 text-amber-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
          <Package className="w-4 h-4" /> Manage Products
        </button>
        <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition ${activeTab === "orders" ? "bg-zinc-900 text-amber-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
          <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Acquisition Orders</span>
          {orders.filter(o => o.status === "Pending").length > 0 && (
            <span className="bg-amber-500 text-black font-mono font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {orders.filter(o => o.status === "Pending").length}
            </span>
          )}
        </button>
      </aside>

      {/* RIGHT WORKSPACE CONSOLE */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl">
        
        {/* TAB 1: PRODUCTS CRUD MANAGER */}
        {activeTab === "products" && (
          <div className="space-y-12">
            
            {/* Control Block Form */}
            <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black uppercase text-zinc-200 tracking-tight">
                  {isEditing ? "⚙️ Edit Mode: Update Masterpiece" : "Publish New Masterpiece"}
                </h2>
                {isEditing && (
                  <button type="button" onClick={cancelEdit} className="text-[10px] font-bold uppercase text-zinc-500 hover:text-red-400 transition flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleArtworkSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="e.g., Midnight Veil" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Value (LKR)</label>
                      <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Dimensions / Size</label>
                      <input type="text" required value={size} onChange={e => setSize(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition" placeholder="e.g., 24x36 Canvas" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Description</label>
                    <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition resize-none" placeholder="Curation notes..." />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500 mb-1">Canvas Frame Synchronization</label>
                  
                  <ImageUploader 
                    onUploadSuccess={url => setImageUrl(url)} 
                    existingImage={imageUrl} 
                  />

                  <button type="submit" disabled={savingArt} className={`w-full mt-4 text-black font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-40 shadow-md ${isEditing ? "bg-linear-to-r from-teal-400 to-emerald-500" : "bg-linear-to-r from-amber-500 to-amber-600"}`}>
                    <PlusCircle className="w-4 h-4" /> 
                    {savingArt ? "Saving Data..." : isEditing ? "Update Masterpiece" : "Publish Masterpiece"}
                  </button>
                </div>
              </form>
            </div>

            {/* Catalog Grid View */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Active Live Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 🔥 මෙතැනදී පරණ artworks වෙනුවට products ලෙස නිවැරදිව සිතියම්ගත (Map) කර ඇත */}
                {products.map((art) => (
                  <div key={art.id} className={`bg-zinc-900/10 border rounded-2xl overflow-hidden p-4 flex gap-4 items-center justify-between transition duration-300 ${editId === art.id ? "border-amber-500/60 bg-zinc-900/30 shadow-md" : "border-zinc-900"}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={art.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-zinc-950 border border-zinc-900 flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-200 truncate">{art.title}</h4>
                        <p className="text-[9px] text-zinc-500 font-mono truncate">Size: {art.size || "Bespoke"}</p>
                        <span className="text-[10px] font-mono text-amber-500">LKR {art.price?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => startEditProduct(art)} className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-amber-400 hover:border-amber-500/20 transition">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(art.id)} className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-red-400 hover:border-red-500/20 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDER TRACKER */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-base font-black uppercase text-zinc-200 tracking-tight mb-4">Live Acquisition Invoices</h2>
            {orders.length === 0 ? (
              <p className="text-zinc-600 text-xs tracking-wide">NO LIVE INVOICES RECORDED YET.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-zinc-100">{order.customerName}</span>
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${order.status === "Pending" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : order.status === "Shipped" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>{order.status}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">Acquiring: <span className="text-zinc-200 font-bold">{order.artworkTitle}</span> &bull; Value: <span className="font-mono text-amber-400">LKR {order.price?.toLocaleString()}</span></p>
                      <p className="text-[10px] text-zinc-500">Contact: {order.customerPhone} | Destination: {order.customerAddress}</p>
                    </div>
                    {order.status !== "Delivered" && (
                      <button onClick={() => handleUpdateOrderStatus(order.id, order.status)} className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-amber-500" />
                        {order.status === "Pending" ? "Mark As Shipped" : "Mark As Delivered"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}