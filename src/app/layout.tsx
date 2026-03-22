import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/common/nabvar";
import Footer from "@/features/common/footer";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import OfflineGuard from "@/components/offline-guard";
import PageTransitionLoader from "@/components/page-transition-loader";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fontPlayfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArtBook — The Digital Gallery",
    template: "%s | ArtBook",
  },
  description:
    "Discover, buy, and auction original artwork from emerging and established artists. ArtBook is the modern digital gallery for collectors and creators.",
  keywords: [
    "art",
    "gallery",
    "artwork",
    "buy art",
    "sell art",
    "auction",
    "digital gallery",
    "artists",
    "collectors",
    "original artwork",
  ],
  authors: [{ name: "ArtBook" }],
  creator: "ArtBook",
  metadataBase: new URL("https://artbook.gallery"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ArtBook",
    title: "ArtBook — The Digital Gallery",
    description:
      "Discover, buy, and auction original artwork from emerging and established artists.",
    images: [
      {
        url: "/images/gallery_about.jpg",
        width: 1200,
        height: 630,
        alt: "ArtBook — The Digital Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtBook — The Digital Gallery",
    description:
      "Discover, buy, and auction original artwork from emerging and established artists.",
    images: ["/images/gallery_about.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
          <PageTransitionLoader />
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
