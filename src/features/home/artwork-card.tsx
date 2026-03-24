"use client";

import { useState } from "react";
import { ImageOff, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ArtworkCardProps {
  artwork: {
    id: string | number;
    title: string;
    artist: string;
    artistId: string;
    price: number;
    image: string;
    medium: string;
    isAuction: boolean;
    auctionEndDate?: Date;
    currentBid?: number;
    minimumBid?: number;
  };
  artist: {
    id: string | number;
    name: string;
    shopName?: string;
    profileImage?: string;
  };
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const ArtworkCard = ({ artwork, artist }: ArtworkCardProps) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { isFavorite, toggleFavorite, togglingId } = useFavorites();
  const isOwner = user?.id === artwork.artistId;
  const [imgError, setImgError] = useState(false);

  const isFav = isFavorite(String(artwork.id));
  const isToggling = togglingId === String(artwork.id);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to purchase artwork");
      router.push("/login");
      return;
    }

    try {
      const res = await api.post<{ sessionUrl: string }>("/payments/checkout", {
        artworkId: artwork.id,
      });
      window.location.href = res.sessionUrl;
    } catch (error) {
      toast.error("Purchase failed", {
        description: (error as Error).message,
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to add favorites");
      router.push("/login");
      return;
    }
    toggleFavorite(
      String(artwork.id),
      {
        id: String(artwork.id),
        title: artwork.title,
        imageUrl: artwork.image,
        artistId: artwork.artistId,
        price: String(artwork.price),
        status: 'published', // Default as cards are usually visible/published
        medium: artwork.medium,
        listingType: artwork.isAuction ? 'auction' : 'fixed',
      },
      {
        id: String(artist.id),
        name: artist.name,
        profileImage: artist.profileImage || null,
      }
    );
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden aspect-square border border-transparent bg-gallery-cream">
        <Link href={`/artwork/${artwork.id}`} className="block w-full h-full">
          {artwork.image && !imgError ? (
            <OptimizedImage
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              containerClassName="w-full h-full"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gallery-beige">
              <ImageOff className="w-8 h-8 text-gallery-charcoal/20 mb-2" />
              <span className="text-xs text-gallery-charcoal/40 uppercase tracking-widest font-semibold">No Image</span>
            </div>
          )}

          {/* Overlay Gradient on Hover */}
          <div className="absolute inset-0 bg-gallery-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Top Right: Favorite Button (Visible on Hover) */}
        {!isOwner && (
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${isFav
              ? "bg-white text-gallery-red shadow-sm opacity-100"
              : "bg-white/90 text-gallery-charcoal hover:bg-white hover:text-gallery-red opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Bottom Actions (Visible on Hover) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {!isOwner && (
            artwork.isAuction ? (
              <Button
                className="w-full bg-gallery-black text-white hover:bg-gallery-charcoal font-semibold text-xs tracking-widest uppercase rounded-none h-12"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isAuthenticated) return router.push("/login");
                  router.push(`/artwork/${artwork.id}`);
                }}
              >
                Place Bid
              </Button>
            ) : (
              <Button
                className="w-full bg-gallery-black text-white hover:bg-gallery-charcoal font-semibold text-xs tracking-widest uppercase rounded-none h-12"
                onClick={(e) => {
                  e.preventDefault();
                  handleBuyNow();
                }}
              >
                Add to Cart
              </Button>
            )
          )}
        </div>
      </div>

      <div className="pt-4 pb-2">
        <div className="flex justify-between items-start gap-4 mb-1">
          <div className="flex-1">
            <Link href={`/artwork/${artwork.id}`}>
              <h3 className="font-sans text-lg font-bold text-gallery-black group-hover:text-gallery-red transition-colors line-clamp-1">
                {artwork.title}
              </h3>
            </Link>
            {artist && (
              <Link href={`/artist/${artist.id}`} className="block mt-1 text-xs uppercase tracking-widest font-semibold text-gallery-charcoal hover:text-gallery-red hover:underline truncate">
                {artist.shopName || artist.name}
              </Link>
            )}
          </div>
          <div className="text-base font-medium text-gallery-black pt-0.5">
            {formatPrice(artwork.isAuction ? (artwork.currentBid || artwork.price) : artwork.price)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
