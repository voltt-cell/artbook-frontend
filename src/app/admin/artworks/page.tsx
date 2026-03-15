"use client";

import useSWR, { mutate } from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ArtworkRow = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    status: "draft" | "published" | "sold";
    listingType: "fixed" | "auction";
    createdAt: string;
};

const statusColors: Record<string, string> = {
    draft: "text-gallery-charcoal border-gallery-charcoal/30 bg-gallery-cream",
    published: "text-white border-gallery-black bg-gallery-black",
    sold: "text-gallery-charcoal/50 border-gallery-charcoal/20 bg-transparent",
};

export default function AdminArtworksPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [deleteArtwork, setDeleteArtwork] = useState<{ id: string; title: string } | null>(null);
    const limit = 10;

    const debouncedSearch = useDebounce(search, 500);

    // Reset to page 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data: response, isLoading } = useSWR<{ data: ArtworkRow[], total: number }>(
        isAdmin ? `/admin/artworks?page=${page}&limit=${limit}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}` : null,
        fetcher
    );

    const artworksList = response?.data || [];
    const totalArtworks = response?.total || 0;
    const totalPages = Math.ceil(totalArtworks / limit);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.put(`/admin/artworks/${id}/status`, { status: newStatus });
            toast.success("Status updated");
            mutate("/admin/artworks");
        } catch (err) {
            toast.error("Failed to update status", { description: (err as Error).message });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/admin/artworks/${id}`);
            toast.success("Artwork deleted");
            mutate("/admin/artworks");
        } catch (err) {
            toast.error("Failed to delete", { description: (err as Error).message });
        }
    };

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
                        <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">Artwork Management</h1>
                        <p className="text-gallery-charcoal/70 font-serif italic text-lg mt-2">{totalArtworks} total artworks</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-charcoal/50" />
                        <Input
                            placeholder="Search by title or medium..."
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
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Artwork</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Medium</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Price</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Type</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Status</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Created</th>
                                    <th className="text-right py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artworksList.map((artwork) => (
                                    <motion.tr
                                        key={artwork.id}
                                        variants={fadeInUp}
                                        className="border-b border-gallery-charcoal/10 hover:bg-gallery-cream/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={artwork.imageUrl}
                                                    alt={artwork.title}
                                                    className="w-12 h-12 rounded-none object-cover border border-gallery-charcoal/20"
                                                />
                                                <span className="font-bold text-gallery-black uppercase tracking-wider max-w-[200px] truncate">
                                                    {artwork.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-charcoal/80 font-medium">{artwork.medium}</td>
                                        <td className="py-4 px-6 text-gallery-black font-bold font-serif text-lg">
                                            ${parseFloat(artwork.price).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-none border border-gallery-charcoal/20 text-gallery-charcoal uppercase tracking-widest">
                                                {artwork.listingType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Select
                                                value={artwork.status}
                                                onValueChange={(value) => handleStatusChange(artwork.id, value)}
                                            >
                                                <SelectTrigger className={`h-8 text-[10px] font-bold uppercase tracking-widest px-3 py-0 rounded-none border shadow-none ${statusColors[artwork.status]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-gallery-charcoal/20">
                                                    <SelectItem value="draft" className="text-xs uppercase tracking-widest font-bold">Draft</SelectItem>
                                                    <SelectItem value="published" className="text-xs uppercase tracking-widest font-bold">Published</SelectItem>
                                                    <SelectItem value="sold" className="text-xs uppercase tracking-widest font-bold">Sold</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-charcoal/70 font-medium">
                                            {new Date(artwork.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteArtwork({ id: artwork.id, title: artwork.title })}
                                                className="h-8 w-8 text-gallery-red/70 hover:text-gallery-red hover:bg-gallery-red/10 cursor-pointer rounded-none transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {artworksList.length === 0 && (
                        <div className="py-16 text-center text-gallery-charcoal/50">
                            <p className="font-bold text-sm uppercase tracking-widest">No artworks found</p>
                        </div>
                    )}

                    <AdminPagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalArtworks}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                    />
                </div>
            </motion.div>

            <AlertDialog open={!!deleteArtwork} onOpenChange={(open) => !open && setDeleteArtwork(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the artwork &quot;{deleteArtwork?.title}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { if (deleteArtwork) handleDelete(deleteArtwork.id); setDeleteArtwork(null); }}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
