"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Search, Palette } from "lucide-react";
import ArtworkCard from "@/features/home/artwork-card";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { ArtworkSkeletonGrid } from "@/components/artwork-skeleton";

type ArtworkResponse = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    status: string;
    listingType: string;
    createdAt: string;
};

type ArtistResponse = {
    id: string;
    name: string;
    bio: string | null;
    profileImage: string | null;
};

import { ART_CATEGORIES } from "@/lib/constants";

// ... (remove local constant definitions)

export default function ArtworksPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: artworksRaw, isLoading } = useSWR<ArtworkResponse[]>(
        "/artworks",
        fetcher,
        { refreshInterval: 15000 }
    );

    const { data: artistsRaw } = useSWR<ArtistResponse[]>(
        "/users?role=artist",
        fetcher
    );

    const artworks = (artworksRaw || []).map((item) => ({
        id: item.id,
        title: item.title,
        artistId: item.artistId,
        artist: "",
        image: item.images?.[0] || item.imageUrl,
        price: parseFloat(item.price),
        medium: item.medium,
        dimensions: "Variable",
        year: new Date(item.createdAt).getFullYear(),
        description: item.description,
        isAuction: item.listingType === "auction",
        currentBid: parseFloat(item.price),
        minimumBid: parseFloat(item.price),
    }));

    const artists = (artistsRaw || []).map((a) => ({
        id: a.id,
        name: a.name,
        bio: a.bio || "",
        profileImage: a.profileImage || "",
    }));

    const getArtistById = (id: string) => artists.find((a) => a.id === id);

    const filteredArtworks = artworks.filter((artwork) => {
        // Exclude auctions
        if (artwork.isAuction) return false;

        const matchesCategory =
            selectedCategory === "all" ||
            artwork.medium.toLowerCase().includes(selectedCategory);

        const matchesSearch =
            searchQuery === "" ||
            artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artwork.medium.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gallery-cream">
            {/* Header */}
            <section className="bg-gallery-cream text-gallery-black py-20 border-b border-gallery-charcoal/10 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="font-serif text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight"
                    >
                        Explore <span className="italic font-light lowercase text-4xl md:text-6xl tracking-normal text-gallery-charcoal">the</span> Gallery
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-gallery-charcoal/70 text-lg max-w-2xl font-medium"
                    >
                        Discover unique pieces from talented artists around the world.
                        Browse, bid, and buy original artworks.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="mt-12 max-w-xl w-full"
                    >
                        <div className="relative group">
                            <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gallery-charcoal/50 w-5 h-5 group-focus-within:text-gallery-red transition-colors" />
                            <input
                                type="text"
                                placeholder="Search artworks by title, medium, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-none bg-transparent border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 text-gallery-black placeholder-gallery-charcoal/40 focus:outline-none focus:ring-0 focus:border-gallery-red transition-all shadow-none"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center border-b border-gallery-charcoal/10 pb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-5 py-2 rounded-full whitespace-nowrap transition-all text-xs uppercase tracking-widest font-semibold ${selectedCategory === "all"
                                ? "bg-gallery-red text-white"
                                : "bg-transparent text-gallery-charcoal hover:bg-gallery-charcoal/5 border border-gallery-charcoal/20"
                                }`}
                        >
                            All
                        </button>
                        {ART_CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-5 py-2 rounded-full whitespace-nowrap transition-all text-xs uppercase tracking-widest font-semibold ${selectedCategory === category.id
                                    ? "bg-gallery-red text-white"
                                    : "bg-transparent text-gallery-charcoal hover:bg-gallery-charcoal/5 border border-gallery-charcoal/20"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-gallery-charcoal/60 mb-8 font-serif italic text-center text-lg">
                    {isLoading ? "" : `${filteredArtworks.length} ${filteredArtworks.length === 1 ? "artwork" : "artworks"} found`}
                </p>

                {/* Content */}
                {isLoading ? (
                    <ArtworkSkeletonGrid count={8} />
                ) : filteredArtworks.length === 0 ? (
                    <div className="text-center py-32 bg-white border border-gallery-charcoal/10 rounded-none mix-blend-multiply">
                        <Palette className="w-12 h-12 text-gallery-charcoal/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-black mb-3 uppercase tracking-wider text-gallery-black">
                            No artworks found
                        </h2>
                        <p className="text-gallery-charcoal/60 mb-8">
                            We couldn&apos;t find any artworks matching your current filters.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                            }}
                            className="bg-transparent hover:bg-gallery-charcoal text-gallery-black hover:text-white border border-gallery-charcoal px-8 py-3 rounded-none text-xs uppercase tracking-widest font-semibold transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    >
                        {filteredArtworks.map((artwork) => (
                            <motion.div key={artwork.id} variants={fadeInUp}>
                                <ArtworkCard
                                    artwork={artwork}
                                    artist={getArtistById(artwork.artistId) || { id: artwork.artistId, name: "Unknown Artist" }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
