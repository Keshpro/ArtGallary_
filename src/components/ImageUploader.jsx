"use client";
import { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle2, RotateCcw } from "lucide-react";

export default function ImageUploader({ onUploadSuccess, existingImage }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 🔥 Edit කරද්දී ඩේටාබේස් එකේ දැනට තියෙන පින්තූරය ස්වයංක්‍රීයව Preview එකට ගැනීම
  useEffect(() => {
    if (existingImage) {
      setPreview(existingImage);
      setIsSuccess(true);
    } else {
      setPreview("");
      setIsSuccess(false);
    }
  }, [existingImage]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setIsSuccess(false);

    const apiKey = "7dc0be16402b01ab2800a3eeb080c14a";

    if (!apiKey || apiKey === "undefined") {
      console.error("ImgBB API Key is missing!");
      alert("Configuration Error: API Key not found.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onUploadSuccess(data.data.url);
        setIsSuccess(true);
      } else {
        alert(`ImgBB Upload Failed: ${data.error?.message || "Unknown Error"}`);
        setPreview("");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong during image sync.");
      setPreview("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/20 backdrop-blur-md rounded-2xl p-5 transition-all duration-300 hover:border-amber-500/30 relative overflow-hidden">
      
      {preview ? (
        <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900">
          <img 
            src={preview} 
            alt="Artwork live preview" 
            className="object-cover w-full h-full opacity-80" 
          />
          
          {/* LOADER OVERLAY */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Hosting Image...</span>
            </div>
          )}

          {/* SUCCESS / STANDBY OVERLAY */}
          {isSuccess && !loading && (
            <div className="absolute top-3 right-3 z-20">
              <label className="flex items-center gap-1 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-400 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-lg cursor-pointer transition">
                <RotateCcw className="w-3 h-3" /> Change
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
              </label>
            </div>
          )}

          {isSuccess && !loading && (
            <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-900 flex items-center gap-1.5 text-emerald-400 text-[9px] uppercase font-bold tracking-widest">
              <CheckCircle2 className="w-3 h-3" /> Cloud Storage Synced
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer py-10 w-full group">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-500 group-hover:text-amber-500 group-hover:border-amber-500/30 transition duration-300 mb-3 shadow-inner">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider group-hover:text-zinc-200 transition">
            Upload Masterpiece Canvas
          </span>
          <span className="text-[10px] text-zinc-600 mt-1">PNG, JPG or WEBP up to 10MB</span>
          
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
        </label>
      )}
    </div>
  );
}