import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext"; 
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 antialiased" suppressHydrationWarning>
        {/* 1. ToastProvider එක හැමදේටම පිටින් තැබීම */}
        <ToastProvider> 
          {/* 2. CartProvider එක ඒක ඇතුළෙන් තැබීම */}
          <CartProvider> 
            <Navbar /> 
            {children}
            <Analytics />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}