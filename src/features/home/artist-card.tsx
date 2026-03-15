import Link from "next/link";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    shopName?: string | null;
    location?: string;
    followers?: number;
    profileImage: string | null;
  };
}

const ArtistCard = ({ artist }: ArtistCardProps) => {

  return (
    <div className="bg-transparent p-3 flex flex-col items-center group cursor-pointer w-full max-w-[200px] mx-auto">
      <div className="flex flex-col items-center w-full">
        <Link href={`/artist/${artist.id}`} className="mb-4 relative">
          <div className="absolute inset-0 rounded-full border border-gallery-charcoal/20 scale-[1.05] group-hover:scale-[1.1] transition-transform duration-500"></div>
          <img
            src={artist.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
            alt={artist.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-md filter group-hover:brightness-110 transition-all duration-500"
          />
        </Link>

        <div className="text-center mt-2 w-full">
          <Link href={`/artist/${artist.id}`}>
            <h3 className="font-sans text-lg font-bold text-gallery-black group-hover:text-gallery-red transition-colors truncate w-full px-2" title={artist.shopName || artist.name}>{artist.shopName || artist.name}</h3>
          </Link>
          <p className="text-[10px] text-gallery-charcoal/60 uppercase tracking-widest font-semibold mt-1">
            {(artist.followers || 0).toLocaleString()} Followers
          </p>

          <Link
            href={`/artist/${artist.id}`}
            className="mt-3 inline-block text-[10px] text-gallery-black border border-gallery-charcoal px-4 py-1.5 uppercase tracking-widest font-bold hover:bg-gallery-charcoal hover:text-white transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
