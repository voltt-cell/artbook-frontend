"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, X, ImagePlus, ArrowLeft } from "lucide-react";
import { ART_CATEGORIES, AUCTION_DURATIONS } from "@/lib/constants";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function CreateArtworkPage() {
    const router = useRouter();
    const { hasShop, user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [medium, setMedium] = useState(""); // This will now store the Category ID
    const [dimensions, setDimensions] = useState("");
    const [listingType, setListingType] = useState("fixed");
    const [auctionDuration, setAuctionDuration] = useState("60");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<{ url: string; uploading: boolean }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            setUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

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
                const fullUrl = `${API_URL}${url}`;
                setImages((prev) => [...prev, { url: fullUrl, uploading: false }]);
            } catch (error) {
                toast.error(`Failed to upload ${file.name}`, {
                    description: (error as Error).message,
                });
            }
        }
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length < 3) {
            toast.error("Please upload at least 3 images");
            return;
        }

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (!medium) {
            toast.error("Category is required");
            return;
        }

        setLoading(true);
        try {
            await api.post("/artworks", {
                title,
                description,
                price: parseFloat(price) || 0,
                medium, // Sending category ID as medium
                images: images.map((img) => img.url),
                tags,
                dimensions: dimensions || undefined,
                listingType,
                ...(listingType === "auction" ? { auctionDurationMinutes: parseInt(auctionDuration) } : {}),
            });
            mutate(`/artworks?artistId=${user?.id}`);
            toast.success("Artwork published!", {
                description: "Your masterpiece is now live.",
            });
            router.push("/shop/dashboard");
        } catch (error: unknown) {
            const msg = (error as Error).message;
            toast.error("Failed to create artwork", {
                description: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!hasShop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gallery-cream">
                <div className="text-center p-12 border border-gallery-charcoal/20 bg-white">
                    <h1 className="text-2xl font-serif font-black uppercase tracking-widest text-gallery-black mb-4">Artist Access Required</h1>
                    <p className="text-gallery-charcoal/70 mb-8 italic font-serif">Only verified artists can publish artworks.</p>
                    <Link href="/">
                        <Button className="h-14 px-8 rounded-none bg-gallery-black hover:bg-gallery-red text-white font-bold uppercase tracking-widest text-xs transition-colors">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gallery-cream flex flex-col lg:flex-row">
            {/* Left Split Screen - Artistic Image */}
            <div className="hidden lg:flex w-1/3 min-h-screen relative fixed top-0 left-0">
                <div className="absolute inset-0 z-0 bg-gallery-black">
                    <img
                        src="/images/studio_create.jpg"
                        alt="Studio Space"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full p-12 w-full text-white">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors self-start"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Studio
                    </button>

                    <div className="mt-auto mb-12">
                        <h1 className="font-serif text-5xl font-black uppercase tracking-widest leading-[1.1] mb-6">
                            Publish<br />
                            <span className="text-white/40">Artwork</span>
                        </h1>
                        <div className="w-12 h-1 bg-gallery-red mb-6" />
                        <p className="text-white/70 italic font-serif text-xl border-l-2 border-gallery-red pl-4">
                            &quot;Every artist was first an amateur. The more you paint, the more you become.&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="w-full lg:w-2/3 lg:ml-auto">
                {/* Mobile Header */}
                <div className="lg:hidden w-full bg-white border-b border-gallery-charcoal/20 pt-16 pb-12 mb-8 relative">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gallery-charcoal hover:text-gallery-red transition-colors mb-8 border border-gallery-charcoal/20 p-2 bg-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Studio
                        </button>
                        <h1 className="font-serif text-4xl font-black uppercase tracking-widest text-gallery-black mb-4">
                            Publish <span className="text-gallery-charcoal/40">Artwork</span>
                        </h1>
                    </div>
                </div>

                {/* Form Container */}
                <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-12 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 md:p-12 border border-gallery-charcoal/20">

                            {/* Detailed Info Section */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20 relative">
                                        Artwork Details
                                        <span className="absolute bottom-[-1px] left-0 w-12 h-px bg-gallery-red"></span>
                                    </h3>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Title *</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Sunset in Tuscany"
                                        className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none"
                                        required
                                    />
                                </div>

                                {/* Category & Dimensions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Category *</label>
                                        <Select value={medium} onValueChange={setMedium} required>
                                            <SelectTrigger className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus:ring-gallery-charcoal focus:ring-offset-0 rounded-none">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none border-gallery-charcoal/20">
                                                {ART_CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id} className="cursor-pointer hover:bg-gallery-cream rounded-none focus:bg-gallery-cream">
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Dimensions</label>
                                        <Input
                                            value={dimensions}
                                            onChange={(e) => setDimensions(e.target.value)}
                                            placeholder="e.g. 24x36 inches"
                                            className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Description *</label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell the story behind your artwork..."
                                        rows={5}
                                        className="border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none resize-none p-4"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Tags</label>
                                    <div className="flex gap-2 mb-4 flex-wrap min-h-[48px] p-2 border border-gallery-charcoal/20 bg-gallery-cream/30 rounded-none">
                                        {tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center bg-white border border-gallery-charcoal/20 text-[10px] font-bold uppercase tracking-widest text-gallery-black px-3 py-1.5 rounded-none">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gallery-charcoal/50 hover:text-gallery-red transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                        {tags.length === 0 && <span className="text-xs italic text-gallery-charcoal/40 font-serif flex items-center px-2">No tags added</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Add tag and press Enter"
                                            className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none flex-1"
                                        />
                                        <Button type="button" variant="outline" onClick={addTag} className="h-12 rounded-none border-gallery-charcoal/20 font-bold uppercase tracking-widest text-[10px]">Add</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gallery-charcoal/10" />

                            {/* Media Section */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20 relative">
                                        Visual Presentation
                                        <span className="absolute bottom-[-1px] left-0 w-12 h-px bg-gallery-red"></span>
                                    </h3>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-4">
                                        Upload Images * <span className="text-xs font-normal font-serif italic text-gallery-charcoal/50 normal-case tracking-normal ml-2">(Min 3 required)</span>
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group aspect-square rounded-none overflow-hidden border border-gallery-charcoal/20 bg-gallery-cream">
                                                <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-white border border-gallery-charcoal/20 text-gallery-black p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gallery-red hover:border-gallery-red rounded-none"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gallery-black/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest text-center py-2">
                                                        Cover Image
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="aspect-square border border-dashed border-gallery-charcoal/30 bg-gallery-cream/50 flex flex-col items-center justify-center text-gallery-charcoal/50 hover:border-gallery-charcoal hover:text-gallery-charcoal transition-colors cursor-pointer rounded-none"
                                        >
                                            {uploadingImage ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <ImagePlus className="w-6 h-6 mb-2" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gallery-charcoal/10" />

                            {/* Pricing & Listing Section */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20 relative">
                                        Curation & Pricing
                                        <span className="absolute bottom-[-1px] left-0 w-12 h-px bg-gallery-red"></span>
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Listing Type</label>
                                    <RadioGroup value={listingType} onValueChange={setListingType} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`relative flex items-center space-x-3 border p-6 cursor-pointer transition-all ${listingType === 'fixed' ? 'border-gallery-black bg-gallery-black text-white' : 'border-gallery-charcoal/20 hover:border-gallery-charcoal bg-white text-gallery-black'}`}>
                                            <RadioGroupItem value="fixed" id="fixed" className={listingType === 'fixed' ? 'border-white text-white' : ''} />
                                            <label htmlFor="fixed" className="flex-1 cursor-pointer">
                                                <span className="block font-bold uppercase tracking-widest text-xs mb-1">Fixed Price</span>
                                                <span className={`block text-[10px] font-serif italic ${listingType === 'fixed' ? 'text-white/70' : 'text-gallery-charcoal/50'}`}>Instant purchase for a set amount</span>
                                            </label>
                                        </div>
                                        <div className={`relative flex items-center space-x-3 border p-6 cursor-pointer transition-all ${listingType === 'auction' ? 'border-gallery-black bg-gallery-black text-white' : 'border-gallery-charcoal/20 hover:border-gallery-charcoal bg-white text-gallery-black'}`}>
                                            <RadioGroupItem value="auction" id="auction" className={listingType === 'auction' ? 'border-white text-white' : ''} />
                                            <label htmlFor="auction" className="flex-1 cursor-pointer">
                                                <span className="block font-bold uppercase tracking-widest text-xs mb-1">Auction</span>
                                                <span className={`block text-[10px] font-serif italic ${listingType === 'auction' ? 'text-white/70' : 'text-gallery-charcoal/50'}`}>Bidding war for a set duration</span>
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                            {listingType === "auction" ? "Starting Bid ($)" : "Price ($)"} *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gallery-charcoal/50 font-serif">$</span>
                                            <Input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="pl-8 h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none text-lg font-serif"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {listingType === "auction" && (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">Duration *</label>
                                            <Select value={auctionDuration} onValueChange={setAuctionDuration}>
                                                <SelectTrigger className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus:ring-gallery-charcoal focus:ring-offset-0 rounded-none">
                                                    <SelectValue placeholder="Select Duration" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-gallery-charcoal/20">
                                                    {AUCTION_DURATIONS.map((dur) => (
                                                        <SelectItem key={dur.value} value={dur.value} className="cursor-pointer hover:bg-gallery-cream rounded-none focus:bg-gallery-cream">
                                                            {dur.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-12 flex flex-col sm:flex-row justify-end gap-6 border-t border-gallery-charcoal/20">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                    className="h-14 px-8 rounded-none border-gallery-charcoal/20 font-bold uppercase tracking-widest text-xs hover:bg-gallery-cream"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || images.length < 3 || !title || !price || !medium}
                                    className="h-14 px-12 rounded-none bg-gallery-black hover:bg-gallery-red text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-none"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    {loading ? "Publishing..." : "Publish Masterpiece"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
