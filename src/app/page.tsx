"use client";
import useSWR from "swr";
import { motion } from "framer-motion";

import { ChevronRight, Loader2, Gavel, Users } from "lucide-react";
import Link from "next/link";
import ArtworkCard from "@/features/home/artwork-card";
import ArtistCard from "@/features/home/artist-card";
import AuctionCard from "@/features/auctions/auction-card";
import Banner from "@/features/home/banner";
import JoinCommunity from "@/features/home/join-community";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Types matching backend response
type ArtworkResponse = {
  id: string;
  title: string;
  artistId: string;
  description: string;
  price: string;
  medium: string;
  imageUrl: string;
  images: string[] | null;
  status: string;
  listingType: string;
  createdAt: string;
};

type ArtistResponse = {
  id: string;
  name: string;
  shopName?: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  role: string;
  followerCount: number;
};

type AuctionItem = {
  auction: {
    id: string;
    artworkId: string;
    startTime: string;
    endTime: string;
    startingBid: string;
    currentBid: string | null;
    status: string;
  };
  artwork: {
    id: string;
    title: string;
    imageUrl: string;
    images: string[] | null;
    artistId: string;
    price: string;
    medium: string;
    description: string;
  };
};

const Page = () => {
  // Unused state removed

  const { data: artworksRaw, isLoading: artworksLoading } = useSWR<ArtworkResponse[]>(
    "/artworks",
    fetcher,
    { refreshInterval: 15000 }
  );

  const { data: artistsRaw, isLoading: artistsLoading } = useSWR<ArtistResponse[]>(
    "/users?role=artist",
    fetcher
  );

  const { data: auctionItemsRaw } = useSWR<AuctionItem[]>(
    "/auctions",
    fetcher,
    { refreshInterval: 15000 }
  );

  // Map to UI-friendly format
  const artworks = (artworksRaw || []).map((item) => ({
    id: item.id,
    title: item.title,
    artistId: item.artistId,
    artist: "",
    image: item.images?.[0] || item.imageUrl,
    price: parseFloat(item.price),
    medium: item.medium,
    dimensions: "Variable",
    year: new Date(item.createdAt).getFullYear(),
    description: item.description,
    isAuction: item.listingType === "auction",
    currentBid: parseFloat(item.price),
    minimumBid: parseFloat(item.price),
  }));

  const artists = (artistsRaw || []).map((a) => ({
    id: a.id,
    name: a.name,
    shopName: a.shopName || undefined,
    bio: a.bio || "",
    profileImage: a.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    location: "",
    followers: a.followerCount || 0,
  }));

  // Get the most recent 5 auctions to fill a grid smartly
  const activeAuctions = (auctionItemsRaw || []).slice(0, 5);
  const featuredArtists = artists.slice(0, 4);

  const getArtistById = (id: string) => artists.find((a) => a.id === id);

  const categories = [
    { id: "all", name: "All" },
    { id: "painting", name: "Painting" },
    { id: "photography", name: "Photography" },
    { id: "digital", name: "Digital Art" },
    { id: "sculpture", name: "Sculpture" },
  ];

  if (artworksLoading || artistsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gallery-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-cream flex flex-col">
      <Banner />

      <div className="py-8">
        {/* Category Artworks Sections */}
        {categories.map((category) => {
          // Skip 'all' category if needed, but since we map specific categories, let's filter the static one
          if (category.id === "all") return null;

          const categoryArtworks = artworks.filter((a) => a.medium?.toLowerCase() === category.id);

          if (categoryArtworks.length === 0) return null;

          const displayArtworks = categoryArtworks.slice(0, 12);
          const hasMore = categoryArtworks.length > 12;

          return (
            <section key={category.id} className="py-4 border-b border-gallery-charcoal/10 last:border-b-0">
              <div className="container mx-auto px-4">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="flex justify-between items-center mb-8"
                >
                  <h2 className="font-serif text-4xl font-black text-gallery-black">{category.name}</h2>
                  <Link
                    href={`/artworks?category=${category.id}`}
                    className="flex items-center text-xs px-6 py-2 rounded-none border border-gallery-charcoal font-semibold uppercase tracking-widest hover:bg-gallery-charcoal hover:text-white transition-colors text-gallery-black"
                  >
                    View all
                  </Link>
                </motion.div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Carousel
                    opts={{ align: "start", dragFree: true }}
                    className="w-full relative"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {displayArtworks.map((artwork) => (
                        <CarouselItem key={artwork.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                          <ArtworkCard
                            artwork={artwork}
                            artist={getArtistById(artwork.artistId)!}
                          />
                        </CarouselItem>
                      ))}
                      {/* View All Terminal Card scaled to image size */}
                      {hasMore && (
                        <CarouselItem className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-0">
                          <Link href={`/artworks?category=${category.id}`} className="block w-full">
                            <div className="w-full relative overflow-hidden rounded-none aspect-square border border-gallery-charcoal/20 bg-gallery-cream flex flex-col items-center justify-center hover:bg-gallery-charcoal/5 transition-colors group">
                              <span className="font-bold text-xs uppercase tracking-widest text-gallery-charcoal group-hover:text-gallery-red transition-colors mb-2">
                                Discover More
                              </span>
                              <span className="font-bold text-xs uppercase tracking-widest text-gallery-black px-6 py-2 bg-white border border-gallery-charcoal/20 shadow-none rounded-none group-hover:bg-gallery-red group-hover:text-white group-hover:border-gallery-red transition-all">
                                View all
                              </span>
                            </div>
                            <div className="p-3 opacity-0">Spacer text to match card layout height</div>
                          </Link>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    <div className="hidden md:block">
                      <CarouselPrevious className="-left-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                      <CarouselNext className="-right-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                    </div>
                  </Carousel>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Active Auctions */}
      <section className="py-24 bg-white border-t border-gallery-charcoal/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-12 border-b border-gallery-charcoal/20 pb-4"
          >
            <h2 className="font-serif text-4xl font-black text-gallery-black">Live Auctions</h2>
            <Link
              href="/auctions"
              className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {activeAuctions.length > 0 ? (
              activeAuctions.map((auctionItem) => (
                <motion.div key={auctionItem.auction.id} variants={fadeInUp}>
                  <AuctionCard
                    item={auctionItem}
                    artist={getArtistById(auctionItem.artwork.artistId)!}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gallery-cream border border-gallery-charcoal/10 flex flex-col items-center justify-center">
                <Gavel className="w-12 h-12 text-gallery-charcoal/20 mb-6" />
                <h3 className="text-2xl font-serif font-black text-gallery-black mb-2">No active auctions</h3>
                <p className="text-gallery-charcoal/60 max-w-sm">Check back later for exciting new auction opportunities.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-24 bg-gallery-cream border-t border-gallery-charcoal/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-12 border-b border-gallery-charcoal/20 pb-4"
          >
            <h2 className="font-serif text-4xl font-black text-gallery-black">Magazine / Artists</h2>
            <Link
              href="/artists"
              className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredArtists.length > 0 ? (
              featuredArtists.map((artist) => (
                <motion.div key={artist.id} variants={fadeInUp}>
                  <ArtistCard artist={artist} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white border border-gallery-charcoal/10 flex flex-col items-center justify-center">
                <Users className="w-12 h-12 text-gallery-charcoal/20 mb-6" />
                <h3 className="text-2xl font-serif font-black text-gallery-black mb-2">No featured artists</h3>
                <p className="text-gallery-charcoal/60 max-w-sm">We are currently curating our list of featured artists.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <JoinCommunity />
    </div>
  );
};

export default Page;
