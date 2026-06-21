import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext"; // 🔥 Global Cart Context Layer එක

export const metadata = {
  title: "Aggrani Portfolio",
  description: "Premium Minimalist Art Gallery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 antialiased" suppressHydrationWarning>
        {/* මුළු ඇප් එකටම Cart එක වැඩ කරන්න Context එකෙන් Wrap කර ඇත */}
        <CartProvider>
          {/* සියලුම පිටුවලට පොදුවේ ඉහළින්ම Navbar එක පෙන්වයි */}
          <Navbar /> 
          
          {children}
        </CartProvider>
      </body>
    </html>
  );
}