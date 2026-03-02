"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { ArrowLeft, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

export default function ShopSettingsPage() {
    const { user, hasShop, loading, refreshUser } = useAuth();
    const router = useRouter();

    const [shopName, setShopName] = useState("");
    const [debouncedShopName] = useDebounce(shopName, 500);
    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
    const [checkingName, setCheckingName] = useState(false);
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);

    if (user && hasShop && !initialized) {
        setShopName(user.shopName || "");
        setInitialized(true);
    }

    useEffect(() => {
        if (!debouncedShopName) {
            setNameAvailable(null);
            setCheckingName(false);
            return;
        }

        // If it's the same as their current name, obviously they can keep it
        if (user && debouncedShopName === user.shopName) {
            setNameAvailable(true);
            setCheckingName(false);
            return;
        }

        const checkName = async () => {
            setCheckingName(true);
            try {
                const res = await api.get<{ available: boolean }>(`/auth/check-shop?name=${encodeURIComponent(debouncedShopName)}`);
                setNameAvailable(res.available);
            } catch (error) {
                console.error("Failed to check name", error);
                setNameAvailable(null);
            } finally {
                setCheckingName(false);
            }
        };

        checkName();
    }, [debouncedShopName, user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/auth/profile", { shopName });
            await refreshUser();
            toast.success("Shop settings updated!");
        } catch (error) {
            toast.error("Failed to update shop", {
                description: (error as Error).message,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!user || !hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gallery-cream">
            {/* Header */}
            <div className="bg-gallery-cream/80 backdrop-blur-md border-b border-gallery-charcoal/10 shadow-sm sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/shop/dashboard" className="text-gallery-charcoal/50 hover:text-gallery-red transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="font-serif text-xl font-black text-gallery-black flex items-center gap-2 uppercase tracking-widest">
                                <Store className="w-5 h-5 text-gallery-red" />
                                Shop Settings
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white rounded-none p-10 border border-gallery-charcoal/20 shadow-none space-y-10"
                >
                    <div className="border-b border-gallery-charcoal/20 pb-8">
                        <h2 className="text-3xl font-serif font-black text-gallery-black mb-2 uppercase tracking-widest">Storefront Customization</h2>
                        <p className="font-serif italic text-lg text-gallery-charcoal/70 tracking-wide">Manage the public identity of your art shop.</p>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest font-bold text-gallery-black mb-3">
                            Shop Display Name
                        </label>
                        <div className="relative max-w-lg">
                            <Input
                                value={shopName}
                                onChange={(e) => {
                                    setShopName(e.target.value);
                                    if (e.target.value !== debouncedShopName) {
                                        setCheckingName(true);
                                        setNameAvailable(null);
                                    }
                                }}
                                placeholder="e.g. Modern Canvas Studio"
                                className={`h-14 rounded-none border-gallery-charcoal/20 focus-visible:ring-1 focus-visible:ring-gallery-red focus-visible:border-gallery-red text-base pr-12 transition-all duration-300 font-serif ${nameAvailable === false ? 'border-gallery-red focus-visible:ring-gallery-red' :
                                    nameAvailable === true ? 'border-gallery-black focus-visible:ring-gallery-black' : ''
                                    }`}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                {checkingName ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-5 w-5">
                                        <div className="absolute top-0 right-0 h-5 w-5 rounded-full border-2 border-gallery-charcoal/20 border-t-gallery-black animate-spin" />
                                    </motion.div>
                                ) : nameAvailable === true ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gallery-black">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                ) : nameAvailable === false ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gallery-red">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.div>
                                ) : null}
                            </div>
                        </div>

                        <div className="h-6 mt-3">
                            {nameAvailable === false ? (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-serif italic text-gallery-red">
                                    This shop name is already taken.
                                </motion.p>
                            ) : nameAvailable === true && user?.shopName !== debouncedShopName ? (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-serif italic text-gallery-black">
                                    Beautiful! This name is available.
                                </motion.p>
                            ) : (
                                <p className="text-sm font-serif italic text-gallery-charcoal/50">
                                    This is the identity buyers will see when viewing your masterpieces.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving || nameAvailable === false}
                            className={`px-10 h-14 rounded-none uppercase tracking-widest text-xs font-bold transition-all duration-300 ${nameAvailable === false
                                ? "bg-gallery-cream text-gallery-charcoal/30 cursor-not-allowed border border-gallery-charcoal/10"
                                : "bg-gallery-black hover:bg-gallery-red text-white"
                                }`}
                        >
                            {saving ? (
                                <>
                                    <div className="mr-3 h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Gallery Settings"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
