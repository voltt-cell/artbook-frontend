"use client";

import { use, useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { fetcher } from "@/lib/swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, X, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

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
};

export default function EditArtworkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { user, hasShop } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: artwork, isLoading } = useSWR<ArtworkResponse>(
        `/artworks/${id}`,
        fetcher
    );

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [medium, setMedium] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [listingType, setListingType] = useState("fixed");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<{ url: string; uploading: boolean }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Populate form when artwork data loads
    useEffect(() => {
        if (artwork && !initialized) {
            setTitle(artwork.title);
            setDescription(artwork.description);
            setPrice(artwork.price);
            setMedium(artwork.medium);
            setDimensions(artwork.dimensions || "");
            setListingType(artwork.listingType);
            setTags(artwork.tags || []);
            setImages(
                (artwork.images || (artwork.imageUrl ? [artwork.imageUrl] : [])).map(
                    (url) => ({ url, uploading: false })
                )
            );
            setInitialized(true);
        }
    }, [artwork, initialized]);

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

        if (description.length < 10) {
            toast.error("Description must be at least 10 characters");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/artworks/${id}`, {
                title,
                description,
                price: parseFloat(price) || 0,
                medium,
                images: images.map((img) => img.url),
                tags,
                dimensions: dimensions || undefined,
                listingType,
            });
            toast.success("Artwork updated successfully!");
            router.push(`/artwork/${id}`);
        } catch (error) {
            toast.error("Failed to update artwork", {
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!hasShop) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <p className="text-gallery-charcoal font-serif italic text-lg">Only artists can edit artworks.</p>
            </div>
        );
    }

    if (isLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!artwork) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <p className="text-gallery-charcoal font-serif italic text-lg">Artwork not found.</p>
            </div>
        );
    }

    if (artwork.artistId !== user?.id) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gallery-cream">
                <p className="text-gallery-charcoal font-serif italic text-lg">You can only edit your own artworks.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pb-24">
            <div className="bg-white border-b border-gallery-charcoal/20 pt-10 sm:pt-16 pb-8 sm:pb-12 mb-8 sm:mb-12 relative">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">
                    <Link
                        href={`/artwork/${id}`}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gallery-charcoal hover:text-gallery-red transition-colors mb-6 sm:mb-8 border border-gallery-charcoal/20 p-2 bg-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Artwork
                    </Link>
                    <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-gallery-black">Edit Artwork</h1>
                </div>
                {/* Decorative Line */}
                <div className="absolute bottom-0 right-1/4 w-px h-12 bg-gallery-charcoal/10" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12"
            >
                <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12 bg-white p-6 sm:p-8 md:p-12 border border-gallery-charcoal/20">

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20">Basic Details</h3>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Title *
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Artwork Title"
                                className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Description *
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your artwork (min 10 chars)"
                                rows={4}
                                className="border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Medium */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                    Medium *
                                </label>
                                <Input
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    placeholder="e.g., Oil on Canvas, Digital"
                                    className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none"
                                    required
                                />
                            </div>

                            {/* Dimensions */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                    Dimensions
                                </label>
                                <Input
                                    value={dimensions}
                                    onChange={(e) => setDimensions(e.target.value)}
                                    placeholder='e.g., 24" x 36"'
                                    className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-4 flex-wrap min-h-[48px] p-2 border border-gallery-charcoal/20 bg-gallery-cream/30 rounded-none">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center bg-white border border-gallery-charcoal/20 text-[10px] font-bold uppercase tracking-widest text-gallery-black px-3 py-1.5 rounded-none"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-gallery-charcoal/50 hover:text-gallery-red transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {tags.length === 0 && (
                                    <span className="text-xs italic text-gallery-charcoal/40 font-serif flex items-center px-2">No tags added</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Type a tag and press Enter"
                                    className="h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none flex-1"
                                />
                                <Button type="button" variant="outline" onClick={addTag} className="h-12 rounded-none border-gallery-charcoal/20 font-bold uppercase tracking-widest text-[10px]">Add</Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20">Sales & Pricing</h3>
                        </div>

                        {/* Listing Type */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-4">
                                Listing Type
                            </label>
                            <RadioGroup
                                value={listingType}
                                onValueChange={setListingType}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <div className={`flex items-center space-x-3 border p-4 cursor-pointer transition-all ${listingType === 'fixed' ? 'border-gallery-black bg-gallery-black text-white' : 'border-gallery-charcoal/20 hover:border-gallery-charcoal bg-white text-gallery-black'}`}>
                                    <RadioGroupItem value="fixed" id="edit-fixed" className={listingType === 'fixed' ? 'border-white text-white' : ''} />
                                    <label htmlFor="edit-fixed" className="cursor-pointer font-bold uppercase tracking-widest text-xs">
                                        Fixed Price
                                    </label>
                                </div>
                                <div className={`flex items-center space-x-3 border p-4 cursor-pointer transition-all ${listingType === 'auction' ? 'border-gallery-black bg-gallery-black text-white' : 'border-gallery-charcoal/20 hover:border-gallery-charcoal bg-white text-gallery-black'}`}>
                                    <RadioGroupItem value="auction" id="edit-auction" className={listingType === 'auction' ? 'border-white text-white' : ''} />
                                    <label htmlFor="edit-auction" className="cursor-pointer font-bold uppercase tracking-widest text-xs">
                                        Auction
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gallery-charcoal mb-2">
                                Price (USD) *
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
                                    className="pl-8 h-12 border-gallery-charcoal/20 bg-gallery-cream/30 focus-visible:ring-gallery-charcoal focus-visible:ring-offset-0 rounded-none rounded-none text-lg font-serif"
                                    required
                                />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-serif font-black uppercase tracking-widest text-gallery-black mb-6 pb-4 border-b border-gallery-charcoal/20">Gallery Images * <span className="text-xs font-normal font-serif italic text-gallery-charcoal/50 normal-case tracking-normal ml-2">(Min 3 required)</span></h3>
                        </div>

                        {/* Images */}
                        <div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-none overflow-hidden border border-gallery-charcoal/20 bg-gallery-cream">
                                        <img
                                            src={img.url}
                                            alt={`Image ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 bg-white border border-gallery-charcoal/20 text-gallery-black p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gallery-red hover:border-gallery-red rounded-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-gallery-black/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest text-center py-1">
                                                Cover
                                            </span>
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
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ImagePlus className="w-6 h-6 mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50 text-right">
                                {images.length} / 3 minimum images uploaded.
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4 border-t border-gallery-charcoal/20">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/artwork/${id}`)}
                            className="h-14 px-8 rounded-none border-gallery-charcoal/20 font-bold uppercase tracking-widest text-xs hover:bg-gallery-cream"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-14 px-10 rounded-none bg-gallery-black hover:bg-gallery-red text-white font-bold uppercase tracking-widest text-xs transition-colors"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Saving Masterpiece..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
