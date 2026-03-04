"use client";

import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream flex flex-col items-center justify-center border-t border-gallery-charcoal/20 px-4 py-20">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="max-w-xl w-full bg-white border border-gallery-charcoal/20 p-12 md:p-16 text-center"
            >
                <div className="mx-auto flex items-center justify-center h-20 w-20 border border-gallery-red/20 bg-gallery-red/5 mb-8 mt-4">
                    <XCircle className="h-8 w-8 text-gallery-red" />
                </div>

                <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal mb-6">
                    Transaction Cancelled
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-black text-gallery-black mb-6 uppercase tracking-widest leading-tight">
                    Acquisition<br />Halted
                </h2>

                <p className="font-serif italic text-gallery-charcoal/80 mb-12 text-lg max-w-md mx-auto">
                    The transaction process was interrupted. No funds were collected and your cart remains intact.
                </p>

                <div className="space-y-4 max-w-sm mx-auto">
                    <Link href="/cart">
                        <Button className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center px-6">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Cart
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
