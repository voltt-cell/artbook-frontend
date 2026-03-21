
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type CartItem = {
    cartItemId: string;
    addedAt: string;
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        artistId: string;
        price: string;
        description: string;
        status: string;
        listingType: string;
    };
    artist: {
        id: string;
        name: string;
        profileImage: string | null;
    };
};

export function useCart() {
    const { data, error, isLoading, mutate } = useSWR<CartItem[]>("/cart", fetcher);
    const [addingIds, setAddingIds] = useState<string[]>([]);
    const [removingIds, setRemovingIds] = useState<string[]>([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const addToCart = async (artworkId: string) => {
        setAddingIds(prev => [...prev, artworkId]);
        try {
            await api.post("/cart/add", { artworkId });
            toast.success("Added to cart");
            mutate();
        } catch (error: unknown) { // Changed from any to unknown
            toast.error(error instanceof Error ? error.message : "Failed to add to cart");
        } finally {
            setAddingIds(prev => prev.filter(id => id !== artworkId));
        }
    };

    const removeFromCart = async (cartItemId: string) => {
        setRemovingIds(prev => [...prev, cartItemId]);
        try {
            await api.delete(`/cart/${cartItemId}`);
            toast.success("Removed from cart");
            mutate(data?.filter(item => item.cartItemId !== cartItemId), false);
        } catch (error: unknown) { // Changed from any to unknown
            toast.error(error instanceof Error ? error.message : "Failed to remove from cart");
            mutate();
        } finally {
            setRemovingIds(prev => prev.filter(id => id !== cartItemId));
        }
    };

    const checkout = async () => {
        setCheckoutLoading(true);
        try {
            const res = await api.post<{ sessionUrl: string; totalSessions: number }>("/cart/checkout", {});
            if (res.sessionUrl) {
                window.location.href = res.sessionUrl;
            } else {
                toast.error("Failed to start checkout");
            }
        } catch (error: unknown) { // Changed from any to unknown
            console.error("Checkout error:", error);
            toast.error(error instanceof Error ? error.message : "Checkout failed");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const isInCart = (artworkId: string) => {
        return data?.some(item => item.artwork.id === artworkId) || false;
    };

    const total = data?.reduce((acc, item) => acc + parseFloat(item.artwork.price), 0) || 0;

    const clearCart = useCallback(() => {
        mutate([], false);
    }, [mutate]);

    return {
        cartItems: data || [],
        isLoading,
        isError: error,
        addToCart,
        removeFromCart,
        checkout,
        isInCart,
        clearCart,
        addingIds,
        removingIds,
        checkoutLoading,
        total,
    };
}
