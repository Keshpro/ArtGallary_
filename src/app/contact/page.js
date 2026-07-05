"use client"; // <--- This must be the first line!

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("Message sent successfully!");
      e.target.reset();
    } else {
      setStatus("Failed to send message.");
    }
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#f4f4f5] py-20 px-6">
      <div className="max-w-3xl mx-auto border border-[#27272a] p-10 rounded-2xl bg-[#0b0b0d]">
        <h1 className="text-3xl font-bold mb-6 text-[#f59e0b]">Contact US</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" required placeholder="Your Name" className="w-full bg-[#18181b] border p-3 rounded-lg" />
          <input name="email" type="email" required placeholder="Your Email" className="w-full bg-[#18181b] border p-3 rounded-lg" />
          <textarea name="message" required placeholder="How can we help?" className="w-full bg-[#18181b] border p-3 rounded-lg h-32"></textarea>
          <button type="submit" className="bg-[#f59e0b] text-[#070708] font-bold px-6 py-3 rounded-lg">
            Send Message
          </button>
        </form>
        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </div>
  );
}