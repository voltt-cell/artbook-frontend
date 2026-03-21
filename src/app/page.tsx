"use client";
import useSWR from "swr";
import { motion } from "framer-motion";

import { ChevronRight, Loader2 } from "lucide-react";
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
    "/artworks?limit=20&listingType=fixed",
    fetcher,
    { refreshInterval: 15000 }
  );

  const { data: artistsRaw, isLoading: artistsLoading } = useSWR<ArtistResponse[]>(
    "/users?role=artist&limit=20",
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

  // Limit for display
  const activeAuctions = (auctionItemsRaw || []).slice(0, 15);
  const featuredArtists = artists.slice(0, 12);

  const getArtistById = (id: string) => artists.find((a) => a.id === id);
  const fallbackArtist = (id: string) => ({
    id,
    name: "Unknown Artist",
    bio: "",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    location: "",
    followers: 0,
  });

  const allArtworks = artworks;

  return (
    <div className="min-h-screen bg-gallery-cream flex flex-col">
      <Banner />

      <div className="py-8">
        {/* Latest Artworks */}
        {allArtworks.length > 0 && (
          <section className="py-4 border-b border-gallery-charcoal/10">
            <div className="container mx-auto px-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex justify-between items-center mb-8"
              >
                <h2 className="font-sans text-4xl font-black text-gallery-black uppercase tracking-tight">Latest Works</h2>
                <Link
                  href="/artworks"
                  className="flex items-center text-xs px-6 py-2 rounded-none border border-gallery-charcoal font-semibold uppercase tracking-widest hover:bg-gallery-charcoal hover:text-white transition-colors text-gallery-black"
                >
                  View all
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Carousel
                  opts={{ align: "start", dragFree: true }}
                  className="w-full relative"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {allArtworks.map((artwork) => (
                      <CarouselItem key={artwork.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        <ArtworkCard
                          artwork={artwork}
                          artist={getArtistById(artwork.artistId) || fallbackArtist(artwork.artistId)}
                        />
                      </CarouselItem>
                    ))}
                    <CarouselItem className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-0">
                      <Link href="/artworks" className="block w-full">
                        <div className="w-full relative overflow-hidden rounded-none aspect-square border border-gallery-charcoal/20 bg-gallery-cream flex flex-col items-center justify-center hover:bg-gallery-charcoal/5 transition-colors group">
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-charcoal group-hover:text-gallery-red transition-colors mb-2">
                            Discover More
                          </span>
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-black px-6 py-2 bg-white border border-gallery-charcoal/20 shadow-none rounded-none group-hover:bg-gallery-red group-hover:text-white group-hover:border-gallery-red transition-all">
                            View all
                          </span>
                        </div>
                        <div className="p-3 opacity-0">Spacer</div>
                      </Link>
                    </CarouselItem>
                  </CarouselContent>
                  <div className="hidden md:block">
                    <CarouselPrevious className="-left-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                    <CarouselNext className="-right-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                  </div>
                </Carousel>
              </motion.div>
            </div>
          </section>
        )}
      </div>

      {/* Active Auctions — only render if there are any */}
      {activeAuctions.length > 0 && (
        <section className="py-24 bg-white border-t border-gallery-charcoal/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex justify-between items-center mb-12 border-b border-gallery-charcoal/20 pb-4"
            >
              <h2 className="font-sans text-4xl font-black text-gallery-black uppercase tracking-tight">Live Auctions</h2>
              <Link
                href="/auctions"
                className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Carousel
                opts={{ align: "start", dragFree: true }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {activeAuctions.map((auctionItem) => (
                    <CarouselItem key={auctionItem.auction.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                      <AuctionCard
                        item={auctionItem}
                        artist={getArtistById(auctionItem.artwork.artistId) || fallbackArtist(auctionItem.artwork.artistId)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-4 bg-white border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                  <CarouselNext className="-right-4 bg-white border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Artists — only render if there are any */}
      {featuredArtists.length > 0 && (
        <section className="py-24 bg-gallery-cream border-t border-gallery-charcoal/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex justify-between items-center mb-12 border-b border-gallery-charcoal/20 pb-4"
            >
              <h2 className="font-sans text-4xl font-black text-gallery-black uppercase tracking-tight">Magazine / Artists</h2>
              <Link
                href="/artists"
                className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Carousel
                opts={{ align: "start", dragFree: true }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredArtists.map((artist) => (
                    <CarouselItem key={artist.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 xl:basis-1/4">
                      <ArtistCard artist={artist} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                  <CarouselNext className="-right-4 bg-gallery-cream border border-gallery-charcoal w-10 h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>
      )}

      <JoinCommunity />
    </div>
  );
};

export default Page;
