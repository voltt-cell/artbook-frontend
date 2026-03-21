"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { api } from "@/lib/api";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"verifying" | "success" | "error">(
        sessionId ? "verifying" : "error"
    );
    const [errorMessage, setErrorMessage] = useState("We could not verify this checkout session.");

    useEffect(() => {
        let cancelled = false;

        async function verifySession() {
            if (!sessionId) {
                setStatus("error");
                return;
            }

            setStatus("verifying");
            try {
                await api.get(`/payments/verify-session?session_id=${sessionId}`);
                if (!cancelled) {
                    clearCart();
                    setStatus("success");
                }
            } catch (err) {
                if (!cancelled) {
                    setStatus("error");
                    setErrorMessage(err instanceof Error ? err.message : "Verification failed");
                }
            }
        }

        verifySession();

        return () => {
            cancelled = true;
        };
    }, [sessionId, clearCart]);

    if (!sessionId) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream px-4">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-lg w-full">
                    <h1 className="text-2xl font-serif font-black text-gallery-black mb-6 uppercase tracking-widest">Invalid Session</h1>
                    <Link href="/">
                        <Button className="w-full bg-gallery-black hover:bg-gallery-red text-white h-12 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">Return to Gallery</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "verifying") {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream px-4">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-xl w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gallery-red mx-auto mb-6" />
                    <h1 className="text-2xl font-serif font-black text-gallery-black mb-4 uppercase tracking-widest">
                        Verifying Payment
                    </h1>
                    <p className="text-gallery-charcoal/70">
                        We&apos;re confirming your order with Stripe before marking it complete.
                    </p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream px-4">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-xl w-full">
                    <AlertCircle className="h-8 w-8 text-gallery-red mx-auto mb-6" />
                    <h1 className="text-2xl font-serif font-black text-gallery-black mb-4 uppercase tracking-widest">
                        Verification Needed
                    </h1>
                    <p className="text-gallery-charcoal/70 mb-8">
                        {errorMessage}
                    </p>
                    <div className="space-y-4">
                        <Link href="/buyer/dashboard">
                            <Button className="w-full bg-gallery-black hover:bg-gallery-red text-white h-12 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
                                View Orders
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="w-full bg-white hover:bg-gallery-cream text-gallery-black border border-gallery-charcoal/20 h-12 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream flex flex-col items-center justify-center border-t border-gallery-charcoal/20 px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white border border-gallery-charcoal/20 p-12 md:p-16 text-center"
            >
                <div className="mx-auto flex items-center justify-center h-20 w-20 border border-green-800/20 bg-green-50/50 mb-8 mt-4">
                    <CheckCircle className="h-8 w-8 text-green-800" />
                </div>

                <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal mb-6">
                    Transaction Complete
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-black text-gallery-black mb-6 uppercase tracking-widest leading-tight">
                    Acquisition<br />Successful
                </h2>

                <p className="font-serif italic text-gallery-charcoal/80 mb-12 text-lg max-w-md mx-auto">
                    Thank you, collector. Your order has been confirmed and the artwork is now securely yours.
                </p>

                <div className="space-y-4 max-w-sm mx-auto">
                    <Link href="/buyer/dashboard">
                        <Button className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-between px-6">
                            View Collection <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/artworks">
                        <Button variant="outline" className="w-full bg-white hover:bg-gallery-cream text-gallery-black border border-gallery-charcoal/20 h-14 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
                            Continue Exploring
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
