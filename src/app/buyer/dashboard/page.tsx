"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, ShoppingBag, Gavel, Trophy, CreditCard, LayoutDashboard, User, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

type OrderRow = {
    id: string;
    artworkId: string;
    buyerId: string;
    sellerId: string;
    amount: string;
    status: "pending" | "paid" | "shipped" | "completed";
    type: "fixed" | "auction";
    stripeSessionId: string | null;
    createdAt: string;
};

type BidRow = {
    bid: {
        id: string;
        auctionId: string;
        bidderId: string;
        amount: string;
        createdAt: string;
    };
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        winnerId: string | null;
        status: "active" | "ended" | "paid";
        createdAt: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        price: string;
        medium: string;
    };
};

const tabs = [
    { id: "summary", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "bids", label: "My Bids", icon: Gavel },
    { id: "won", label: "Won Auctions", icon: Trophy },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function BuyerDashboard() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>("summary");

    const { data: orders, isLoading: ordersLoading } = useSWR<OrderRow[]>(
        isAuthenticated ? "/payments/orders" : null,
        fetcher
    );

    const { data: bidsRaw, isLoading: bidsLoading } = useSWR<BidRow[]>(
        isAuthenticated ? "/auctions/my-bids" : null,
        fetcher
    );

    const myBids = bidsRaw || [];
    const wonAuctions = myBids.filter(
        (b) =>
            b.auction.status === "ended" &&
            b.auction.winnerId === user?.id
    );
    // Deduplicate won auctions by auction id (keep highest bid)
    const uniqueWon = Object.values(
        wonAuctions.reduce<Record<string, BidRow>>((acc, b) => {
            if (!acc[b.auction.id] || parseFloat(b.bid.amount) > parseFloat(acc[b.auction.id].bid.amount)) {
                acc[b.auction.id] = b;
            }
            return acc;
        }, {})
    );

    const handlePayAuction = async (auctionId: string) => {
        try {
            const res = await api.post<{ sessionUrl: string }>("/payments/auction-checkout", {
                auctionId,
            });
            window.location.href = res.sessionUrl;
        } catch (err) {
            toast.error("Payment failed", { description: (err as Error).message });
        }
    };

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-gallery-cream flex flex-col items-center justify-center border-t border-gallery-charcoal/20">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-lg w-full">
                    <User className="w-12 h-12 text-gallery-charcoal mx-auto mb-6 opacity-50" />
                    <h2 className="text-3xl font-serif font-black text-gallery-black mb-4 uppercase tracking-widest">Authentication Required</h2>
                    <p className="font-serif italic text-gallery-charcoal/70 mb-8 max-w-sm mx-auto">Please log in to access your collector&apos;s dashboard and manage your acquisitions.</p>
                    <Button onClick={() => window.location.href = "/login"} className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pb-24">
            <div className="bg-white border-b border-gallery-charcoal/20 pt-16 pb-12 mb-12 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal mb-6">
                            Collector Profile
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-black text-gallery-black uppercase tracking-widest mb-4">
                            Dashboard
                        </h1>
                        <p className="text-xl font-serif italic text-gallery-charcoal/70">
                            Welcome back, <span className="font-bold border-b border-gallery-red lowercase">{user?.name}</span>
                        </p>
                    </motion.div>
                </div>
                {/* Decorative Line */}
                <div className="absolute bottom-0 right-1/4 w-px h-12 bg-gallery-charcoal/10" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Tabs */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="flex flex-wrap gap-0 mb-12 border border-gallery-charcoal/20 bg-white shadow-none w-fit"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        let count = 0;
                        if (tab.id === "orders") count = (orders || []).length;
                        if (tab.id === "bids") count = myBids.length;
                        if (tab.id === "won") count = uniqueWon.length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-r border-gallery-charcoal/20 last:border-r-0 ${isActive
                                    ? "bg-gallery-black text-white"
                                    : "text-gallery-charcoal/70 hover:bg-gallery-cream hover:text-gallery-red"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 text-[10px] ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-gallery-charcoal/10 text-gallery-charcoal"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Summary Tab */}
                    {activeTab === "summary" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <motion.div variants={fadeInUp} className="bg-white border border-gallery-charcoal/20 shadow-none md:col-span-1 h-fit">
                                <div className="p-8 flex flex-col items-center text-center">
                                    <div className="h-28 w-28 bg-gallery-cream flex border border-gallery-charcoal/20 items-center justify-center text-gallery-black text-4xl font-serif font-black mb-6 uppercase">
                                        {user?.profileImage ? (
                                            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0)
                                        )}
                                    </div>
                                    <h2 className="text-xl font-serif font-black text-gallery-black uppercase tracking-widest leading-tight">{user?.name}</h2>
                                    <p className="text-gallery-charcoal/60 text-xs font-bold uppercase tracking-widest mb-8 mt-2">{user?.email}</p>

                                    <div className="w-full grid grid-cols-2 gap-0 border-y border-gallery-charcoal/20 mb-8 bg-gallery-cream/30">
                                        <div className="p-4 border-r border-gallery-charcoal/20">
                                            <p className="text-3xl font-serif font-black text-gallery-black">{orders?.length || 0}</p>
                                            <p className="text-[10px] text-gallery-charcoal uppercase tracking-widest font-bold mt-1">Orders</p>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-3xl font-serif font-black text-gallery-black">{uniqueWon.length}</p>
                                            <p className="text-[10px] text-gallery-charcoal uppercase tracking-widest font-bold mt-1">Wins</p>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full rounded-none border-gallery-charcoal/20 hover:bg-gallery-red hover:text-white hover:border-gallery-red uppercase tracking-widest text-xs font-bold transition-colors h-12" onClick={() => window.location.href = "/settings"}>
                                        <User className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div variants={fadeInUp} className="bg-white border border-gallery-charcoal/20 shadow-none md:col-span-2 flex flex-col overflow-hidden">
                                <div className="px-8 flex items-center justify-between border-b border-gallery-charcoal/20 min-h-[5rem]">
                                    <h3 className="font-serif font-black text-xl text-gallery-black uppercase tracking-widest flex items-center">
                                        <Clock className="w-5 h-5 mr-3 text-gallery-red" />
                                        Recent Activity
                                    </h3>
                                    <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal hover:text-gallery-red p-0 h-auto" onClick={() => setActiveTab("orders")}>
                                        View All
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                                <div className="flex-1 bg-gallery-cream/20">
                                    {ordersLoading ? (
                                        <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-gallery-red w-8 h-8" /></div>
                                    ) : (orders || []).length === 0 && myBids.length === 0 ? (
                                        <div className="text-center py-20 px-8">
                                            <p className="text-gallery-charcoal/60 font-serif italic text-lg mb-6">No recent activity found in your collection.</p>
                                            <Button className="bg-gallery-black hover:bg-gallery-red rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12" onClick={() => window.location.href = "/artworks"}>Start Exploring</Button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gallery-charcoal/10">
                                            {/* Show latest order if exists */}
                                            {orders && orders.length > 0 && (
                                                <div className="flex items-center gap-6 p-6 hover:bg-gallery-cream/50 transition-colors">
                                                    <div className="h-12 w-12 border border-gallery-charcoal/20 flex items-center justify-center text-gallery-black bg-white shrink-0">
                                                        <ShoppingBag className="w-5 h-5 opacity-60" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold uppercase tracking-widest text-gallery-black">Order Placed</p>
                                                        <p className="text-xs text-gallery-charcoal/60 uppercase tracking-widest mt-1">Ref: {orders[0].id.slice(0, 8)} • {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-serif font-bold text-gallery-black mb-1">${parseFloat(orders[0].amount).toLocaleString()}</p>
                                                        <span className="text-[10px] px-2 py-0.5 border border-gallery-charcoal/20 bg-white font-bold uppercase tracking-widest text-gallery-charcoal">{orders[0].status}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show latest bid if exists */}
                                            {myBids && myBids.length > 0 && (
                                                <div className="flex items-center gap-6 p-6 hover:bg-gallery-cream/50 transition-colors">
                                                    <div className="h-12 w-12 border border-gallery-charcoal/20 flex items-center justify-center text-gallery-black bg-white shrink-0">
                                                        <Gavel className="w-5 h-5 opacity-60" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold uppercase tracking-widest text-gallery-black truncate">Bid: {myBids[0].artwork.title}</p>
                                                        <p className="text-xs text-gallery-charcoal/60 uppercase tracking-widest mt-1">{new Date(myBids[0].bid.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-serif font-bold text-gallery-black mb-1">${parseFloat(myBids[0].bid.amount).toLocaleString()}</p>
                                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase tracking-widest ${myBids[0].auction.status === 'active' ? 'border-gallery-red text-gallery-red bg-white' : 'border-gallery-charcoal/20 text-gallery-charcoal bg-gallery-cream'}`}>{myBids[0].auction.status}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* My Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="bg-white border border-gallery-charcoal/20 shadow-none overflow-hidden">
                            {ordersLoading ? (
                                <div className="py-24 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
                                </div>
                            ) : (orders || []).length === 0 ? (
                                <div className="py-32 text-center bg-gallery-cream/30">
                                    <ShoppingBag className="h-12 w-12 text-gallery-charcoal/30 mx-auto mb-6" />
                                    <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-2">No Acquisitions</h2>
                                    <p className="font-serif italic text-gallery-charcoal/70">Your collection log is currently empty.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b border-gallery-charcoal/20 bg-gallery-cream/50">
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Order Ref</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Amount</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Origin</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Status</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gallery-charcoal/10">
                                            {(orders || []).map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gallery-cream/30 transition-colors"
                                                >
                                                    <td className="py-5 px-6">
                                                        <span className="font-mono text-xs font-bold text-gallery-charcoal uppercase tracking-wider">
                                                            {order.id.slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 font-serif font-bold text-lg text-gallery-black">
                                                        ${parseFloat(order.amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 border border-gallery-charcoal/20 text-gallery-charcoal capitalize">
                                                            {order.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <span
                                                            className={`text-[10px] font-bold px-2 py-0.5 border uppercase tracking-widest ${order.status === 'completed' || order.status === 'paid' ? 'border-gallery-black bg-gallery-black text-white' : 'border-gallery-charcoal/20 text-gallery-charcoal bg-white'
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 text-xs text-gallery-charcoal/60 uppercase tracking-widest text-right">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Bids Tab */}
                    {activeTab === "bids" && (
                        <div className="bg-white border border-gallery-charcoal/20 shadow-none overflow-hidden">
                            {bidsLoading ? (
                                <div className="py-24 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
                                </div>
                            ) : myBids.length === 0 ? (
                                <div className="py-32 text-center bg-gallery-cream/30">
                                    <Gavel className="h-12 w-12 text-gallery-charcoal/30 mx-auto mb-6" />
                                    <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-2">No Active Bids</h2>
                                    <p className="font-serif italic text-gallery-charcoal/70">Participate in an auction to see your bidding history.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b border-gallery-charcoal/20 bg-gallery-cream/50">
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Artwork</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Your Offer</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Current Highest</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Status</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal">Outcome</th>
                                                <th className="py-5 px-6 font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gallery-charcoal/10">
                                            {myBids.map((item) => {
                                                const isWinner =
                                                    item.auction.winnerId === user?.id &&
                                                    item.auction.status !== "active";
                                                return (
                                                    <tr
                                                        key={item.bid.id}
                                                        className="hover:bg-gallery-cream/30 transition-colors"
                                                    >
                                                        <td className="py-5 px-6">
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={item.artwork.imageUrl}
                                                                    alt={item.artwork.title}
                                                                    className="w-10 h-10 object-cover border border-gallery-charcoal/20"
                                                                />
                                                                <span className="font-bold text-xs uppercase tracking-widest text-gallery-black max-w-[180px] truncate">
                                                                    {item.artwork.title}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6 font-serif font-bold text-lg text-gallery-black">
                                                            ${parseFloat(item.bid.amount).toLocaleString()}
                                                        </td>
                                                        <td className="py-5 px-6 font-serif text-gallery-charcoal/80">
                                                            {item.auction.currentBid
                                                                ? `$${parseFloat(item.auction.currentBid).toLocaleString()}`
                                                                : "—"}
                                                        </td>
                                                        <td className="py-5 px-6">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 border uppercase tracking-widest ${item.auction.status === 'active' ? 'border-gallery-red text-gallery-red bg-white' : 'border-gallery-charcoal/20 text-gallery-charcoal bg-gallery-cream'}`}>{item.auction.status}</span>
                                                        </td>
                                                        <td className="py-5 px-6">
                                                            {item.auction.status === "active" ? (
                                                                <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/60">Live</span>
                                                            ) : isWinner ? (
                                                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-gallery-black bg-gallery-black text-white">
                                                                    Acquired
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-gallery-charcoal/30 text-gallery-charcoal">
                                                                    Passed
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-5 px-6 text-xs text-gallery-charcoal/60 uppercase tracking-widest text-right">
                                                            {new Date(item.bid.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Won Auctions Tab */}
                    {activeTab === "won" && (
                        <div>
                            {bidsLoading ? (
                                <div className="py-24 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
                                </div>
                            ) : uniqueWon.length === 0 ? (
                                <div className="bg-white border border-gallery-charcoal/20 shadow-none py-32 text-center bg-gallery-cream/30">
                                    <div className="w-16 h-16 border border-gallery-charcoal/20 bg-white flex items-center justify-center mx-auto mb-6">
                                        <Trophy className="h-6 w-6 text-gallery-charcoal/30" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-2">No Acquisitions</h2>
                                    <p className="font-serif italic text-gallery-charcoal/70 mb-8">Emerge victorious in an auction to secure masterpieces.</p>
                                    <Button onClick={() => window.location.href = "/auctions"} className="bg-gallery-black hover:bg-gallery-red text-white h-12 px-8 rounded-none font-bold uppercase tracking-widest text-[10px] transition-colors">Go to Auctions</Button>
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {uniqueWon.map((item) => {
                                        const isPaid = item.auction.status === "paid";
                                        return (
                                            <motion.div
                                                key={item.auction.id}
                                                variants={fadeInUp}
                                                className="bg-white border border-gallery-charcoal/20 shadow-none overflow-hidden group hover:border-gallery-black transition-colors"
                                            >
                                                <div className="relative overflow-hidden aspect-square">
                                                    <img
                                                        src={item.artwork.imageUrl}
                                                        alt={item.artwork.title}
                                                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                    <div className="absolute top-4 right-4">
                                                        <span
                                                            className={`text-[10px] font-bold px-3 py-1 uppercase tracking-widest border ${isPaid
                                                                ? "bg-gallery-black text-white border-gallery-black"
                                                                : "bg-gallery-red text-white border-gallery-red"
                                                                }`}
                                                        >
                                                            {isPaid ? "Settled" : "Pending Payment"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <h3 className="font-serif text-2xl font-black text-gallery-black mb-2 uppercase tracking-widest">
                                                        {item.artwork.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-6 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/60">
                                                        <span>{item.artwork.medium}</span>
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center justify-between border-b border-gallery-charcoal/10 pb-4">
                                                            <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/60">Final Price</p>
                                                            <p className="text-2xl font-serif font-black text-gallery-black">
                                                                ${parseFloat(item.auction.currentBid || item.bid.amount).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {!isPaid && (
                                                            <Button
                                                                onClick={() => handlePayAuction(item.auction.id)}
                                                                className="w-full bg-gallery-black hover:bg-gallery-red text-white rounded-none h-14 uppercase tracking-widest text-xs font-bold transition-colors mt-2"
                                                            >
                                                                <CreditCard className="h-4 w-4 mr-2" />
                                                                Settle Account
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
