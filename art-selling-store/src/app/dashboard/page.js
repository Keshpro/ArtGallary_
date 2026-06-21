"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ImageUploader from "@/components/ImageUploader";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload an image first!");
      return;
    }

    setSaving(true);

    try {
      // Save data into Firebase Firestore 'artworks' collection
      await addDoc(collection(db, "artworks"), {
        title,
        price: parseFloat(price),
        description,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Artwork added to catalog successfully! 🔥");
      // Reset Form
      setTitle("");
      setPrice("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving data to database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent mb-2">
          Creator Dashboard
        </h1>
        <p className="text-sm text-zinc-400 mb-6">Add a new premium masterpiece to your active catalog.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Artwork Image</label>
            <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Artwork Title</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200"
              placeholder="e.g., Whispering Canvas"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Price (LKR / USD)</label>
            <input 
              type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Description</label>
            <textarea 
              required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition text-zinc-200 resize-none"
              placeholder="Describe the depth and inspiration behind this piece..."
            />
          </div>

          <button 
            type="submit" disabled={saving}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-amber-500/10 active:scale-[0.99] disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            {saving ? "Saving Masterpiece..." : "Publish Artwork"}
          </button>
        </form>
      </div>
    </div>
  );
}