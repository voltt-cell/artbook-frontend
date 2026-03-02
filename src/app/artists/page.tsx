"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import ArtistCard from "@/features/home/artist-card";
import { ArtistSkeletonGrid } from "@/components/artist-skeleton";

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
    const { data: artists, isLoading } = useSWR<Artist[]>(
        "/users?role=artist",
        fetcher
    );

    const filteredArtists = artists?.filter(
        (artist) =>
            artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gallery-cream">
            <div className="container mx-auto px-4 py-20 max-w-6xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-12 text-center"
                >
                    <h1 className="font-serif text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-gallery-black">
                        Featured <span className="italic font-light lowercase text-4xl md:text-6xl tracking-normal text-gallery-charcoal">Artists</span>
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

                {isLoading ? (
                    <ArtistSkeletonGrid count={6} />
                ) : filteredArtists && filteredArtists.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredArtists.map((artist) => (
                            <motion.div key={artist.id} variants={fadeInUp}>
                                <ArtistCard artist={{
                                    id: artist.id,
                                    name: artist.name,
                                    profileImage: artist.profileImage,
                                    followers: artist.followerCount,
                                    shopName: undefined // We don't fetch shopName in this particular SWR hook right now or need to add it to Artist type
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-32 bg-white border border-gallery-charcoal/10 mix-blend-multiply">
                        <Users className="w-12 h-12 text-gallery-charcoal/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-black mb-3 uppercase tracking-wider text-gallery-black">
                            No artists found
                        </h2>
                        <p className="text-gallery-charcoal/60 mb-8">
                            We couldn&apos;t find any artists matching your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
