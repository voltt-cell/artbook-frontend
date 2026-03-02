"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { motion } from "framer-motion";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { Package, Gavel, DollarSign, Image as ImageIcon, Plus, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ArtworkResponse = {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    images: string[] | null;
    status: string;
    listingType: string;
    createdAt: string;
};


const formatCurrency = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

export default function ShopDashboard() {
    const { user, hasShop, loading: authLoading } = useAuth();
    const router = useRouter();

    const { data: artworksRaw, isLoading: artworksLoading } = useSWR<ArtworkResponse[]>(
        user ? `/artworks?artistId=${user.id}` : null,
        fetcher
    );

    const artworks = artworksRaw || [];
    const totalRevenue = artworks
        .filter((a) => a.status === "sold")
        .reduce((sum, a) => sum + parseFloat(a.price || "0"), 0);
    const activeListings = artworks.filter((a) => a.status === "published").length;
    const auctionListings = artworks.filter((a) => a.listingType === "auction").length;

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gallery-cream">


            <div className="container mx-auto py-12 px-4 max-w-7xl relative z-10">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10 border-b border-gallery-charcoal/20 pb-6">
                        <div>
                            <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">
                                {user?.shopName || "My Shop"}
                            </h1>
                            <p className="text-gallery-charcoal/70 mt-2 font-serif italic text-lg tracking-wide">Manage your artworks, orders, and shop settings</p>
                        </div>
                        <Link href="/artist/create">
                            <Button className="bg-gallery-black hover:bg-gallery-red text-white rounded-none h-12 px-8 uppercase tracking-widest text-xs font-bold transition-all">
                                <Plus className="mr-2 h-4 w-4" /> New Artwork
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: "Total Artworks", value: artworks.length, icon: ImageIcon, color: "text-gallery-charcoal" },
                            { label: "Active Listings", value: activeListings, icon: Package, color: "text-gallery-charcoal" },
                            { label: "Auctions", value: auctionListings, icon: Gavel, color: "text-gallery-charcoal" },
                            { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-gallery-red" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-none p-6 border border-gallery-charcoal/20 shadow-none hover:border-gallery-red transition-all duration-300 group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50 mb-2">{stat.label}</p>
                                        <p className="text-4xl font-serif font-black text-gallery-black tracking-tight">{stat.value}</p>
                                    </div>
                                    <div className={`p-4 rounded-none bg-gallery-cream border border-gallery-charcoal/10 group-hover:border-gallery-red/30 transition-colors`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Link href="/artist/create" className="group">
                            <div className="bg-white rounded-none p-6 border border-gallery-charcoal/20 hover:border-gallery-red transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-gallery-cream border border-gallery-charcoal/10 group-hover:border-gallery-red/30 transition-colors">
                                            <Plus className="h-6 w-6 text-gallery-charcoal group-hover:text-gallery-red transition-colors" />
                                        </div>
                                        <span className="font-serif font-black text-xl text-gallery-black uppercase tracking-wider">Add Artwork</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gallery-charcoal/30 group-hover:text-gallery-red group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/shop/orders" className="group">
                            <div className="bg-white rounded-none p-6 border border-gallery-charcoal/20 hover:border-gallery-red transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-gallery-cream border border-gallery-charcoal/10 group-hover:border-gallery-red/30 transition-colors">
                                            <Package className="h-6 w-6 text-gallery-charcoal group-hover:text-gallery-red transition-colors" />
                                        </div>
                                        <span className="font-serif font-black text-xl text-gallery-black uppercase tracking-wider">View Sales</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gallery-charcoal/30 group-hover:text-gallery-red group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/shop/settings" className="group">
                            <div className="bg-white rounded-none p-6 border border-gallery-charcoal/20 hover:border-gallery-red transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-gallery-cream border border-gallery-charcoal/10 group-hover:border-gallery-red/30 transition-colors">
                                            <Settings className="h-6 w-6 text-gallery-charcoal group-hover:text-gallery-red transition-colors" />
                                        </div>
                                        <span className="font-serif font-black text-xl text-gallery-black uppercase tracking-wider">Shop Settings</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gallery-charcoal/30 group-hover:text-gallery-red group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Artworks */}
                    <div className="bg-white rounded-none p-8 border border-gallery-charcoal/20">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gallery-charcoal/20">
                            <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest">Your Masterpieces</h2>
                            {artworks.length > 6 && (
                                <Link href="/artist/dashboard" className="text-xs font-bold uppercase tracking-widest text-gallery-charcoal hover:text-gallery-red transition-colors flex items-center">
                                    View All Gallery <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            )}
                        </div>

                        {artworksLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gallery-red" />
                            </div>
                        ) : artworks.length === 0 ? (
                            <div className="text-center py-16 bg-gallery-cream border border-gallery-charcoal/10 rounded-none">
                                <ImageIcon className="w-16 h-16 text-gallery-charcoal/20 mx-auto mb-6" />
                                <h3 className="text-xl font-serif font-black text-gallery-black uppercase tracking-widest mb-3">No artworks yet</h3>
                                <p className="text-gallery-charcoal/70 font-serif italic text-lg mb-8 max-w-sm mx-auto">Start by creating your first masterpiece to display in your gallery.</p>
                                <Link href="/artist/create">
                                    <Button className="bg-gallery-black hover:bg-gallery-red text-white h-12 px-8 rounded-none uppercase tracking-widest text-xs font-bold transition-all">
                                        <Plus className="mr-2 h-4 w-4" /> Create Your First Artwork
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {artworks.slice(0, 8).map((artwork) => {
                                    const imgUrl = artwork.images?.[0] || artwork.imageUrl;
                                    return (
                                        <Link key={artwork.id} href={`/artwork/${artwork.id}`} className="group">
                                            <div className="rounded-none overflow-hidden border border-gallery-charcoal/20 bg-gallery-cream hover:border-gallery-charcoal transition-all duration-300">
                                                <div className="aspect-square bg-gallery-charcoal/5 relative overflow-hidden">
                                                    {imgUrl && (
                                                        <img
                                                            src={imgUrl}
                                                            alt={artwork.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    )}
                                                    <div className="absolute top-3 right-3">
                                                        <span className={`px-3 py-1 border text-[10px] uppercase font-bold tracking-widest ${artwork.status === "published"
                                                            ? "bg-white text-gallery-charcoal border-gallery-charcoal tracking-widest"
                                                            : artwork.status === "sold"
                                                                ? "bg-gallery-red text-white border-gallery-red"
                                                                : "bg-gallery-cream text-gallery-charcoal/50 border-gallery-charcoal/20"
                                                            }`}>
                                                            {artwork.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white border-t border-gallery-charcoal/10">
                                                    <p className="font-black text-sm text-gallery-black uppercase tracking-wider truncate mb-1">{artwork.title}</p>
                                                    <p className="text-lg text-gallery-charcoal font-serif">{formatCurrency(parseFloat(artwork.price))}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
