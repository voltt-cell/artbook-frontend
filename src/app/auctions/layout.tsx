import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Auctions",
  description:
    "Bid on exclusive original artworks in live auctions. Don't miss out on unique pieces from talented artists.",
  openGraph: {
    title: "Live Auctions | ArtBook",
    description:
      "Bid on exclusive original artworks in live auctions on ArtBook.",
    images: ["/og-image.png"],
  },
  twitter: {
    title: "Live Auctions | ArtBook",
    description:
      "Bid on exclusive original artworks in live auctions on ArtBook.",
    images: ["/og-image.png"],
  },
};

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
