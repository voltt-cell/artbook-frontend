"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Package, ArrowLeft, Search } from "lucide-react";
import { fetcher } from "@/lib/swr";
import { fadeInUp } from "@/lib/animations";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type ShopOrderRow = {
    order: {
        id: string;
        artworkId: string;
        buyerId: string;
        sellerId: string;
        amount: string;
        status: "pending" | "paid" | "shipped" | "completed";
        type: "fixed" | "auction";
        createdAt: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
    };
    buyer: {
        name: string;
        email: string;
    };
};

const orderStatusColors: Record<string, string> = {
    pending: "text-gallery-charcoal border-gallery-charcoal/30 bg-transparent",
    paid: "text-white border-gallery-black bg-gallery-black",
    shipped: "text-white border-gallery-red bg-gallery-red",
    completed: "text-gallery-red border-gallery-red bg-transparent",
};

export default function ShopOrdersPage() {
    const { user, hasShop, loading: authLoading } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: ordersData, isLoading: ordersLoading } = useSWR<ShopOrderRow[]>(
        user && hasShop ? "/payments/orders/shop" : null,
        fetcher
    );

    const orders = ordersData || [];

    const filteredOrders = orders.filter((o) => {
        const search = searchTerm.toLowerCase();
        return (
            o.artwork.title.toLowerCase().includes(search) ||
            o.buyer.name.toLowerCase().includes(search) ||
            o.order.id.toLowerCase().includes(search)
        );
    });

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!user || !hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden pb-20 bg-gallery-cream">

            {/* Header */}
            <div className="bg-gallery-cream/80 backdrop-blur-md border-b border-gallery-charcoal/10 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/shop/dashboard" className="text-gallery-charcoal/50 hover:text-gallery-red transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="font-serif text-xl font-black text-gallery-black flex items-center gap-2 uppercase tracking-widest">
                                <Package className="w-5 h-5 text-gallery-red" />
                                Sales & Orders
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 max-w-6xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gallery-charcoal/20 pb-6"
                >
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">Your Sales History</h2>
                        <p className="text-gallery-charcoal/70 font-serif italic text-base sm:text-lg mt-2 tracking-wide">Manage and track the artworks you&apos;ve sold.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-charcoal/50" />
                        <input
                            type="text"
                            placeholder="Search by buyer, artwork, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gallery-charcoal/20 rounded-none focus:outline-none focus:ring-1 focus:ring-gallery-red focus:border-gallery-red text-sm font-serif"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white rounded-none border border-gallery-charcoal/20 shadow-none overflow-hidden"
                >
                    {ordersLoading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-16 h-16 border border-gallery-charcoal/20 bg-white flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gallery-red" />
                            </div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-20 text-center px-4 bg-gallery-cream border border-gallery-charcoal/10 m-4">
                            <div className="h-16 w-16 bg-white border border-gallery-charcoal/20 flex items-center justify-center mx-auto mb-6">
                                <Package className="h-8 w-8 text-gallery-charcoal/30" />
                            </div>
                            <h3 className="text-xl font-serif font-black text-gallery-black uppercase tracking-widest mb-3">No sales yet</h3>
                            <p className="text-gallery-charcoal/70 font-serif italic text-lg max-w-sm mx-auto">
                                Once your artworks start selling, the order details will appear right here in your ledger.
                            </p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gallery-charcoal/50 font-serif italic text-lg">No orders match your search.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left font-sans">
                                <thead>
                                    <tr className="bg-gallery-cream border-b border-gallery-charcoal/20 text-gallery-charcoal text-xs uppercase tracking-widest font-bold">
                                        <th className="py-5 px-6 hidden md:table-cell">Order ID</th>
                                        <th className="py-5 px-6">Artwork</th>
                                        <th className="py-5 px-6">Buyer</th>
                                        <th className="py-5 px-6 hidden sm:table-cell">Date</th>
                                        <th className="py-5 px-6 text-right">Amount</th>
                                        <th className="py-5 px-6 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(({ order, artwork, buyer }) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gallery-charcoal/10 hover:bg-gallery-cream/50 transition-colors last:border-0"
                                        >
                                            <td className="py-4 px-6 hidden md:table-cell align-middle">
                                                <span className="font-bold uppercase tracking-wider text-gallery-charcoal/70">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 shrink-0 rounded-none overflow-hidden border border-gallery-charcoal/20 bg-gallery-cream">
                                                        {artwork.imageUrl ? (
                                                            <img
                                                                src={artwork.imageUrl}
                                                                alt={artwork.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <Package className="h-5 w-5 text-gallery-charcoal/20" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm text-gallery-black uppercase tracking-wider truncate mb-1">{artwork.title}</p>
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 border border-gallery-charcoal/20 px-2 py-0.5 mt-1 inline-block">
                                                            {order.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 align-middle">
                                                <p className="font-bold text-sm text-gallery-black uppercase tracking-wider truncate hidden lg:block">{buyer.name}</p>
                                                <p className="font-bold text-sm text-gallery-black uppercase tracking-wider truncate lg:hidden">{buyer.email}</p>
                                                <p className="text-xs text-gallery-charcoal/70 hidden lg:block mt-1 font-serif italic truncate">{buyer.email}</p>
                                            </td>
                                            <td className="py-4 px-6 hidden sm:table-cell text-gallery-charcoal font-serif italic align-middle">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="py-4 px-6 text-right align-middle">
                                                <p className="font-serif text-lg text-gallery-black">
                                                    ${parseFloat(order.amount).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 text-center align-middle">
                                                <div className="flex items-center justify-center">
                                                    <span
                                                        className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 border ${orderStatusColors[order.status] || "bg-gallery-cream border-gallery-charcoal/20 text-gallery-charcoal/50"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
