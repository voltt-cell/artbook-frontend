"use client";

import useSWR, { mutate } from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, ArrowLeft, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
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

type UserRow = {
    id: string;
    name: string;
    email: string;
    role: "artist" | "buyer" | "admin";
    bio: string | null;
    profileImage: string | null;
    createdAt: string;
};

const roleColors: Record<string, string> = {
    admin: "text-gallery-red border-gallery-red",
    artist: "text-gallery-charcoal border-gallery-charcoal/30",
    buyer: "text-gallery-charcoal/70 border-gallery-charcoal/20",
};

export default function AdminUsersPage() {
    const { isAdmin, loading: authLoading, user: currentUser } = useAuth();
    const { data: users, isLoading } = useSWR<UserRow[]>(
        isAdmin ? "/admin/users" : null,
        fetcher
    );
    const [search, setSearch] = useState("");
    const [deleteUser, setDeleteUser] = useState<{ id: string; name: string } | null>(null);

    const filteredUsers = (users || []).filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success("Role updated successfully");
            mutate("/admin/users");
        } catch (err) {
            toast.error("Failed to update role", { description: (err as Error).message });
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success("User deleted");
            mutate("/admin/users");
        } catch (err) {
            toast.error("Failed to delete user", { description: (err as Error).message });
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
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
                        <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">User Management</h1>
                        <p className="text-gallery-charcoal/70 font-serif italic text-lg mt-2">{filteredUsers.length} total users registered</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gallery-charcoal/50" />
                        <Input
                            placeholder="Search by name or email..."
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
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">User</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Email</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Role</th>
                                    <th className="text-left py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Joined</th>
                                    <th className="text-right py-4 px-6 font-bold text-gallery-charcoal uppercase text-xs tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        variants={fadeInUp}
                                        className="border-b border-gallery-charcoal/10 hover:bg-gallery-cream/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-none bg-gallery-charcoal flex items-center justify-center text-white font-serif font-bold text-lg shadow-none">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gallery-black uppercase tracking-wider">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-charcoal/80 font-medium">{user.email}</td>
                                        <td className="py-4 px-6">
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                                disabled={user.id === currentUser?.id}
                                            >
                                                <SelectTrigger className={`h-8 text-xs font-bold uppercase tracking-widest px-3 py-0 rounded-none border focus:ring-0 shadow-none bg-transparent ${roleColors[user.role]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-gallery-charcoal/20">
                                                    <SelectItem value="buyer" className="text-xs uppercase tracking-widest font-bold">Buyer</SelectItem>
                                                    <SelectItem value="artist" className="text-xs uppercase tracking-widest font-bold">Artist</SelectItem>
                                                    <SelectItem value="admin" className="text-xs uppercase tracking-widest font-bold text-gallery-red">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="py-4 px-6 text-gallery-charcoal/70 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {user.id !== currentUser?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteUser({ id: user.id, name: user.name })}
                                                    className="h-8 w-8 text-gallery-red/70 hover:text-gallery-red hover:bg-gallery-red/10 cursor-pointer rounded-none transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="py-16 text-center text-gray-400">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="font-medium text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </motion.div>

            <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the user "{deleteUser?.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { if (deleteUser) handleDelete(deleteUser.id); setDeleteUser(null); }}
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
