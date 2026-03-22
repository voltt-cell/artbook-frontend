"use client";

import { useState, useRef, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/lib/swr";
import { motion, useInView } from "framer-motion";
import { fadeInUp, fastStaggerContainer } from "@/lib/animations";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import ArtistCard from "@/features/home/artist-card";
import { ArtistSkeletonGrid } from "@/components/artist-skeleton";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

interface Artist {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    profileImage: string | null;
    followerCount: number;
}

export default function ArtistsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getKey = (pageIndex: number, previousPageData: Artist[] | null) => {
        if (previousPageData && !previousPageData.length) return null; // reached the end

        const params = new URLSearchParams({
            role: "artist",
            page: (pageIndex + 1).toString(),
            limit: "12",
        });

        if (debouncedSearch) params.append("search", debouncedSearch);

        return `/users?${params.toString()}`;
    };

    const { data, size, setSize, isLoading } = useSWRInfinite<Artist[]>(
        getKey,
        fetcher,
        { revalidateFirstPage: false }
    );

    const artistsRaw = data ? data.flat() : [];
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

    return (
        <div className="min-h-screen bg-gallery-cream">
            <div className="container mx-auto px-4 py-20 max-w-6xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-12 text-center"
                >
                    <h1 className="font-sans text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-gallery-black">
                        Featured <span className="font-light lowercase text-4xl md:text-6xl tracking-normal text-gallery-charcoal">Artists</span>
                    </h1>
                    <p className="text-gallery-charcoal/70 text-lg max-w-2xl mx-auto font-medium">
                        Explore the curated portfolio of our celebrated talents.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-16 max-w-xl mx-auto"
                >
                    <div className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gallery-charcoal/50 w-5 h-5 group-focus-within:text-gallery-red transition-colors" />
                        <Input
                            placeholder="Search artists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 rounded-none bg-transparent border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 text-gallery-black placeholder-gallery-charcoal/40 focus:outline-none focus:ring-0 focus:border-gallery-red transition-all shadow-none"
                        />
                    </div>
                </motion.div>

                {isEmpty && !isLoading ? (
                    <div className="text-center py-32 bg-white border border-gallery-charcoal/10 mix-blend-multiply">
                        <Users className="w-12 h-12 text-gallery-charcoal/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-sans font-black mb-3 uppercase tracking-wider text-gallery-black">
                            No artists found
                        </h2>
                        <p className="text-gallery-charcoal/60 mb-8">
                            We couldn&apos;t find any artists matching your search.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fastStaggerContainer}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        >
                            {artistsRaw.map((artist, idx) => (
                                <motion.div key={`${artist.id}-${idx}`} variants={fadeInUp}>
                                    <ArtistCard artist={{
                                        id: artist.id,
                                        name: artist.name,
                                        profileImage: artist.profileImage,
                                        followers: artist.followerCount,
                                        shopName: undefined
                                    }} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {isLoading && artistsRaw.length === 0 && (
                            <div className="mt-8">
                                <ArtistSkeletonGrid count={10} />
                            </div>
                        )}

                        <div ref={loaderRef} className="w-full flex justify-center py-12">
                            {isLoadingMore && artistsRaw.length > 0 && (
                                <div className="scale-75 origin-center opacity-80">
                                    <ArtisticLoader fullScreen={false} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
