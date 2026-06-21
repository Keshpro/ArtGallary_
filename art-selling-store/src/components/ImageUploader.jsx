"use client";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUploader({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview instantly
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    // Prepare Form Data for ImgBB API
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        // Pass the hosted image URL back to the parent form
        onUploadSuccess(data.data.url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 bg-zinc-900/50 rounded-xl p-6 transition hover:border-amber-500/50">
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
          <img src={preview} alt="Artwork preview" className="object-cover w-full h-full" />
          {loading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer py-6 w-full">
          <Upload className="w-10 h-10 text-zinc-500 mb-2" />
          <span className="text-sm text-zinc-400 font-medium">Click to upload Artwork Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
        </label>
      )}
    </div>
  );
}