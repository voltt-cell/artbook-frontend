import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type ArtistMeta = {
  id: string;
  name: string;
  bio: string | null;
  profileImage: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { title: "Artist Not Found" };
    }

    const artist: ArtistMeta = await res.json();
    const description =
      artist.bio?.slice(0, 160) ||
      `View ${artist.name}'s portfolio and artworks on ArtBook — The Digital Gallery.`;

    return {
      title: artist.name,
      description,
      openGraph: {
        title: `${artist.name} | ArtBook`,
        description,
        images: artist.profileImage
          ? [{ url: artist.profileImage, width: 600, height: 600, alt: artist.name }]
          : ["/icon.svg"],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${artist.name} | ArtBook`,
        description,
        images: artist.profileImage ? [artist.profileImage] : ["/icon.svg"],
      },
    };
  } catch {
    return {
      title: "Artist",
      description: "View artist profile on ArtBook.",
    };
  }
}

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
