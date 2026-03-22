import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Artists",
  description:
    "Explore the curated portfolio of celebrated artists on ArtBook. Follow your favorites and discover new talent.",
  openGraph: {
    title: "Featured Artists | ArtBook",
    description:
      "Explore the curated portfolio of celebrated artists on ArtBook.",
    images: ["/icon.svg"],
  },
  twitter: {
    title: "Featured Artists | ArtBook",
    description:
      "Explore the curated portfolio of celebrated artists on ArtBook.",
    images: ["/icon.svg"],
  },
};

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
