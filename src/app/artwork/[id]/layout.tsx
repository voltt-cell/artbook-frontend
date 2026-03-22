import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type ArtworkMeta = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[] | null;
  medium: string;
  price: string;
  artistId: string;
};

type ArtistMeta = {
  id: string;
  name: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const [artworkRes, artistRes] = await Promise.allSettled([
      fetch(`${API_URL}/artworks/${id}`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/artworks/${id}`, { next: { revalidate: 60 } }).then(
        async (r) => {
          const artwork: ArtworkMeta = await r.json();
          return fetch(`${API_URL}/users/${artwork.artistId}`, {
            next: { revalidate: 60 },
          });
        }
      ),
    ]);

    const artwork: ArtworkMeta | null =
      artworkRes.status === "fulfilled" && artworkRes.value.ok
        ? await artworkRes.value.json()
        : null;

    const artist: ArtistMeta | null =
      artistRes.status === "fulfilled" && artistRes.value.ok
        ? await artistRes.value.json()
        : null;

    if (!artwork) {
      return { title: "Artwork Not Found" };
    }

    const image = artwork.images?.[0] || artwork.imageUrl;
    const title = `${artwork.title}${artist ? ` by ${artist.name}` : ""}`;
    const description = artwork.description?.slice(0, 160) || `${artwork.title} — ${artwork.medium}. View details and purchase on ArtBook.`;

    return {
      title: artwork.title,
      description,
      openGraph: {
        title: `${title} | ArtBook`,
        description,
        images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : ["/icon.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ArtBook`,
        description,
        images: image ? [image] : ["/icon.svg"],
      },
    };
  } catch {
    return {
      title: "Artwork",
      description: "View artwork details on ArtBook.",
    };
  }
}

export default function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
