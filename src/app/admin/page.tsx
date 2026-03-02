"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Users, Image, ShoppingCart, Gavel, DollarSign, Palette, UserCheck, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";

type Stats = {
    totalUsers: number;
    totalArtworks: number;
    totalOrders: number;
    totalAuctions: number;
    totalRevenue: number;
    totalArtists: number;
    totalBuyers: number;
    revenueTrend: { month: string; revenue: number }[];
    userGrowth: { month: string; users: number }[];
};

const statCards = [
    { key: "totalRevenue", label: "Total Revenue", icon: DollarSign },
    { key: "totalUsers", label: "Total Users", icon: Users },
    { key: "totalArtists", label: "Verified Artists", icon: Palette },
    { key: "totalBuyers", label: "Active Buyers", icon: UserCheck },
    { key: "totalArtworks", label: "Total Artworks", icon: Image },
    { key: "totalOrders", label: "Platform Orders", icon: ShoppingCart },
    { key: "totalAuctions", label: "Platform Auctions", icon: Gavel },
] as const;

export default function AdminDashboard() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: stats, isLoading } = useSWR<Stats>(
        isAdmin ? "/admin/stats" : null,
        fetcher,
        { refreshInterval: 60000 }
    );

    if (authLoading || isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-black text-gallery-black mb-2 uppercase tracking-widest">Access Denied</h2>
                    <p className="text-gallery-charcoal/70 font-semibold uppercase tracking-widest text-xs">You need an admin account to access this area.</p>
                </div>
            </div>
        );
    }

    const formatValue = (key: string, value: number) => {
        if (key === "totalRevenue") return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        return value.toLocaleString();
    };

    const hasRevenueData = stats?.revenueTrend && stats.revenueTrend.length > 0;
    const hasUserData = stats?.userGrowth && stats.userGrowth.length > 0;

    return (
        <div className="p-8">
            {/* Header Area */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 border justify-center items-center flex border-gallery-charcoal/30 bg-white">
                        <Activity className="h-5 w-5 text-gallery-charcoal" />
                    </div>
                    <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">Platform Overview</h1>
                </div>
                <p className="text-gallery-charcoal/70 ml-[52px] font-serif italic text-lg mt-2">Monitor your marketplace performance and key metrics in real-time.</p>
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
            >
                {statCards.map((card) => {
                    const Icon = card.icon;
                    const value = stats?.[card.key] ?? 0;
                    return (
                        <motion.div key={card.key} variants={fadeInUp}>
                            <div className="relative overflow-hidden bg-white border border-gallery-charcoal/20 p-6 transition-all group hover:border-gallery-red">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gallery-cream border border-gallery-charcoal/10 group-hover:bg-gallery-red group-hover:border-gallery-red transition-colors`}>
                                        <Icon className="h-5 w-5 text-gallery-charcoal group-hover:text-white transition-colors" />
                                    </div>
                                    <div className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-gallery-charcoal/20 text-gallery-charcoal`}>
                                        Real-time
                                    </div>
                                </div>
                                <p className="text-4xl font-serif font-black text-gallery-black tracking-tighter">{formatValue(card.key, value)}</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50 mt-3 pt-3 border-t border-gallery-charcoal/10">{card.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Section */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
                {/* Revenue Graph */}
                <motion.div variants={fadeInUp} className="bg-white border border-gallery-charcoal/20 p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gallery-charcoal/10 pb-4">
                        <div>
                            <h2 className="text-xl font-serif font-black text-gallery-black flex items-center gap-2 uppercase tracking-widest">
                                <TrendingUp className="h-5 w-5 text-gallery-red" />
                                Revenue Growth
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50 mt-2">Total revenue over the last 6 months</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {hasRevenueData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,26,26,0.1)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} tickFormatter={(value: any) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#F9F6F0', borderRadius: '0', border: '1px solid rgba(26,26,26,0.2)', color: '#1A1A1A' }}
                                        itemStyle={{ color: '#1A1A1A', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        formatter={(value: any) => [`$${value?.toLocaleString() || 0}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-gallery-charcoal/20 bg-gallery-cream/50">
                                <Activity className="h-8 w-8 text-gallery-charcoal/30 mb-2" />
                                <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50">Not enough revenue data</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* User Growth Graph */}
                <motion.div variants={fadeInUp} className="bg-white border border-gallery-charcoal/20 p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gallery-charcoal/10 pb-4">
                        <div>
                            <h2 className="text-xl font-serif font-black text-gallery-black flex items-center gap-2 uppercase tracking-widest">
                                <Users className="h-5 w-5 text-gallery-red" />
                                User Acquisition
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50 mt-2">Platform registrations over time</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {hasUserData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,26,26,0.1)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1A1A1A', fontWeight: 'bold' }} />
                                    <Tooltip
                                        cursor={{ fill: '#F9F6F0' }}
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '0', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        formatter={(value: any) => [value, 'New Users']}
                                    />
                                    <Bar dataKey="users" fill="#D32F2F" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-gallery-charcoal/20 bg-gallery-cream/50">
                                <Users className="h-8 w-8 text-gallery-charcoal/30 mb-2" />
                                <p className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50">Not enough user data</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
