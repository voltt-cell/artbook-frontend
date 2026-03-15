"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useState, useEffect } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { useDebounce } from "@/hooks/use-debounce";

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

const statusColors: Record<string, string> = {
    pending: "text-gallery-red border-gallery-red bg-transparent",
    paid: "text-gallery-charcoal border-gallery-charcoal/30 bg-gallery-cream",
    shipped: "text-white border-gallery-black bg-gallery-black",
    completed: "text-gallery-charcoal/50 border-gallery-charcoal/20 bg-transparent",
};

export default function AdminOrdersPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const debouncedSearch = useDebounce(search, 500);

    // Reset to page 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data: response, isLoading } = useSWR<{ data: OrderRow[], total: number }>(
        isAdmin ? `/admin/orders?page=${page}&limit=${limit}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}` : null,
        fetcher
    );

    const ordersList = response?.data || [];
    const totalOrders = response?.total || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-black text-gallery-black mb-2 uppercase tracking-widest">Access Denied</h2>
                    <p className="text-gallery-charcoal/70 font-semibold uppercase tracking-widest text-xs">Admin access required.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">Order Management</h1>
                        <p className="text-gallery-charcoal/70 font-serif italic text-lg mt-2">{totalOrders} total orders</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-charcoal/50" />
                        <Input
                            placeholder="Search by ID, status, or type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-12 rounded-none bg-white border-gallery-charcoal/20 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none transition-colors"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <div className="bg-white border border-gallery-charcoal/20 shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gallery-cream border-b border-gallery-charcoal/20">
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Order ID</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Amount</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Type</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Status</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        variants={fadeInUp}
                                        className="border-b border-gallery-charcoal/10 hover:bg-gallery-cream/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-xs font-bold text-gallery-black uppercase tracking-wider">
                                                {order.id.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-black font-bold font-serif text-lg">
                                            ${parseFloat(order.amount).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-none border border-gallery-charcoal/20 text-gallery-charcoal uppercase tracking-widest">
                                                {order.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-none border uppercase tracking-widest ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-charcoal/70 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {ordersList.length === 0 && (
                        <div className="py-16 text-center text-gallery-charcoal/50">
                            <p className="font-bold text-sm uppercase tracking-widest">No orders found</p>
                        </div>
                    )}

                    <AdminPagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalOrders}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                    />
                </div>
            </motion.div>
        </div>
    );
}
