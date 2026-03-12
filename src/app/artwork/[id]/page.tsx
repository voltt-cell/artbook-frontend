"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ShoppingBag,
    Gavel,
    Palette,
    Calendar,
    Tag,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    Loader2,
    Clock,
    Users,
    Heart,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swr";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { fadeInUp, fadeIn } from "@/lib/animations";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { StripeProvider } from "@/components/providers/stripe-provider";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Shield } from "lucide-react";

type ArtworkResponse = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    tags: string[] | null;
    dimensions: string | null;
    status: string;
    listingType: string;
    createdAt: string;
};

type ArtistResponse = {
    id: string;
    name: string;
    bio: string | null;
    profileImage: string | null;
    role: string;
};

type AuctionData = {
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        status: string;
    };
    bids: {
        id: string;
        amount: string;
        createdAt: string;
        bidderName: string;
        bidderId: string;
    }[];
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

function ArtworkDetailSkeleton() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="container mx-auto px-4 pt-6">
                <Skeleton className="h-4 w-32 rounded-none bg-gallery-charcoal/5" />
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <Skeleton className="w-full h-[600px] rounded-none bg-gallery-charcoal/5" />
                    <div className="space-y-6 pt-4">
                        <Skeleton className="h-12 w-3/4 rounded-none bg-gallery-charcoal/5" />
                        <div className="flex items-center gap-4 py-4 border-y border-gallery-charcoal/10">
                            <Skeleton className="w-12 h-12 rounded-none bg-gallery-charcoal/5" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 rounded-none bg-gallery-charcoal/5" />
                                <Skeleton className="h-3 w-20 rounded-none bg-gallery-charcoal/5" />
                            </div>
                        </div>
                        <Skeleton className="h-32 w-full rounded-none bg-gallery-charcoal/5" />
                        <Skeleton className="h-24 w-full rounded-none bg-gallery-charcoal/5" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton className="h-24 rounded-none bg-gallery-charcoal/5" />
                            <Skeleton className="h-24 rounded-none bg-gallery-charcoal/5" />
                            <Skeleton className="h-24 rounded-none bg-gallery-charcoal/5" />
                            <Skeleton className="h-24 rounded-none bg-gallery-charcoal/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArtworkDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [bidDialogOpen, setBidDialogOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [bidLoading, setBidLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

    const { addToCart, isInCart, addingIds } = useCart();
    const { isFavorite, toggleFavorite, togglingId } = useFavorites();

    const { data: artwork, isLoading } = useSWR<ArtworkResponse>(
        `/artworks/${id}`,
        fetcher
    );

    const isAuctionType = artwork?.listingType === "auction";

    const { data: auctionData, mutate: mutateAuction } = useSWR<AuctionData>(
        isAuctionType ? `/auctions/artwork/${id}` : null,
        fetcher,
        { refreshInterval: 10000 }
    );

    // Countdown timer
    useEffect(() => {
        if (!auctionData?.auction?.endTime) return;

        const updateTimer = () => {
            const end = new Date(auctionData.auction.endTime).getTime();
            const now = Date.now();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }

            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auctionData?.auction?.endTime]);

    const { data: artist } = useSWR<ArtistResponse>(
        artwork ? `/users/${artwork.artistId}` : null,
        fetcher
    );

    const isOwner = user?.id === artwork?.artistId;
    const isFav = isFavorite(id);
    const isTogglingFav = togglingId === id;
    const isAddedToCart = isInCart(id);
    const isAddingToCart = addingIds.includes(id);

    const allImages = artwork?.images?.length
        ? artwork.images
        : artwork?.imageUrl
            ? [artwork.imageUrl]
            : [];

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to purchase artwork");
            router.push("/login");
            return;
        }

        try {
            const res = await api.post<{ sessionUrl: string }>(
                "/payments/checkout",
                { artworkId: id }
            );
            window.location.href = res.sessionUrl;
        } catch (error) {
            toast.error("Purchase failed", {
                description: (error as Error).message,
            });
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to add to cart");
            router.push("/login");
            return;
        }
        addToCart(id);
    };

    const handleToggleFavorite = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to manage favorites");
            router.push("/login");
            return;
        }
        if (artwork && artist) {
            toggleFavorite(
                id,
                {
                    id: artwork.id,
                    title: artwork.title,
                    imageUrl: artwork.imageUrl,
                    artistId: artwork.artistId,
                    price: artwork.price,
                    status: artwork.status,
                    medium: artwork.medium,
                    listingType: artwork.listingType,
                },
                {
                    id: artist.id,
                    name: artist.name,
                    profileImage: artist.profileImage,
                }
            );
        } else {
            // Fallback if data not fully loaded (shouldn't happen due to loading state)
            toggleFavorite(id);
        }
    };

    const handlePlaceBid = async (paymentMethodId?: string) => {
        if (!isAuthenticated) {
            toast.error("Please log in to place a bid");
            router.push("/login");
            return;
        }
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid bid amount");
            return;
        }
        if (!paymentMethodId) {
            toast.error("Please enter your card details");
            return;
        }
        setBidLoading(true);
        try {
            const res = await api.post<{ message: string; currentBid: number; holdStatus?: string }>(
                `/auctions/artwork/${id}/bid`,
                { amount, paymentMethodId }
            );
            toast.success(res.message);
            setBidDialogOpen(false);
            setBidAmount("");
            mutateAuction();
        } catch (error) {
            toast.error("Bid failed", {
                description: (error as Error).message,
            });
        } finally {
            setBidLoading(false);
        }
    };

    const auctionEnded = timeLeft && timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;
    const livePrice = auctionData?.auction
        ? parseFloat(auctionData.auction.currentBid || auctionData.auction.startingBid)
        : null;

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);

    const nextLightbox = () =>
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    const prevLightbox = () =>
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    if (isLoading) {
        return <ArtworkDetailSkeleton />;
    }

    if (!artwork) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gallery-charcoal/70 uppercase tracking-widest font-bold text-sm">Artwork not found.</p>
                <Link href="/artworks">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Artworks
                    </Button>
                </Link>
            </div>
        );
    }

    const price = parseFloat(artwork.price);
    const isAuction = artwork.listingType === "auction";

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            {/* Back Navigation */}
            <div className="container mx-auto px-4 pt-6 mb-12">
                <Link
                    href="/artworks"
                    className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Artworks
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image Slider */}
                    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                        <div className="relative overflow-hidden rounded-none shadow-none border border-gallery-charcoal/20 bg-white">
                            {/* Main image */}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={allImages[currentSlide]}
                                    alt={`${artwork.title} - image ${currentSlide + 1}`}
                                    className="w-full h-auto max-h-[600px] object-contain cursor-zoom-in"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => openLightbox(currentSlide)}
                                />
                            </AnimatePresence>

                            {/* Zoom indicator */}
                            <button
                                onClick={() => openLightbox(currentSlide)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>

                            {/* Badges */}
                            {isAuction && (
                                <div className="absolute top-4 left-4 bg-gallery-black text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-none border border-white/20">
                                    <Gavel className="w-3.5 h-3.5 inline mr-2" />
                                    Auction
                                </div>
                            )}
                            {artwork.status === "sold" && (
                                <div className="absolute inset-0 bg-gallery-cream/80 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-gallery-red text-4xl md:text-6xl font-serif font-black tracking-widest uppercase border-4 border-gallery-red px-10 py-4 rotate-[-5deg]">
                                        SOLD
                                    </span>
                                </div>
                            )}

                            {/* Slider arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-none shadow-none border border-gallery-charcoal/20 hover:bg-white hover:text-gallery-red transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gallery-charcoal" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-none shadow-none border border-gallery-charcoal/20 hover:bg-white hover:text-gallery-red transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gallery-charcoal" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`flex-shrink-0 rounded-none overflow-hidden transition-all border ${idx === currentSlide
                                            ? "border-gallery-black p-1"
                                            : "border-gallery-charcoal/20 opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded-none"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-gallery-black uppercase tracking-widest leading-none">
                                {artwork.title}
                            </h1>
                            <div className="flex items-center gap-3 ml-6 flex-shrink-0 md:mt-2">
                                {/* Favorite Button */}
                                {isOwner ? null : (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleFavorite}
                                        disabled={isTogglingFav}
                                        className={`rounded-none h-12 w-12 border border-gallery-charcoal/20 shadow-none transition-all ${isFav ? "bg-gallery-red text-white border-gallery-red hover:bg-gallery-red/90" : "bg-transparent text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red"
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                                    </Button>
                                )}

                                {isOwner && (
                                    <Link href={`/shop/edit/${artwork.id}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-none h-12 px-6 uppercase tracking-widest text-[10px] font-bold border-gallery-charcoal/20 text-gallery-charcoal hover:bg-gallery-cream shadow-none"
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Artist Info */}
                        {artist && (
                            <Link
                                href={`/artist/${artist.id}`}
                                className="flex items-center gap-4 mb-10 group py-6 border-y border-gallery-charcoal/10"
                            >
                                <div className="w-14 h-14 rounded-none border border-gallery-charcoal/20 bg-gallery-cream flex items-center justify-center overflow-hidden">
                                    {artist.profileImage ? (
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.name}
                                            className="w-full h-full object-cover grayscale opacity-90"
                                        />
                                    ) : (
                                        <span className="text-gallery-black font-serif font-black text-2xl">
                                            {artist.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-gallery-black group-hover:text-gallery-red transition-colors">
                                        {artist.name}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-gallery-charcoal/50 tracking-widest mt-1">Artist</p>
                                </div>
                            </Link>
                        )}

                        {/* Price / Auction Panel */}
                        <div className="bg-white rounded-none p-8 md:p-10 border border-gallery-charcoal/20 mb-10 shadow-none">
                            {isAuction && timeLeft && (
                                <div className={`mb-8 p-6 rounded-none border ${auctionEnded ? 'bg-gallery-red/5 border-gallery-red' : 'bg-gallery-cream border-gallery-charcoal/10'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className={`w-4 h-4 ${auctionEnded ? 'text-gallery-red' : 'text-gallery-charcoal'}`} />
                                        <span className={`text-xs uppercase tracking-widest font-bold ${auctionEnded ? 'text-gallery-red' : 'text-gallery-charcoal'}`}>
                                            {auctionEnded ? 'Auction Ended' : 'Time Remaining'}
                                        </span>
                                    </div>
                                    {!auctionEnded && (
                                        <div className="flex gap-3">
                                            {timeLeft.d > 0 && (
                                                <div className="bg-white border border-gallery-charcoal/10 rounded-none px-4 py-3 min-w-[70px] flex flex-col items-center">
                                                    <p className="text-2xl font-serif font-black text-gallery-black">{timeLeft.d}</p>
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mt-1">Days</p>
                                                </div>
                                            )}
                                            <div className="bg-white border border-gallery-charcoal/10 rounded-none px-4 py-3 min-w-[70px] flex flex-col items-center">
                                                <p className="text-2xl font-serif font-black text-gallery-black">{String(timeLeft.h).padStart(2, '0')}</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mt-1">Hrs</p>
                                            </div>
                                            <div className="bg-white border border-gallery-charcoal/10 rounded-none px-4 py-3 min-w-[70px] flex flex-col items-center">
                                                <p className="text-2xl font-serif font-black text-gallery-black">{String(timeLeft.m).padStart(2, '0')}</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mt-1">Min</p>
                                            </div>
                                            <div className="bg-white border border-gallery-charcoal/10 rounded-none px-4 py-3 min-w-[70px] flex flex-col items-center">
                                                <p className="text-2xl font-serif font-black text-gallery-black tabular-nums">{String(timeLeft.s).padStart(2, '0')}</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mt-1">Sec</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mb-2">
                                        {isAuction ? 'Current Bid' : 'Price'}
                                    </p>
                                    <p className="text-5xl font-serif font-black text-gallery-black tracking-tight">
                                        {formatPrice(isAuction && livePrice !== null ? livePrice : price)}
                                    </p>
                                    {isAuction && auctionData?.bids && auctionData.bids.length > 0 && (
                                        <p className="text-xs font-bold text-gallery-charcoal/60 mt-3 uppercase tracking-widest">
                                            {auctionData.bids.length} bid{auctionData.bids.length !== 1 ? 's' : ''} placed
                                        </p>
                                    )}
                                </div>
                                {!isOwner && artwork.status !== 'sold' && (
                                    <div className="flex flex-col gap-3 sm:flex-row w-full lg:w-auto">
                                        {isAuction ? (
                                            <Button
                                                size="lg"
                                                className="bg-gallery-black hover:bg-gallery-red text-white flex-1 lg:flex-none rounded-none shadow-none h-[60px] uppercase text-xs tracking-widest font-bold px-8 transition-colors"
                                                disabled={!!auctionEnded}
                                                onClick={() => {
                                                    if (!isAuthenticated) {
                                                        toast.error('Please log in to place a bid');
                                                        router.push('/login');
                                                        return;
                                                    }
                                                    setBidDialogOpen(true);
                                                }}
                                            >
                                                <Gavel className="w-4 h-4 mr-3" />
                                                {auctionEnded ? 'Auction Ended' : 'Place Bid'}
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={handleAddToCart}
                                                    disabled={isAddedToCart || isAddingToCart}
                                                    className="border-gallery-charcoal/20 text-gallery-charcoal bg-transparent flex-1 lg:flex-none rounded-none shadow-none hover:bg-gallery-cream hover:text-gallery-red h-[60px] uppercase text-xs tracking-widest font-bold px-8 transition-colors"
                                                >
                                                    {isAddingToCart ? (
                                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                                    ) : (
                                                        <ShoppingCart className="w-4 h-4 mr-3" />
                                                    )}
                                                    {isAddedToCart ? "In Cart" : "Add to Cart"}
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    className="bg-gallery-black hover:bg-gallery-red text-white flex-1 lg:flex-none rounded-none shadow-none h-[60px] uppercase text-xs tracking-widest font-bold px-8 transition-colors"
                                                    onClick={handleBuyNow}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-3" />
                                                    Buy Now
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {isOwner && (
                                    <span className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal/40">
                                        Your Artwork
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bid History — for auction artworks */}
                        {isAuction && auctionData?.bids && auctionData.bids.length > 0 && (
                            <div className="bg-white rounded-none p-8 border border-gallery-charcoal/20 mb-10 shadow-none">
                                <h3 className="text-xs uppercase font-bold tracking-widest text-gallery-charcoal mb-6 flex items-center gap-3">
                                    <Users className="w-4 h-4 text-gallery-charcoal" />
                                    Bid History
                                </h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {auctionData.bids.map((bid, idx) => (
                                        <div
                                            key={bid.id}
                                            className={`flex items-center justify-between py-3 px-4 rounded-none text-sm transition-colors ${idx === 0 ? 'bg-gallery-cream border border-gallery-charcoal/10' : 'bg-transparent border border-gallery-charcoal/5 hover:bg-gallery-charcoal/5'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-none bg-gallery-black flex items-center justify-center">
                                                    <span className="text-white text-xs font-serif font-bold uppercase">
                                                        {bid.bidderName.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-gallery-charcoal">{bid.bidderName}</span>
                                                {idx === 0 && (
                                                    <span className="bg-gallery-red text-white rounded-none px-2 py-1 uppercase tracking-widest text-[8px] font-bold">
                                                        Highest
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-serif font-black text-lg text-gallery-black">{formatPrice(parseFloat(bid.amount))}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal/40">
                                                    {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-10">
                            <h2 className="text-xs uppercase font-bold tracking-widest text-gallery-charcoal mb-4">Description</h2>
                            <p className="text-gallery-charcoal/80 font-serif text-lg leading-relaxed border-l-2 border-gallery-charcoal/20 pl-6">
                                {artwork.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {artwork.tags && artwork.tags.length > 0 && (
                            <div className="mb-10 flex flex-wrap gap-3">
                                {artwork.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block px-4 py-2 bg-transparent border border-gallery-charcoal/20 text-gallery-charcoal rounded-none text-[10px] tracking-widest uppercase font-bold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gallery-cream/50 rounded-none p-6 border border-gallery-charcoal/20">
                                <div className="flex items-center gap-3 text-gallery-charcoal/60 mb-2">
                                    <Palette className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                                        Medium
                                    </span>
                                </div>
                                <p className="font-serif font-black text-lg text-gallery-black">{artwork.medium}</p>
                            </div>
                            <div className="bg-gallery-cream/50 rounded-none p-6 border border-gallery-charcoal/20">
                                <div className="flex items-center gap-3 text-gallery-charcoal/60 mb-2">
                                    <Tag className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">Type</span>
                                </div>
                                <p className="font-serif font-black text-lg text-gallery-black capitalize">
                                    {artwork.listingType === "fixed" ? "Fixed Price" : "Auction"}
                                </p>
                            </div>
                            {artwork.dimensions && (
                                <div className="bg-gallery-cream/50 rounded-none p-6 border border-gallery-charcoal/20">
                                    <div className="flex items-center gap-3 text-gallery-charcoal/60 mb-2">
                                        <ZoomIn className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                                            Dimensions
                                        </span>
                                    </div>
                                    <p className="font-serif font-black text-lg text-gallery-black">{artwork.dimensions}</p>
                                </div>
                            )}
                            <div className="bg-gallery-cream/50 rounded-none p-6 border border-gallery-charcoal/20">
                                <div className="flex items-center gap-3 text-gallery-charcoal/60 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                                        Listed
                                    </span>
                                </div>
                                <p className="font-serif font-black text-lg text-gallery-black">
                                    {new Date(artwork.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="bg-gallery-cream/50 rounded-none p-6 border border-gallery-charcoal/20">
                                <div className="flex items-center gap-3 text-gallery-charcoal/60 mb-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                                        Status
                                    </span>
                                </div>
                                <p className="font-serif font-black text-lg text-gallery-black capitalize">{artwork.status}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none flex items-center justify-center">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.img
                            key={lightboxIndex}
                            src={allImages[lightboxIndex]}
                            alt={`${artwork.title} - fullsize ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={prevLightbox}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextLightbox}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bid Dialog with Stripe Elements */}
            <StripeProvider>
                <BidDialog
                    open={bidDialogOpen}
                    onOpenChange={setBidDialogOpen}
                    livePrice={livePrice}
                    price={price}
                    timeLeft={timeLeft}
                    auctionEnded={auctionEnded ?? undefined}
                    bidAmount={bidAmount}
                    setBidAmount={setBidAmount}
                    bidLoading={bidLoading}
                    onPlaceBid={handlePlaceBid}
                />
            </StripeProvider>
        </div>
    );
}

/** Separate component so useStripe() / useElements() work inside StripeProvider */
function BidDialog({
    open,
    onOpenChange,
    livePrice,
    price,
    timeLeft,
    auctionEnded,
    bidAmount,
    setBidAmount,
    bidLoading,
    onPlaceBid,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    livePrice: number | null;
    price: number;
    timeLeft: { d: number; h: number; m: number; s: number } | null;
    auctionEnded: boolean | undefined;
    bidAmount: string;
    setBidAmount: (v: string) => void;
    bidLoading: boolean;
    onPlaceBid: (paymentMethodId?: string) => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState<string | null>(null);
    const [cardComplete, setCardComplete] = useState(false);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setCardError(error.message || "Card error");
            return;
        }

        setCardError(null);
        onPlaceBid(paymentMethod.id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-none border border-gallery-charcoal/20 bg-white p-8">
                <DialogTitle className="font-serif text-2xl font-black uppercase tracking-widest text-gallery-black border-b border-gallery-charcoal/10 pb-4">Place a Bid</DialogTitle>
                <div className="space-y-6 mt-4">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal/50 mb-1">Current Bid</p>
                        <p className="text-4xl font-serif font-black text-gallery-black tracking-tight">{formatPrice(livePrice ?? price)}</p>
                    </div>
                    {timeLeft && !auctionEnded && (
                        <div className="flex items-center gap-2 bg-gallery-cream px-4 py-3 border border-gallery-charcoal/10">
                            <Clock className="w-4 h-4 text-gallery-red" />
                            <span className="text-gallery-red font-bold text-[10px] uppercase tracking-widest">
                                {timeLeft.d > 0 ? `${timeLeft.d}d ` : ''}
                                {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')} remaining
                            </span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="bid-amount" className="text-xs font-bold uppercase tracking-widest text-gallery-charcoal block mb-3">
                            Your Bid (must be higher)
                        </label>
                        <Input
                            id="bid-amount"
                            type="number"
                            step="0.01"
                            min={((livePrice ?? price) + 0.01).toFixed(2)}
                            placeholder={`Min $${((livePrice ?? price) + 1).toFixed(2)}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-gallery-charcoal/30 bg-transparent px-0 pb-2 focus-visible:ring-0 focus-visible:border-gallery-red shadow-none text-2xl font-serif font-black placeholder:text-gallery-charcoal/20"
                        />
                    </div>
                    {/* Card Details */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gallery-charcoal block mb-3">
                            Card Details
                        </label>
                        <div className="border border-gallery-charcoal/20 p-4 bg-gallery-cream/30">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            fontFamily: '"DM Serif Display", Georgia, serif',
                                            color: "#1a1a1a",
                                            "::placeholder": {
                                                color: "rgba(26, 26, 26, 0.3)",
                                            },
                                        },
                                        invalid: {
                                            color: "#c0392b",
                                        },
                                    },
                                }}
                                onChange={(e) => {
                                    setCardComplete(e.complete);
                                    if (e.error) setCardError(e.error.message);
                                    else setCardError(null);
                                }}
                            />
                        </div>
                        {cardError && (
                            <p className="text-gallery-red text-xs mt-2 font-bold">{cardError}</p>
                        )}
                    </div>
                    {/* Hold info */}
                    <div className="flex items-start gap-3 bg-gallery-cream/50 border border-gallery-charcoal/10 p-4">
                        <Shield className="w-4 h-4 text-gallery-charcoal/50 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50 leading-relaxed">
                            Your card will be authorized (held), not charged. Funds are only captured if you win. If outbid, the hold is released immediately.
                        </p>
                    </div>
                    <Button
                        className="w-full bg-gallery-black hover:bg-gallery-red text-white flex-1 lg:flex-none rounded-none shadow-none h-14 uppercase text-xs tracking-widest font-bold px-8 transition-colors mt-4"
                        onClick={handleSubmit}
                        disabled={bidLoading || !stripe || !cardComplete}
                    >
                        {bidLoading ? (
                            <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                        ) : (
                            <Gavel className="w-4 h-4 mr-3" />
                        )}
                        {bidLoading ? "Authorizing..." : `Confirm Bid${bidAmount ? ` — ${formatPrice(parseFloat(bidAmount) || 0)}` : ""}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
