"use client";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/auth-context";
import { Loader2, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

export default function CartPage() {
    const { cartItems, isLoading, removeFromCart, removingIds, checkout, checkoutLoading, total } = useCart();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <div className="w-16 h-16 border border-gallery-charcoal/20 bg-white flex items-center justify-center mx-auto">
                    <Loader2 className="w-6 h-6 animate-spin text-gallery-red" />
                </div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-gallery-cream flex flex-col items-center justify-center border-t border-gallery-charcoal/20 px-4">
                <div className="text-center p-16 bg-white border border-gallery-charcoal/20 max-w-lg w-full">
                    <div className="w-16 h-16 border border-gallery-charcoal/20 bg-white flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-6 h-6 text-gallery-charcoal/30" />
                    </div>
                    <h2 className="text-3xl font-serif font-black text-gallery-black mb-4 uppercase tracking-widest">
                        Empty Collection
                    </h2>
                    <p className="font-serif italic text-gallery-charcoal/70 mb-8 max-w-sm mx-auto">
                        Your cart currently holds no masterpieces.
                    </p>
                    <Link href="/artworks">
                        <Button className="w-full bg-gallery-black hover:bg-gallery-red text-white h-14 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
                            Explore Gallery
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pb-24">
            <div className="bg-white border-b border-gallery-charcoal/20 pt-10 sm:pt-16 pb-8 sm:pb-12 mb-8 sm:mb-12 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex items-center gap-4 sm:gap-6 mb-4">
                        <Link href="/artworks" className="text-gallery-charcoal hover:text-gallery-red transition-colors border border-gallery-charcoal/20 p-2 bg-white flex-shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-gallery-black">Acquisitions Cart</h1>
                    </div>
                    <p className="font-serif italic text-gallery-charcoal/70 ml-0 sm:ml-[4.5rem]">
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} queued for purchase
                    </p>
                </div>
                {/* Decorative Line */}
                <div className="absolute bottom-0 right-1/4 w-px h-12 bg-gallery-charcoal/10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-0 border border-gallery-charcoal/20 bg-white">
                        <div className="px-8 flex items-center justify-between border-b border-gallery-charcoal/20 min-h-[4rem] bg-gallery-cream/50">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal">Selected Artworks</span>
                        </div>
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.cartItemId}
                                    layout
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 sm:p-8 border-b border-gallery-charcoal/20 last:border-b-0 hover:bg-gallery-cream/30 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                    {/* Image */}
                                    <div className="w-full sm:w-32 h-48 sm:h-32 bg-gallery-cream border border-gallery-charcoal/20 flex-shrink-0">
                                        <img
                                            src={item.artwork.imageUrl}
                                            alt={item.artwork.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                                            <div>
                                                <h3 className="font-serif text-lg sm:text-2xl font-black uppercase tracking-widest text-gallery-black mb-2">
                                                    {item.artwork.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mb-2">
                                                    {item.artist.profileImage ? (
                                                        <img
                                                            src={item.artist.profileImage}
                                                            alt={item.artist.name}
                                                            className="w-6 h-6 object-cover border border-gallery-charcoal/20"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 bg-white border border-gallery-charcoal/20 flex items-center justify-center text-[10px] font-bold text-gallery-black">
                                                            {item.artist.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal">{item.artist.name}</span>
                                                </div>
                                                <p className="text-[10px] text-gallery-charcoal/60 uppercase tracking-widest border border-gallery-charcoal/10 bg-white px-2 py-0.5 inline-block">{item.artwork.listingType}</p>
                                            </div>
                                            <div className="flex items-center sm:flex-col sm:items-end gap-4 sm:gap-4 sm:border-l border-gallery-charcoal/10 sm:pl-6 sm:ml-4">
                                                <p className="font-serif font-black text-2xl text-gallery-black">
                                                    {formatPrice(parseFloat(item.artwork.price))}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-gallery-charcoal/40 hover:text-gallery-red hover:bg-transparent rounded-none p-0 h-auto"
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    disabled={removingIds.includes(item.cartItemId)}
                                                >
                                                    {removingIds.includes(item.cartItemId) ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 border border-gallery-charcoal/20 sticky top-24">
                            <h2 className="text-xl font-serif font-black uppercase tracking-widest mb-8 text-gallery-black pb-4 border-b border-gallery-charcoal/20">Summary</h2>
                            <div className="flex justify-between items-center mb-4 text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-8 text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal">
                                <span>Tax</span>
                                <span className="text-gallery-charcoal/50">(Calculated at checkout)</span>
                            </div>
                            <div className="border-t border-gallery-charcoal/20 pt-6 flex justify-between items-end mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-gallery-black">Total</span>
                                <span className="text-3xl font-serif font-black text-gallery-black leading-none">{formatPrice(total)}</span>
                            </div>

                            <Button
                                className="w-full bg-gallery-black hover:bg-gallery-red text-white h-16 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
                                onClick={() => checkout()}
                                disabled={checkoutLoading || cartItems.length === 0}
                            >
                                {checkoutLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <ShoppingBag className="w-5 h-5 mr-3" />
                                )}
                                Secure Checkout
                            </Button>

                            <p className="text-[10px] text-center text-gallery-charcoal/50 uppercase tracking-widest mt-6 pt-6 border-t border-gallery-charcoal/10">
                                Processed securely by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
