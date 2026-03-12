"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, Camera, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { user, isAuthenticated, loading, refreshUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

    // Profile state
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileSaving, setProfileSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Initialize form with user data
    const [initialized, setInitialized] = useState(false);
    if (user && !initialized) {
        setName(user.name);
        setBio(user.bio || "");
        setProfileImage(user.profileImage || "");
        setInitialized(true);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

            const response = await fetch(`${API_URL}/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Upload failed");
            }

            const { url } = await response.json();
            // Build full URL for the image
            const fullUrl = `${API_URL}${url}`;
            setProfileImage(fullUrl);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Upload failed", {
                description: (error as Error).message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileSave = async () => {
        setProfileSaving(true);
        try {
            await api.put("/auth/profile", { name, bio, profileImage });
            await refreshUser();
            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Failed to update profile", {
                description: (error as Error).message,
            });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setPasswordSaving(true);
        try {
            await api.put("/auth/password", { currentPassword, newPassword });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Failed to change password", {
                description: (error as Error).message,
            });
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="font-serif text-5xl md:text-6xl font-black tracking-widest uppercase text-gallery-black text-center mb-16"
                >
                    Settings
                </motion.h1>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gallery-charcoal/20 mb-12 pb-4 justify-center">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all text-xs uppercase tracking-widest ${activeTab === "profile"
                            ? "bg-gallery-black text-white"
                            : "bg-transparent text-gallery-charcoal hover:bg-gallery-charcoal/5 border border-gallery-charcoal/20"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all text-xs uppercase tracking-widest ${activeTab === "password"
                            ? "bg-gallery-black text-white"
                            : "bg-transparent text-gallery-charcoal hover:bg-gallery-charcoal/5 border border-gallery-charcoal/20"
                            }`}
                    >
                        <Lock className="w-4 h-4" />
                        Password
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="bg-white rounded-none p-10 border border-gallery-charcoal/20 space-y-10"
                    >
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group w-32 h-32">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-none border border-gallery-charcoal/20"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gallery-cream border border-gallery-charcoal/20 flex items-center justify-center">
                                        <span className="text-gallery-red font-bold text-4xl font-serif">
                                            {name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-gallery-black text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold shadow-none hover:bg-gallery-charcoal transition-colors flex items-center gap-2"
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4" />
                                        Upload Photo
                                    </>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Name
                            </label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell the world about yourself..."
                                rows={4}
                                className="w-full rounded-none border border-gallery-charcoal/30 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-gallery-red focus:ring-0 resize-none placeholder:text-gallery-charcoal/30 font-serif"
                            />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/40 mt-1">Visible on your public profile</p>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Email
                            </label>
                            <Input value={user?.email || ""} disabled className="rounded-none border-gallery-charcoal/10 bg-gallery-cream text-gallery-charcoal px-4 py-6 font-medium shadow-none cursor-not-allowed" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/40 mt-2">Email cannot be changed</p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gallery-charcoal/10">
                            <Button
                                onClick={handleProfileSave}
                                disabled={profileSaving}
                                className="bg-gallery-black hover:bg-gallery-charcoal text-white rounded-none px-8 py-6 text-xs font-bold tracking-widest uppercase transition-colors"
                            >
                                {profileSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="bg-white rounded-none p-10 border border-gallery-charcoal/20 space-y-10"
                    >
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Current Password
                            </label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                New Password
                            </label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 8 characters)"
                                className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Confirm New Password
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none"
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gallery-charcoal/10">
                            <Button
                                onClick={handlePasswordChange}
                                disabled={passwordSaving}
                                className="bg-gallery-black hover:bg-gallery-charcoal text-white rounded-none px-8 py-6 text-xs font-bold tracking-widest uppercase transition-colors"
                            >
                                {passwordSaving ? "Changing..." : "Change Password"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div >
    );
}
