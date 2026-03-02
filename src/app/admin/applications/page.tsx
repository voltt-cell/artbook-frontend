"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Store, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ShopApplication = {
    application: {
        id: string;
        shopName: string;
        shopDescription: string;
        portfolioUrl: string | null;
        status: "pending" | "approved" | "rejected";
        adminNotes: string | null;
        createdAt: string;
        reviewedAt: string | null;
    };
    user: {
        id: string;
        name: string;
        email: string;
        profileImage: string | null;
    };
};

export default function AdminApplicationsPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<ShopApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchApplications();
        }
    }, [authLoading, isAdmin]);

    const fetchApplications = async () => {
        try {
            const data = await api.get<ShopApplication[]>("/admin/shop-applications");
            setApplications(data);
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await api.post(`/admin/shop-applications/${id}/approve`, {});
            toast.success("Application approved!");
            fetchApplications();
        } catch (error) {
            toast.error("Failed to approve", {
                description: (error as Error).message,
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const notes = prompt("Rejection reason (optional):");
        setProcessingId(id);
        try {
            await api.post(`/admin/shop-applications/${id}/reject`, { notes });
            toast.success("Application rejected");
            fetchApplications();
        } catch (error) {
            toast.error("Failed to reject", {
                description: (error as Error).message,
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAdmin) {
        router.push("/");
        return null;
    }

    const pending = applications.filter((a) => a.application.status === "pending");
    const reviewed = applications.filter((a) => a.application.status !== "pending");

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest mb-2">
                Shop Applications
            </h1>
            <p className="text-gallery-charcoal/70 font-serif italic text-lg mb-8">
                Review and manage shop applications from users who want to sell on ArtBook.
            </p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <>
                    {/* Pending Applications */}
                    <div className="mb-10">
                        <h2 className="text-xl font-serif font-black text-gallery-black mb-6 uppercase tracking-widest flex items-center gap-3 border-b border-gallery-charcoal/10 pb-4">
                            <Clock className="h-5 w-5 text-gallery-red" />
                            Pending ({pending.length})
                        </h2>
                        {pending.length === 0 ? (
                            <div className="bg-white border border-gallery-charcoal/20 p-16 text-center">
                                <p className="font-bold text-sm uppercase tracking-widest text-gallery-charcoal/50">No pending applications</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pending.map((item) => (
                                    <motion.div
                                        key={item.application.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-6 border border-gallery-charcoal/20 transition-colors hover:border-gallery-charcoal/40"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex items-start gap-6">
                                                <div className="w-16 h-16 rounded-none bg-gallery-charcoal flex items-center justify-center flex-shrink-0 text-white font-serif font-black text-2xl">
                                                    {item.user.profileImage ? (
                                                        <img src={item.user.profileImage} alt={item.user.name} className="w-full h-full rounded-none object-cover grayscale" />
                                                    ) : (
                                                        item.user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gallery-black uppercase tracking-wider text-lg">{item.user.name}</h3>
                                                    <p className="text-sm font-semibold text-gallery-charcoal/70">{item.user.email}</p>
                                                    <div className="mt-4 pt-4 border-t border-gallery-charcoal/10">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Store className="h-4 w-4 text-gallery-red" />
                                                            <span className="font-black text-gallery-black uppercase tracking-widest text-sm">{item.application.shopName}</span>
                                                        </div>
                                                        <p className="text-sm text-gallery-charcoal/80 mt-1 font-serif leading-relaxed">{item.application.shopDescription}</p>
                                                        {item.application.portfolioUrl && (
                                                            <a href={item.application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-gallery-red hover:text-gallery-black mt-3 block transition-colors">
                                                                View Portfolio →
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50 mt-4">
                                                        Applied {new Date(item.application.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col gap-3 flex-shrink-0 w-full md:w-auto mt-6 md:mt-0">
                                                <Button
                                                    onClick={() => handleApprove(item.application.id)}
                                                    disabled={processingId === item.application.id}
                                                    size="sm"
                                                    className="flex-1 md:flex-none bg-gallery-black hover:bg-gallery-red text-white uppercase tracking-widest text-xs font-bold rounded-none h-10 transition-colors"
                                                >
                                                    {processingId === item.application.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(item.application.id)}
                                                    disabled={processingId === item.application.id}
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 md:flex-none border-gallery-charcoal/20 text-gallery-charcoal hover:bg-gallery-red hover:text-white hover:border-gallery-red uppercase tracking-widest text-xs font-bold rounded-none h-10 transition-colors shadow-none"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" /> Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {reviewed.length > 0 && (
                        <div>
                            <h2 className="text-xl font-serif font-black text-gallery-black mb-6 uppercase tracking-widest border-b border-gallery-charcoal/10 pb-4">
                                Reviewed ({reviewed.length})
                            </h2>
                            <div className="space-y-4">
                                {reviewed.map((item) => (
                                    <div
                                        key={item.application.id}
                                        className="bg-white p-5 border border-gallery-charcoal/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <div className={`p-2 border ${item.application.status === "approved" ? "border-gallery-black text-gallery-black" : "border-gallery-red text-gallery-red"}`}>
                                                {item.application.status === "approved" ? (
                                                    <CheckCircle className="h-5 w-5" />
                                                ) : (
                                                    <XCircle className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gallery-black uppercase tracking-wider text-sm truncate">
                                                    {item.user.name} <span className="text-gallery-charcoal/50 mx-2">—</span> <span className="text-gallery-red">{item.application.shopName}</span>
                                                </p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50 mt-1">
                                                    {item.application.status === "approved" ? "Approved" : "Rejected"} on {item.application.reviewedAt ? new Date(item.application.reviewedAt).toLocaleDateString() : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
