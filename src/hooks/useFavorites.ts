import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api";

type FavoriteItem = {
    favoriteId: string;
    favoritedAt: string;
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        artistId: string;
        price: string;
        status: string;
        medium: string;
        listingType: string;
    };
    artist: {
        id: string;
        name: string;
        profileImage: string | null;
    };
};

export function useFavorites() {
    const { data, error, isLoading, mutate } = useSWR<FavoriteItem[]>("/favorites", fetcher);

    const [togglingId, setTogglingId] = useState<string | null>(null);

    const isFavorite = (artworkId: string) => {
        return data?.some((item) => String(item.artwork.id) === String(artworkId)) || false;
    };

    const toggleFavorite = async (artworkId: string, artworkDetails?: FavoriteItem['artwork'], artistDetails?: FavoriteItem['artist']) => {
        setTogglingId(artworkId);
        try {
            // Optimistic update
            const isFav = isFavorite(artworkId);
            let newData: FavoriteItem[] | undefined;

            if (isFav) {
                newData = data?.filter(item => String(item.artwork.id) !== String(artworkId));
            } else if (artworkDetails && artistDetails) {
                const optimisticItem: FavoriteItem = {
                    favoriteId: `temp-${Date.now()}`,
                    favoritedAt: new Date().toISOString(),
                    artwork: artworkDetails,
                    artist: artistDetails
                };
                newData = [...(data || []), optimisticItem];
            } else {
                // If we don't have details, better not to add incomplete item to list to avoid crashes.
                // We will rely on revalidation.
                newData = data;
            }

            if (newData) {
                mutate(newData, false);
            }

            const res = await api.post<{ message: string }>("/favorites/toggle", { artworkId });

            // Re-fetch to be sure
            mutate();

            toast.success(res.message);
        } catch {
            toast.error("Failed to update favorites");
            mutate(); // Revert on error
        } finally {
            setTogglingId(null);
        }
    };

    return {
        favorites: data || [],
        isLoading,
        isError: error,
        isFavorite,
        toggleFavorite,
        togglingId,
    };
}
