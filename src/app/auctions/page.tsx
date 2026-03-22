"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Gavel, Loader2 } from "lucide-react";
import AuctionCard from "@/features/auctions/auction-card";
import { fetcher } from "@/lib/swr";
import { fastStaggerContainer, fadeInUp } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";

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
    profileImage: string | null;
};



export default function AuctionsPage() {
    const { data: auctionItems, isLoading } = useSWR<AuctionItem[]>(
        "/auctions",
        fetcher,
        { refreshInterval: 5000 }
    );

    const { data: artistsRaw } = useSWR<ArtistResponse[]>(
        "/users?role=artist",
        fetcher
    );

    const artists = artistsRaw || [];
    const getArtist = (id: string) => artists.find((a) => a.id === id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gallery-cream pt-20 pb-32">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <Skeleton className="h-16 w-72 mx-auto mb-6 rounded-none bg-gallery-charcoal/5" />
                        <Skeleton className="h-5 w-96 max-w-full mx-auto rounded-none bg-gallery-charcoal/5" />
                    </div>
                    <Skeleton className="h-8 w-40 mb-8 rounded-none bg-gallery-charcoal/5" />
                    <Skeleton className="h-[400px] max-w-3xl mx-auto mb-16 rounded-none bg-gallery-charcoal/5" />
                    <Skeleton className="h-8 w-32 mb-8 rounded-none bg-gallery-charcoal/5" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-[320px] rounded-none bg-gallery-charcoal/5" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gallery-cream pt-20 pb-32">
            <div className="container mx-auto px-4">
            <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-16 text-center"
                >
                    <h1 className="font-serif text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-gallery-black">
                        Live <span className="italic font-light lowercase text-4xl md:text-6xl tracking-normal text-gallery-charcoal">Auctions</span>
                    </h1>
                    <p className="text-gallery-charcoal/70 text-lg max-w-2xl mx-auto font-medium">
                        Bid on exclusive artworks before time runs out.
                    </p>
                </motion.div>
                {!auctionItems || auctionItems.length === 0 ? (
                    <div className="text-center py-32 bg-white border border-gallery-charcoal/10 mix-blend-multiply">
                        <Gavel className="w-12 h-12 text-gallery-charcoal/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-black mb-3 uppercase tracking-wider text-gallery-black">
                            No Active Auctions
                        </h2>
                        <p className="text-gallery-charcoal/60 mb-8">
                            Check back later for exciting auction opportunities
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Featured Auction */}
                        {auctionItems.length > 0 && (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="mb-16"
                            >
                                <div className="flex items-center gap-4 mb-8 border-b border-gallery-charcoal/20 pb-4">
                                    <h2 className="font-serif text-2xl font-black uppercase tracking-widest text-gallery-black">Featured Lot</h2>
                                    <div className="bg-gallery-red text-white text-xs font-bold px-3 py-1 uppercase tracking-widest animate-pulse">Live Now</div>
                                </div>
                                <div className="max-w-3xl mx-auto">
                                    <AuctionCard
                                        item={auctionItems[0]}
                                        artist={getArtist(auctionItems[0].artwork.artistId)}
                                        isFeatured={true}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-center gap-4 mb-8 border-b border-gallery-charcoal/20 pb-4 mt-20">
                            <h2 className="font-serif text-2xl font-black uppercase tracking-widest text-gallery-black">All Lots</h2>
                        </div>

                        <motion.div
                            variants={fastStaggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "0px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        >
                            {auctionItems.slice(1).map((item) => (
                                <motion.div key={item.auction.id} variants={fadeInUp}>
                                    <AuctionCard
                                        item={item}
                                        artist={getArtist(item.artwork.artistId)}
                                        isFeatured={false}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
