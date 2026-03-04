"use client";

import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export function CartBadge() {
    const { cartItems } = useCart();
    const count = cartItems?.length || 0;

    return (
        <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group hover:bg-gallery-cream text-gallery-charcoal rounded-none shadow-none">
                <ShoppingCart className="w-5 h-5 group-hover:text-gallery-red transition-colors" />
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-gallery-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-none"
                        >
                            {count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </Link>
    );
}
