"use client";

import { useState, useRef, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { motion, useInView } from "framer-motion";
import { Search, Palette, FilterX } from "lucide-react";
import ArtworkCard from "@/features/home/artwork-card";
import { fetcher } from "@/lib/swr";
import { fastStaggerContainer, fadeInUp } from "@/lib/animations";
import { ArtworkSkeletonGrid } from "@/components/artwork-skeleton";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { ART_CATEGORIES } from "@/lib/constants";

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
    dimensions?: string | null;
};

type ArtistResponse = {
    id: string;
    name: string;
    bio: string | null;
    profileImage: string | null;
};

export default function ArtworksPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Debounce for search and price filters
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setDebouncedMinPrice(minPrice);
            setDebouncedMaxPrice(maxPrice);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, minPrice, maxPrice]);

    const { data: artistsRaw } = useSWR<ArtistResponse[]>(
        "/users?role=artist",
        fetcher
    );

    const artists = (artistsRaw || []).map((a) => ({
        id: a.id,
        name: a.name,
        bio: a.bio || "",
        profileImage: a.profileImage || "",
    }));

    const getArtistById = (id: string) => artists.find((a) => a.id === id);

    const getKey = (pageIndex: number, previousPageData: ArtworkResponse[] | null) => {
        if (previousPageData && !previousPageData.length) return null; // reached the end

        const params = new URLSearchParams({
            page: (pageIndex + 1).toString(),
            limit: "12",
        });

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (selectedCategory !== "all") params.append("medium", selectedCategory);
        if (debouncedMinPrice) params.append("minPrice", debouncedMinPrice);
        if (debouncedMaxPrice) params.append("maxPrice", debouncedMaxPrice);

        return `/artworks?${params.toString()}`;
    };

    const { data, size, setSize, isLoading } = useSWRInfinite<ArtworkResponse[]>(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
        }
    );

    const artworksRaw = data ? data.flat() : [];
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 12);

    const loaderRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(loaderRef, { margin: "200px" });

    useEffect(() => {
        if (isInView && !isReachingEnd && !isLoadingMore) {
            setSize(size + 1);
        }
    }, [isInView, isReachingEnd, isLoadingMore, setSize, size]);

    const artworks = artworksRaw.filter(item => item.listingType !== "auction").map((item) => ({
        id: item.id,
        title: item.title,
        artistId: item.artistId,
        artist: "",
        image: item.images?.[0] || item.imageUrl,
        price: parseFloat(item.price),
        medium: item.medium,
        dimensions: item.dimensions || "Variable",
        year: new Date(item.createdAt).getFullYear(),
        description: item.description,
        isAuction: item.listingType === "auction",
        currentBid: parseFloat(item.price),
        minimumBid: parseFloat(item.price),
    }));

    const clearFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setMinPrice("");
        setMaxPrice("");
        setDebouncedSearch("");
        setDebouncedMinPrice("");
        setDebouncedMaxPrice("");
        setSize(1);
    };

    return (
        <div className="min-h-screen bg-gallery-cream">
            {/* Main Content Start */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 flex flex-col gap-10">
                        {/* Search */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-gallery-charcoal/10 pb-3 text-gallery-black">Search</h3>
                            <div className="relative group">
                                <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gallery-charcoal/40 w-4 h-4 group-focus-within:text-gallery-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-gallery-charcoal/20 text-gallery-black placeholder-gallery-charcoal/40 focus:outline-none focus:border-gallery-red transition-all text-sm rounded-none"
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-gallery-charcoal/10 pb-3 text-gallery-black">Price ($)</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-transparent border border-gallery-charcoal/20 focus:border-gallery-red focus:outline-none text-sm transition-colors rounded-none placeholder-gallery-charcoal/40"
                                />
                                <span className="text-gallery-charcoal/30">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-transparent border border-gallery-charcoal/20 focus:border-gallery-red focus:outline-none text-sm transition-colors rounded-none placeholder-gallery-charcoal/40"
                                />
                            </div>
                        </div>

                        {/* Mediums */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-gallery-charcoal/10 pb-3 text-gallery-black">Medium</h3>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`text-left text-sm transition-all duration-300 ${selectedCategory === "all" ? "text-gallery-red font-bold pl-2 border-l-2 border-gallery-red" : "text-gallery-charcoal hover:text-gallery-black hover:pl-1 border-l-2 border-transparent"}`}
                                >
                                    All Mediums
                                </button>
                                {ART_CATEGORIES.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCategory(c.id)}
                                        className={`text-left text-sm transition-all duration-300 ${selectedCategory === c.id ? "text-gallery-red font-bold pl-2 border-l-2 border-gallery-red" : "text-gallery-charcoal hover:text-gallery-black hover:pl-1 border-l-2 border-transparent"}`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || minPrice || maxPrice || selectedCategory !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-2 py-3 border border-gallery-charcoal/20 text-xs font-bold uppercase tracking-widest text-gallery-charcoal hover:bg-gallery-charcoal hover:text-white transition-colors"
                            >
                                <FilterX className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </aside>

                    {/* Main Content Area */}
                    <div className="w-full lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold tracking-tight text-gallery-black">Artworks collection</h2>
                        </div>

                        {isEmpty && !isLoading ? (
                            <div className="text-center py-24 bg-white/50 border border-gallery-charcoal/10 mix-blend-multiply">
                                <Palette className="w-12 h-12 text-gallery-charcoal/20 mx-auto mb-4" />
                                <h2 className="text-xl font-black mb-2 uppercase tracking-wide text-gallery-black">
                                    No artworks found
                                </h2>
                                <p className="text-gallery-charcoal/60 text-sm">
                                    Adjust your filters to discover more pieces.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <motion.div
                                    variants={fastStaggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {artworks.map((artwork, idx) => (
                                        <motion.div key={`${artwork.id}-${idx}`} variants={fadeInUp}>
                                            <ArtworkCard
                                                artwork={artwork}
                                                artist={getArtistById(artwork.artistId) || { id: artwork.artistId, name: "Unknown Artist" }}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Loading Skeletons for initial load */}
                                {isLoading && artworks.length === 0 && (
                                    <div className="mt-8">
                                        <ArtworkSkeletonGrid count={8} />
                                    </div>
                                )}

                                {/* Virtual Loader for Infinite Scroll */}
                                <div ref={loaderRef} className="w-full flex justify-center py-12">
                                    {isLoadingMore && artworks.length > 0 && (
                                        <div className="scale-75 origin-center opacity-80">
                                            <ArtisticLoader fullScreen={false} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
