import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artworks Collection",
  description:
    "Browse and buy original artworks from emerging and established artists. Filter by medium, price range, and more.",
  openGraph: {
    title: "Artworks Collection | ArtBook",
    description:
      "Browse and buy original artworks from emerging and established artists.",
    images: ["/og-image.png"],
  },
  twitter: {
    title: "Artworks Collection | ArtBook",
    description:
      "Browse and buy original artworks from emerging and established artists.",
    images: ["/og-image.png"],
  },
};

export default function ArtworksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
