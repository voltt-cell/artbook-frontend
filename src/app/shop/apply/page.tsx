"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, Sparkles, ArrowRight, Paintbrush, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ApplicationStatus = {
    id: string;
    status: "pending" | "approved" | "rejected";
    shopName: string;
    adminNotes?: string;
};

const ART_MEDIUMS = [
    "Painting",
    "Digital Art",
    "Photography",
    "Sculpture",
    "Mixed Media",
    "Illustration",
    "Other"
];

const EXPERIENCE_LEVELS = [
    "Just starting out",
    "1-3 years (Hobbyist)",
    "3-5 years (Emerging)",
    "5+ years (Professional)"
];

export default function ShopApplyPage() {
    const { isAuthenticated, loading: authLoading, hasShop } = useAuth();
    const router = useRouter();

    const [shopName, setShopName] = useState("");
    const [medium, setMedium] = useState("");
    const [experience, setExperience] = useState("");
    const [vision, setVision] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");

    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
    const [checkingName, setCheckingName] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [existingApp, setExistingApp] = useState<ApplicationStatus | null>(null);
    const [loadingApp, setLoadingApp] = useState(true);

    // Check for existing application
    useEffect(() => {
        if (isAuthenticated) {
            api.get<{ application: ApplicationStatus | null }>("/shop/my-application")
                .then((res) => setExistingApp(res.application))
                .catch(() => { })
                .finally(() => setLoadingApp(false));
        } else {
            setLoadingApp(false);
        }
    }, [isAuthenticated]);

    // Debounced name availability check
    const checkNameAvailability = useCallback(async (name: string) => {
        if (name.length < 2) {
            setNameAvailable(null);
            return;
        }
        setCheckingName(true);
        try {
            const res = await api.get<{ available: boolean }>(`/shop/check-name?name=${encodeURIComponent(name)}`);
            setNameAvailable(res.available);
        } catch {
            setNameAvailable(null);
        } finally {
            setCheckingName(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (shopName.trim().length >= 2) {
                checkNameAvailability(shopName.trim());
            } else {
                setNameAvailable(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [shopName, checkNameAvailability]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameAvailable) {
            toast.error("Please choose an available shop name");
            return;
        }

        if (!medium || !experience) {
            toast.error("Please select your medium and experience level");
            return;
        }

        setSubmitting(true);

        // Bundle extra info into the description field since DB schema expects strings
        const bundledDescription = `Primary Medium: ${medium}\nExperience Level: ${experience}\n\nArtistic Vision & Background:\n${vision}`;

        try {
            await api.post("/shop/apply", {
                shopName: shopName.trim(),
                shopDescription: bundledDescription,
                portfolioUrl: portfolioUrl || undefined,
            });
            toast.success("Application submitted!");
            // Refresh to show pending state
            const res = await api.get<{ application: ApplicationStatus | null }>("/shop/my-application");
            setExistingApp(res.application);
        } catch (error) {
            toast.error("Failed to submit", {
                description: (error as Error).message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loadingApp) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gallery-cream">
                <div className="w-16 h-16 border border-gallery-charcoal/20 bg-white flex items-center justify-center mx-auto">
                    <Loader2 className="h-6 w-6 animate-spin text-gallery-red" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    if (hasShop) {
        router.push("/shop/dashboard");
        return null;
    }

    // Existing Application View
    const renderApplicationStatus = () => (
        <div className="flex-1 flex items-center justify-center p-8 bg-gallery-cream h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-white rounded-none p-10 border border-gallery-charcoal/20 shadow-none text-center relative overflow-hidden"
            >
                {existingApp?.status === "pending" && (
                    <>
                        <div className="mx-auto w-20 h-20 bg-gallery-cream flex border border-gallery-charcoal/20 items-center justify-center mb-6">
                            <Clock className="h-10 w-10 text-gallery-charcoal" />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-gallery-black mb-3 uppercase tracking-widest">
                            Application Under Review
                        </h2>
                        <p className="text-gallery-charcoal/70 mb-8 max-w-sm mx-auto font-serif italic text-lg leading-relaxed">
                            Your application for <span className="font-bold text-gallery-red not-italic font-sans uppercase tracking-widest text-xs">&quot;{existingApp.shopName}&quot;</span> is currently being reviewed by our curation team.
                        </p>
                        <div className="p-4 bg-gallery-cream text-xs uppercase tracking-widest text-gallery-charcoal font-bold border border-gallery-charcoal/20 border-l-4 border-l-gallery-red text-left">
                            We&apos;ll notify you via email as soon as a decision is made. Thank you for your patience.
                        </div>
                    </>
                )}
                {existingApp?.status === "rejected" && (
                    <>
                        <div className="mx-auto w-20 h-20 bg-gallery-cream border border-gallery-charcoal/20 flex items-center justify-center mb-6">
                            <XCircle className="h-10 w-10 text-gallery-red" />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-gallery-black mb-3 uppercase tracking-widest">
                            Application Not Approved
                        </h2>
                        <p className="text-gallery-charcoal/70 mb-6 max-w-sm mx-auto font-serif italic text-lg leading-relaxed">
                            Unfortunately, your application was not approved at this time.
                        </p>
                        {existingApp.adminNotes && (
                            <div className="bg-gallery-cream text-gallery-charcoal text-sm p-5 border border-gallery-charcoal/20 mb-8 text-left font-serif">
                                <span className="font-bold block mb-1 uppercase tracking-widest font-sans text-xs text-gallery-red">Feedback from our team:</span>
                                {existingApp.adminNotes}
                            </div>
                        )}
                        <Button
                            onClick={() => setExistingApp(null)}
                            className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none uppercase tracking-widest text-xs font-bold transition-colors"
                        >
                            Start New Application
                        </Button>
                    </>
                )}
                {existingApp?.status === "approved" && (
                    <>
                        <div className="mx-auto w-20 h-20 bg-gallery-cream flex border border-gallery-charcoal/20 items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-gallery-black" />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-gallery-black mb-3 uppercase tracking-widest">
                            Welcome to ArtBook
                        </h2>
                        <p className="text-gallery-charcoal/70 mb-8 max-w-sm mx-auto font-serif italic text-lg leading-relaxed">
                            Your shop <span className="font-bold text-gallery-red not-italic font-sans uppercase tracking-widest text-xs">&quot;{existingApp.shopName}&quot;</span> has been successfully verified! You&apos;re ready to start selling.
                        </p>
                        <Button
                            onClick={() => router.push("/shop/dashboard")}
                            className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none uppercase tracking-widest text-xs font-bold transition-colors"
                        >
                            Go to My Shop <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );

    // Form View
    const renderApplicationForm = () => (
        <div className="flex flex-col flex-1 h-full overflow-y-auto bg-gallery-cream">
            <div className="flex-1 w-full max-w-2xl mx-auto py-12 px-6 sm:px-12 flex flex-col justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="mb-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white justify-center w-14 h-14 rounded-none mb-6">
                            <Sparkles className="h-7 w-7 text-gallery-black" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-serif font-black text-gallery-black uppercase tracking-widest mb-4">
                            Open Your Shop
                        </h1>
                        <p className="text-gallery-charcoal/70 font-serif italic text-lg max-w-md">
                            Join our community of verified artists and start selling your masterpieces directly to collectors.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 border border-gallery-charcoal/20 shadow-none relative">
                        {/* 1. Shop Name */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal">
                                Artistic Identity / Shop Name <span className="text-gallery-red">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="e.g. Monet Studios"
                                    className="h-14 bg-white border-gallery-charcoal/20 focus-visible:ring-0 focus-visible:border-gallery-red pr-10 rounded-none shadow-none text-base"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <AnimatePresence mode="wait">
                                        {checkingName && (
                                            <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <Loader2 className="h-5 w-5 animate-spin text-gallery-red" />
                                            </motion.div>
                                        )}
                                        {!checkingName && nameAvailable === true && (
                                            <motion.div key="available" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            </motion.div>
                                        )}
                                        {!checkingName && nameAvailable === false && (
                                            <motion.div key="taken" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {!checkingName && nameAvailable === false && (
                                <p className="text-xs text-gallery-red font-bold uppercase tracking-widest mt-2 block">This name is already claimed by another artist.</p>
                            )}
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold">Your unique public identifier inside the ArtBook ecosystem.</p>
                        </div>

                        {/* 2. Medium & Experience Split */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Primary Medium */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal">
                                    Primary Medium <span className="text-gallery-red">*</span>
                                </label>
                                <Select value={medium} onValueChange={setMedium} required>
                                    <SelectTrigger className="h-14 rounded-none bg-white border-gallery-charcoal/20 focus:ring-0 focus:border-gallery-red shadow-none">
                                        <SelectValue placeholder="Select medium" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-gallery-charcoal/20">
                                        {ART_MEDIUMS.map((m) => (
                                            <SelectItem key={m} value={m} className="font-serif hover:bg-gallery-cream focus:bg-gallery-cream">{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Experience Level */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal">
                                    Experience Level <span className="text-gallery-red">*</span>
                                </label>
                                <Select value={experience} onValueChange={setExperience} required>
                                    <SelectTrigger className="h-14 rounded-none bg-white border-gallery-charcoal/20 focus:ring-0 focus:border-gallery-red shadow-none">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-gallery-charcoal/20">
                                        {EXPERIENCE_LEVELS.map((e) => (
                                            <SelectItem key={e} value={e} className="font-serif hover:bg-gallery-cream focus:bg-gallery-cream">{e}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* 3. Artistic Vision */}
                        <div className="space-y-3 flex flex-col">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal">
                                Artistic Vision & Background <span className="text-gallery-red">*</span>
                            </label>
                            <Textarea
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                placeholder="Describe your creative process, your inspirations, and the themes you explore in your work. This helps our curation team understand your profile."
                                rows={5}
                                className="resize-none rounded-none bg-white border-gallery-charcoal/20 focus-visible:ring-0 focus-visible:border-gallery-red p-4 shadow-none font-serif leading-relaxed"
                                required
                                minLength={20}
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gallery-charcoal/50 mt-2 font-bold">
                                <span>Minimum 20 characters</span>
                                <span>{vision.length}/500</span>
                            </div>
                        </div>

                        {/* 4. Portfolio URL */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gallery-charcoal">
                                External Portfolio <span className="text-gallery-charcoal/40 font-normal lowercase">(optional)</span>
                            </label>
                            <Input
                                value={portfolioUrl}
                                onChange={(e) => setPortfolioUrl(e.target.value)}
                                placeholder="https://instagram.com/yourhandle"
                                type="url"
                                className="h-14 bg-white border-gallery-charcoal/20 focus-visible:ring-0 focus-visible:border-gallery-red rounded-none shadow-none text-base"
                            />
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold">Link to your Instagram, Behance, or personal website.</p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <Button
                                type="submit"
                                disabled={submitting || !nameAvailable || vision.length < 20 || !medium || !experience}
                                className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 uppercase tracking-widest text-xs font-bold rounded-none transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting Application...
                                    </>
                                ) : (
                                    <>
                                        <Paintbrush className="mr-2 h-4 w-4" />
                                        Submit for Verification
                                    </>
                                )}
                            </Button>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-center text-gallery-charcoal/50 mt-6 leading-relaxed">
                                Our curation team reviews all applications to maintain platform quality. You&apos;ll hear back within 24 hours.
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
            {/* Custom scrollbar styles can be added in globals.css, but standard scrollbar works */}
        </div>
    );

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-gallery-cream">
            {/* Split Screen Left Side - Artistic Visual */}
            <div className="hidden lg:flex flex-col relative w-[45%] bg-gallery-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/art_apply.jpg"
                        alt="Art Inspiration"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-16 pb-24 border-r border-white/20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <Quote className="w-12 h-12 text-gallery-red mb-8 opacity-80" />
                        <h2 className="text-5xl font-serif font-black text-white leading-[1.1] mb-6 uppercase tracking-wider">
                            &quot;Art washes away from the soul the dust of everyday life.&quot;
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-gallery-red" />
                            <p className="text-xl text-white font-serif italic tracking-wide">— Pablo Picasso</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Split Screen Right Side - Content */}
            <div className="flex flex-col w-full lg:w-[55%] relative">
                {existingApp ? renderApplicationStatus() : renderApplicationForm()}
            </div>
        </div>
    );
}
