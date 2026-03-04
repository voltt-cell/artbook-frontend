"use client";

import { useFavorites } from "@/hooks/useFavorites";
import ArtworkCard from "@/features/home/artwork-card";
import { motion } from "framer-motion";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoritesPage() {
    const { favorites, isLoading } = useFavorites();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <Loader2 className="w-8 h-8 animate-spin text-gallery-red" />
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32 flex flex-col items-center justify-center px-4">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-2xl w-full flex flex-col items-center justify-center shadow-none">
                    <div className="w-20 h-20 border border-gallery-charcoal/20 flex items-center justify-center mb-8 bg-gallery-cream">
                        <Heart className="w-8 h-8 text-gallery-charcoal/30" />
                    </div>
                    <h2 className="text-3xl font-serif font-black mb-4 text-gallery-black uppercase tracking-widest">
                        Empty Collection
                    </h2>
                    <p className="text-gallery-charcoal/70 mb-10 max-w-md mx-auto font-serif italic text-lg leading-relaxed">
                        Start exploring and save the masterpieces that inspire you. Your curated collection will appear here.
                    </p>
                    <Link href="/artworks" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-gallery-black hover:bg-gallery-red text-white rounded-none px-10 h-14 font-bold uppercase tracking-widest text-xs transition-colors">
                            Explore Gallery
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pb-24">
            <div className="bg-white border-b border-gallery-charcoal/20 pt-16 pb-12 mb-16 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <Link href="/artworks" className="text-gallery-charcoal/50 hover:text-gallery-red transition-colors flex items-center gap-2 group">
                                    <div className="w-8 h-8 border border-gallery-charcoal/20 flex items-center justify-center group-hover:border-gallery-red">
                                        <ArrowLeft className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
                                </Link>
                            </div>
                            <h1 className="font-serif text-5xl md:text-6xl font-black uppercase tracking-widest text-gallery-black flex items-center gap-4">
                                Curated <span className="text-gallery-red font-serif italic lowercase font-normal leading-none transform translate-y-1">collection</span>
                            </h1>
                        </div>
                        <div className="flex flex-col items-start md:items-end border-l-4 border-gallery-red pl-4 md:pl-0 md:border-l-0 md:border-r-4 md:pr-4">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mb-1">
                                Saved Masterpieces
                            </p>
                            <p className="font-serif text-3xl font-black text-gallery-black">
                                {favorites.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-12 w-32 h-32 border-r border-b border-gallery-charcoal/10 opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-px h-12 bg-gallery-charcoal/10" />
            </div>

            <div className="max-w-full 2xl:max-w-[1600px] mx-auto px-6 lg:px-12">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {favorites.map((fav) => (
                        <motion.div key={fav.favoriteId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <ArtworkCard
                                artwork={{
                                    id: fav.artwork.id,
                                    title: fav.artwork.title,
                                    artist: fav.artist.name,
                                    artistId: fav.artwork.artistId,
                                    price: parseFloat(fav.artwork.price),
                                    image: fav.artwork.imageUrl,
                                    medium: fav.artwork.medium,
                                    isAuction: fav.artwork.listingType === 'auction',
                                }}
                                artist={{
                                    id: fav.artist.id,
                                    name: fav.artist.name,
                                    profileImage: fav.artist.profileImage || undefined,
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
