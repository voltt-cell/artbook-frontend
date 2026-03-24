"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/ui/optimized-image";

type AuctionItem = {
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        status: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        images: string[] | null;
        artistId: string;
        price: string;
        medium: string;
        description: string;
    };
};

type ArtistResponse = {
    id: string;
    name: string;
    shopName?: string;
    profileImage: string | null;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(price);

function useCountdown(endTime: string) {
    const [timeLeft, setTimeLeft] = useState<{
        d: number;
        h: number;
        m: number;
        s: number;
        expired: boolean;
    }>({ d: 0, h: 0, m: 0, s: 0, expired: false });

    useEffect(() => {
        const update = () => {
            const diff = new Date(endTime).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true });
                return;
            }
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
                expired: false,
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return timeLeft;
}

export default function AuctionCard({
    item,
    artist,
    isFeatured = false,
}: {
    item: AuctionItem;
    artist?: ArtistResponse;
    isFeatured?: boolean;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { auction, artwork } = item;
    const timer = useCountdown(auction.endTime);
    const currentBid = parseFloat(auction.currentBid || auction.startingBid);
    const imageUrl = artwork.images?.[0] || artwork.imageUrl;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className={`group relative bg-gallery-cream border ${isFeatured ? 'border-gallery-charcoal' : 'border-gallery-charcoal/20'} transition-all duration-300`}
        >
            <Link href={`/artwork/${artwork.id}`}>
                <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/9]' : 'aspect-square'}`}>
                    <OptimizedImage
                        src={imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        containerClassName="w-full h-full"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className={`
                            px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2
                            ${timer.expired
                                ? "bg-gallery-charcoal text-white"
                                : "bg-gallery-red text-white"}
                        `}>
                            {timer.expired ? (
                                <span>Ended</span>
                            ) : (
                                <>
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                    </span>
                                    Live
                                </>
                            )}
                        </div>
                    </div>

                    {/* Timer Overlay */}
                    {!timer.expired && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-gallery-cream border border-gallery-charcoal p-3 text-gallery-black flex items-center justify-between shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gallery-charcoal uppercase tracking-widest font-bold mb-1">Ending In</span>
                                    <div className="flex gap-1 font-mono text-sm leading-none font-semibold">
                                        {timer.d > 0 && <span>{timer.d}d</span>}
                                        <span>{String(timer.h).padStart(2, "0")}h</span>
                                        <span>:</span>
                                        <span>{String(timer.m).padStart(2, "0")}m</span>
                                        <span>:</span>
                                        <span>{String(timer.s).padStart(2, "0")}s</span>
                                    </div>
                                </div>
                                <Clock className="w-5 h-5 text-gallery-red" />
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            <div className={`p-4 ${isFeatured ? 'md:p-6' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                    <Link href={`/artwork/${artwork.id}`} className="flex-1 mr-2">
                        <h3 className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-sans font-black text-gallery-black hover:text-gallery-red transition-colors line-clamp-1 truncate`}>
                            {artwork.title}
                        </h3>
                    </Link>
                </div>

                {artist && (
                    <Link href={`/artist/${artist.id}`} className="text-xs uppercase tracking-widest font-semibold text-gallery-charcoal/70 hover:text-gallery-red hover:underline mb-4 block truncate">
                        {artist.shopName || artist.name}
                    </Link>
                )}

                <div className={`flex items-end justify-between border-t border-gallery-charcoal/20 pt-4 mt-auto ${isFeatured ? 'mt-4' : ''}`}>
                    <div>
                        <p className="text-[10px] text-gallery-charcoal uppercase tracking-widest font-bold mb-1">Current Bid</p>
                        <p className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-sans font-black text-gallery-black leading-none`}>
                            {formatPrice(currentBid)}
                        </p>
                    </div>

                    {!timer.expired && (
                        <Button
                            size={isFeatured ? "lg" : "sm"}
                            className="bg-gallery-black hover:bg-gallery-charcoal text-white text-[10px] uppercase tracking-widest font-semibold px-6 rounded-none"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast.error("Please log in to place a bid");
                                    router.push("/login");
                                    return;
                                }
                                router.push(`/artwork/${artwork.id}`);
                            }}
                        >
                            Place Bid
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
