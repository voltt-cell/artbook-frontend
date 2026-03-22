"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    ExternalLink,
    AlertCircle,
    CreditCard,
    ArrowLeft,
    Loader2,
    Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ConnectStatus = {
    connected: boolean;
    onboardingComplete: boolean;
    payoutEnabled: boolean;
    chargesEnabled: boolean;
    stripeAccountId: string | null;
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ConnectContent() {
    const { user, hasShop, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [onboarding, setOnboarding] = useState(false);

    const success = searchParams.get("success");
    const refresh = searchParams.get("refresh");

    const {
        data: status,
        isLoading,
        mutate,
    } = useSWR<ConnectStatus>(user && hasShop ? "/connect/status" : null, fetcher, {
        refreshInterval: success ? 3000 : 0,
    });

    useEffect(() => {
        if (success === "true") {
            toast.success("Stripe onboarding completed! Checking status...");
            mutate();
        }
        if (refresh === "true") {
            toast.info("Please complete your Stripe onboarding.");
        }
    }, [success, refresh, mutate]);

    const handleStartOnboarding = async () => {
        setOnboarding(true);
        try {
            const res = await api.post<{ url: string }>("/connect/onboard", {});
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            toast.error("Failed to start onboarding", {
                description: (error as Error).message,
            });
            setOnboarding(false);
        }
    };

    const handleRefreshLink = async () => {
        setOnboarding(true);
        try {
            const res = await api.get<{ url: string }>("/connect/onboard/refresh");
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            toast.error("Failed to refresh link", {
                description: (error as Error).message,
            });
            setOnboarding(false);
        }
    };

    if (authLoading || isLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!hasShop) {
        router.push("/shop/apply");
        return null;
    }

    // In test mode, payouts_enabled may stay false even after onboarding.
    // details_submitted (onboardingComplete) is the primary signal.
    const isComplete = status?.onboardingComplete;
    const isPartial = status?.connected && !isComplete;

    return (
        <div className="min-h-screen bg-gallery-cream">
            <div className="container mx-auto py-12 px-4 max-w-3xl">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    {/* Back */}
                    <Link
                        href="/shop/dashboard"
                        className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red transition-colors mb-10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="mb-10 border-b border-gallery-charcoal/20 pb-6">
                        <h1 className="text-4xl font-serif font-black text-gallery-black uppercase tracking-widest">
                            Stripe Connect
                        </h1>
                        <p className="text-gallery-charcoal/70 mt-2 font-serif italic text-lg tracking-wide">
                            Connect your Stripe account to receive payments directly
                        </p>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white border border-gallery-charcoal/20 p-8 md:p-10 mb-8">
                        {isComplete ? (
                            /* Fully connected */
                            <div className="text-center py-6">
                                <div className="w-20 h-20 mx-auto mb-6 bg-green-50 border-2 border-green-500 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-3">
                                    Payouts Active
                                </h2>
                                <p className="text-gallery-charcoal/70 font-serif italic text-lg mb-6 max-w-md mx-auto">
                                    Your Stripe account is fully connected. Payments from buyers
                                    will be automatically deposited to your bank account.
                                </p>
                                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-6 py-3 text-xs uppercase tracking-widest font-bold">
                                    <Shield className="w-4 h-4" />
                                    Connected: {status.stripeAccountId}
                                </div>
                            </div>
                        ) : isPartial ? (
                            /* Partially connected — needs to complete onboarding */
                            <div className="text-center py-6">
                                <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 border-2 border-amber-400 flex items-center justify-center">
                                    <AlertCircle className="w-10 h-10 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-3">
                                    Onboarding Incomplete
                                </h2>
                                <p className="text-gallery-charcoal/70 font-serif italic text-lg mb-8 max-w-md mx-auto">
                                    Your Stripe account has been created but onboarding is
                                    not complete. Please finish setting up your account.
                                </p>
                                <Button
                                    onClick={handleRefreshLink}
                                    disabled={onboarding}
                                    className="bg-gallery-black hover:bg-gallery-red text-white rounded-none h-14 px-10 uppercase tracking-widest text-xs font-bold transition-all"
                                >
                                    {onboarding ? (
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                    ) : (
                                        <ExternalLink className="w-4 h-4 mr-3" />
                                    )}
                                    Complete Onboarding
                                </Button>
                            </div>
                        ) : (
                            /* Not connected yet */
                            <div className="text-center py-6">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gallery-cream border-2 border-gallery-charcoal/20 flex items-center justify-center">
                                    <CreditCard className="w-10 h-10 text-gallery-charcoal" />
                                </div>
                                <h2 className="text-2xl font-serif font-black text-gallery-black uppercase tracking-widest mb-3">
                                    Get Paid for Your Art
                                </h2>
                                <p className="text-gallery-charcoal/70 font-serif italic text-lg mb-8 max-w-md mx-auto">
                                    Connect with Stripe to receive payments directly into your
                                    bank account when buyers purchase your artworks.
                                </p>
                                <Button
                                    onClick={handleStartOnboarding}
                                    disabled={onboarding}
                                    className="bg-gallery-black hover:bg-gallery-red text-white rounded-none h-14 px-10 uppercase tracking-widest text-xs font-bold transition-all"
                                >
                                    {onboarding ? (
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                    ) : (
                                        <ExternalLink className="w-4 h-4 mr-3" />
                                    )}
                                    Connect with Stripe
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* How it works */}
                    <div className="bg-white border border-gallery-charcoal/20 p-8 md:p-10">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-gallery-charcoal mb-6">
                            How It Works
                        </h3>
                        <div className="space-y-6">
                            {[
                                {
                                    step: "01",
                                    title: "Connect Your Account",
                                    desc: "Click the button above to set up your Stripe Express account. Stripe handles all KYC verification securely.",
                                },
                                {
                                    step: "02",
                                    title: "Sell Your Art",
                                    desc: "When a buyer purchases your artwork or wins an auction, Stripe automatically splits the payment.",
                                },
                                {
                                    step: "03",
                                    title: "Get Paid",
                                    desc: "Your earnings are deposited directly into your bank account. You can track payouts in your Stripe dashboard.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="flex items-start gap-5 pb-6 border-b border-gallery-charcoal/10 last:border-0 last:pb-0"
                                >
                                    <span className="text-3xl font-serif font-black text-gallery-red/30 flex-shrink-0 leading-none mt-1">
                                        {item.step}
                                    </span>
                                    <div>
                                        <h4 className="font-bold uppercase tracking-widest text-sm text-gallery-black mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-gallery-charcoal/60 font-serif text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ShopConnectPage() {
    return (
        <Suspense fallback={<ArtisticLoader fullScreen />}>
            <ConnectContent />
        </Suspense>
    );
}
