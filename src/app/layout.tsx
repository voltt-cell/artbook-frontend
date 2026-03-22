import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/common/nabvar";
import Footer from "@/features/common/footer";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import OfflineGuard from "@/components/offline-guard";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fontPlayfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtBook — The Digital Gallery",
  description: "A modern digital gallery for artists and collectors. Discover, buy, and auction original artwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontOutfit.variable} ${fontPlayfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <OfflineGuard />
        </Providers>
      </body>
    </html>
  );
}
