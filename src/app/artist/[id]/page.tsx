"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ArrowLeft, Users, Palette, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArtworkCard from "@/features/home/artwork-card";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { ArtworkSkeletonGrid } from "@/components/artwork-skeleton";

interface Artist {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    role: string;
    profileImage: string | null;
    followerCount: number;
}

interface Artwork {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    tags: string[] | null;
    dimensions: string | null;
    status: string;
    listingType: string;
}

function ArtistProfileSkeleton() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-5xl">
                <Skeleton className="h-4 w-28 mb-12 rounded-none bg-gallery-charcoal/5" />
                <div className="bg-white rounded-none p-10 border border-gallery-charcoal/20 mb-16">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <Skeleton className="w-32 h-32 rounded-none flex-shrink-0 bg-gallery-charcoal/5" />
                        <div className="flex-1 space-y-4 text-center md:text-left mt-2 md:mt-0">
                            <Skeleton className="h-10 w-64 mx-auto md:mx-0 rounded-none bg-gallery-charcoal/5" />
                            <div className="flex gap-3 justify-center md:justify-start">
                                <Skeleton className="h-6 w-32 rounded-none bg-gallery-charcoal/5" />
                                <Skeleton className="h-6 w-24 rounded-none bg-gallery-charcoal/5" />
                            </div>
                            <Skeleton className="h-4 w-full max-w-lg mx-auto md:mx-0 rounded-none bg-gallery-charcoal/5" />
                            <Skeleton className="h-4 w-3/4 max-w-md mx-auto md:mx-0 rounded-none bg-gallery-charcoal/5" />
                            <div className="flex gap-4 justify-center md:justify-start mt-8">
                                <Skeleton className="h-16 w-24 rounded-none bg-gallery-charcoal/5" />
                                <Skeleton className="h-16 w-24 rounded-none bg-gallery-charcoal/5" />
                                <Skeleton className="h-12 w-48 rounded-none md:ml-auto mt-2 bg-gallery-charcoal/5" />
                            </div>
                        </div>
                    </div>
                </div>
                <Skeleton className="h-8 w-48 mb-8 mt-20 rounded-none bg-gallery-charcoal/5" />
                <ArtworkSkeletonGrid count={6} />
            </div>
        </div>
    );
}

export default function ArtistProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [followLoading, setFollowLoading] = useState(false);

    const { data: artist, isLoading: artistLoading } = useSWR<Artist>(
        `/users/${params.id}`,
        fetcher
    );

    const { data: artworks, isLoading: artworksLoading } = useSWR<Artwork[]>(
        `/artworks?artistId=${params.id}`,
        fetcher
    );

    const {
        data: followerData,
        mutate: mutateFollowers,
    } = useSWR<{ followerCount: number; isFollowing: boolean }>(
        user ? `/users/${params.id}/followers?currentUserId=${user.id}` : `/users/${params.id}/followers`,
        fetcher
    );

    const isFollowing = followerData?.isFollowing || false;
    const followerCount = followerData?.followerCount ?? artist?.followerCount ?? 0;
    const isOwnProfile = user?.id === params.id;

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await api.delete(`/users/${params.id}/follow`);
                toast.success("Unfollowed");
            } else {
                await api.post(`/users/${params.id}/follow`, {});
                toast.success("Following!");
            }
            mutateFollowers();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setFollowLoading(false);
        }
    };

    if (artistLoading) {
        return <ArtistProfileSkeleton />;
    }

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gallery-charcoal/70 uppercase tracking-widest font-bold text-sm">Artist not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-12">
                    <Link
                        href="/artists"
                        className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Artists
                    </Link>
                </div>

                {/* Artist Hero Banner & Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-white rounded-none border border-gallery-charcoal/20 mb-20 overflow-hidden"
                >
                    {/* Cover Banner */}
                    <div className="h-32 md:h-48 w-full bg-gallery-charcoal/5 relative overflow-hidden border-b border-gallery-charcoal/10">
                        <div className="absolute inset-0 bg-gallery-black/5 mix-blend-multiply"></div>
                    </div>

                    <div className="px-6 pb-12 md:px-12 relative">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 -mt-16 md:-mt-24">
                            {/* Profile Picture */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-32 h-32 md:w-48 md:h-48 rounded-none bg-white p-2 flex-shrink-0 shadow-none border border-gallery-charcoal/20 mx-auto md:mx-0 relative z-10"
                            >
                                <div className="w-full h-full rounded-none bg-gallery-cream flex items-center justify-center text-gallery-black text-5xl font-serif font-black overflow-hidden border border-gallery-charcoal/10">
                                    {artist.profileImage ? (
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.name}
                                            className="w-full h-full object-cover grayscale opacity-90"
                                        />
                                    ) : (
                                        artist.name.charAt(0)
                                    )}
                                </div>
                            </motion.div>

                            {/* Artist Info */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="flex-1 text-center md:text-left pt-2 md:pt-28 flex flex-col justify-center"
                            >
                                <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-black uppercase tracking-widest text-gallery-black">
                                    {artist.name}
                                </motion.h1>
                                <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                    <span className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-none border border-gallery-charcoal/20 text-[10px] tracking-widest uppercase font-bold text-gallery-charcoal">
                                        <Mail className="w-3.5 h-3.5 text-gallery-charcoal" />
                                        {artist.email}
                                    </span>
                                    <span className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-none border border-gallery-charcoal/20 text-[10px] tracking-widest uppercase font-bold text-gallery-charcoal">
                                        <Palette className="w-3.5 h-3.5 text-gallery-charcoal" />
                                        {artist.role}
                                    </span>
                                </motion.div>

                                {artist.bio && (
                                    <motion.p variants={fadeInUp} className="mt-8 text-gallery-charcoal/80 font-serif text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto md:mx-0">
                                        "{artist.bio}"
                                    </motion.p>
                                )}

                                {/* Stats & Actions Action */}
                                <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-10">
                                    <div className="bg-gallery-cream px-6 py-4 rounded-none border border-gallery-charcoal/20 text-center min-w-[120px]">
                                        <span className="block text-3xl font-black font-serif text-gallery-black mb-1">
                                            {followerCount}
                                        </span>
                                        <span className="text-[10px] font-bold text-gallery-charcoal/50 uppercase tracking-widest">Followers</span>
                                    </div>
                                    <div className="bg-gallery-cream px-6 py-4 rounded-none border border-gallery-charcoal/20 text-center min-w-[120px]">
                                        <span className="block text-3xl font-black font-serif text-gallery-black mb-1">
                                            {artworks?.length || 0}
                                        </span>
                                        <span className="text-[10px] font-bold text-gallery-charcoal/50 uppercase tracking-widest">Artworks</span>
                                    </div>

                                    {!isOwnProfile && (
                                        <div className="ml-0 md:ml-auto w-full md:w-auto mt-6 md:mt-0">
                                            <Button
                                                onClick={handleFollow}
                                                disabled={followLoading}
                                                size="lg"
                                                variant={isFollowing ? "outline" : "default"}
                                                className={
                                                    isFollowing
                                                        ? "w-full border-gallery-charcoal/20 text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red shadow-none rounded-none h-[82px] px-8 text-xs uppercase tracking-widest font-bold transition-all"
                                                        : "w-full bg-gallery-black hover:bg-gallery-red text-white shadow-none rounded-none h-[82px] px-8 text-xs uppercase tracking-widest font-bold transition-all"
                                                }
                                            >
                                                <Users className="w-4 h-4 mr-3" />
                                                {followLoading
                                                    ? "Wait..."
                                                    : isFollowing
                                                        ? "Unfollow"
                                                        : "Follow Artist"}
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>


                {/* Artworks Portfolio */}
                <div className="mb-12 border-b border-gallery-charcoal/20 pb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-serif font-black uppercase tracking-widest text-gallery-black">Portfolio</h2>
                        <p className="text-gallery-charcoal/60 text-sm mt-2 uppercase tracking-widest font-bold">Explore creations by {artist.name}</p>
                    </div>
                </div>

                {artworksLoading ? (
                    <ArtworkSkeletonGrid count={3} />
                ) : artworks && artworks.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {artworks.map((artwork: Artwork) => (
                            <motion.div
                                key={artwork.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
                                }}
                            >
                                <ArtworkCard
                                    artwork={{
                                        id: artwork.id,
                                        title: artwork.title,
                                        artist: artist.name,
                                        artistId: artwork.artistId,
                                        price: Number(artwork.price),
                                        image: artwork.images?.[0] || artwork.imageUrl,
                                        medium: artwork.medium,
                                        isAuction: artwork.listingType === "auction",
                                    }}
                                    artist={{
                                        id: artist.id,
                                        name: artist.name,
                                        profileImage: artist.profileImage || "",
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 bg-white border border-gallery-charcoal/20 shadow-none mix-blend-multiply"
                    >
                        <Palette className="w-12 h-12 text-gallery-charcoal/20 mb-6" />
                        <h3 className="text-2xl font-serif font-black text-gallery-black mb-3 uppercase tracking-wider">No Artworks Yet</h3>
                        <p className="text-gallery-charcoal/60 max-w-md text-center">
                            {artist.name} hasn&apos;t published any artworks yet. Check back later to see their creative portfolio.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
