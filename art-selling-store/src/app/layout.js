import { Geist, Geist_Mono ,Inter} from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Premium Art Store",
  description: "Next-Level Art Selling Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* 2. CHILDREN (PAGES) වලට උඩින් NAVBAR එක දාන්න */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}