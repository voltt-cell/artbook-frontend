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
import { fadeInUp, staggerContainer } from "@/lib/animations";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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

// Threshold — only show the "Discover More" card when there are more than this many artworks
const DISCOVER_MORE_THRESHOLD = 5;

/* Dot indicators for carousels on mobile/tablet */
function CarouselDots({ api }: { api: CarouselApi | undefined }) {
  const [selected, setSelected] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    });
  }, [api]);

  if (count <= 1) return null;

  // Show max 7 dots; if more, show a condensed set around the selected index
  const maxDots = 7;
  let dots: number[];
  if (count <= maxDots) {
    dots = Array.from({ length: count }, (_, i) => i);
  } else {
    const half = Math.floor(maxDots / 2);
    let start = Math.max(0, selected - half);
    let end = start + maxDots;
    if (end > count) {
      end = count;
      start = Math.max(0, end - maxDots);
    }
    dots = Array.from({ length: end - start }, (_, i) => start + i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4 md:hidden">
      {dots.map((i) => (
        <button
          key={i}
          className={`rounded-full transition-all duration-200 ${
            i === selected
              ? "w-5 h-1.5 bg-gallery-red"
              : "w-1.5 h-1.5 bg-gallery-charcoal/25 hover:bg-gallery-charcoal/40"
          }`}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

const Page = () => {
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

  // Only show "Discover More" card when there are enough artworks that it makes sense
  const showDiscoverMore = artworks.length > DISCOVER_MORE_THRESHOLD;
  const showAuctionDiscoverMore = activeAuctions.length > 3;
  const showArtistDiscoverMore = featuredArtists.length > 4;

  // Carousel APIs for dot indicators
  const [artworksApi, setArtworksApi] = React.useState<CarouselApi>();
  const [auctionsApi, setAuctionsApi] = React.useState<CarouselApi>();
  const [artistsApi, setArtistsApi] = React.useState<CarouselApi>();

  const isLoading = artworksLoading || artistsLoading;

  return (
    <div className="min-h-screen bg-gallery-cream flex flex-col">
      <Banner />

      {/* Loading state */}
      {isLoading && artworks.length === 0 && artists.length === 0 && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gallery-charcoal/40" />
        </div>
      )}

      {/* Latest Artworks */}
      {artworks.length > 0 && (
        <section className="py-12 border-b border-gallery-charcoal/10">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex justify-between items-center mb-8"
            >
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-gallery-black uppercase tracking-tight">
                Latest Works
              </h2>
              <Link
                href="/artworks"
                className="flex items-center text-xs px-4 sm:px-6 py-2 border border-gallery-charcoal font-semibold uppercase tracking-widest hover:bg-gallery-charcoal hover:text-white transition-colors text-gallery-black whitespace-nowrap"
              >
                View All
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={staggerContainer}
            >
              <Carousel
                opts={{ align: "start", dragFree: true }}
                className="w-full"
                setApi={setArtworksApi}
              >
                <CarouselContent className="-ml-3 sm:-ml-4">
                  {artworks.map((artwork) => (
                    <CarouselItem
                      key={artwork.id}
                      className="pl-3 sm:pl-4 basis-full sm:basis-[48%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <ArtworkCard
                        artwork={artwork}
                        artist={getArtistById(artwork.artistId) || fallbackArtist(artwork.artistId)}
                      />
                    </CarouselItem>
                  ))}

                  {/* Only show "Discover More" when there are enough artworks */}
                  {showDiscoverMore && (
                    <CarouselItem className="pl-3 sm:pl-4 basis-full sm:basis-[48%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                      <Link href="/artworks" className="block w-full">
                        <div className="w-full relative overflow-hidden aspect-square border border-gallery-charcoal/20 bg-gallery-cream flex flex-col items-center justify-center hover:bg-gallery-charcoal/5 transition-colors group cursor-pointer">
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-charcoal group-hover:text-gallery-red transition-colors mb-3">
                            Discover More
                          </span>
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-black px-6 py-2 bg-white border border-gallery-charcoal/20 shadow-none group-hover:bg-gallery-red group-hover:text-white group-hover:border-gallery-red transition-all">
                            View All
                          </span>
                        </div>
                        <div className="p-3 opacity-0 select-none">Spacer</div>
                      </Link>
                    </CarouselItem>
                  )}
                </CarouselContent>

                <CarouselPrevious className="-left-3 md:-left-5 bg-gallery-cream border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselNext className="-right-3 md:-right-5 bg-gallery-cream border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselDots api={artworksApi} />
              </Carousel>
            </motion.div>
          </div>
        </section>
      )}

      {/* Active Auctions */}
      {activeAuctions.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-t border-gallery-charcoal/10">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex justify-between items-center mb-8 sm:mb-12 border-b border-gallery-charcoal/20 pb-4"
            >
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-gallery-black uppercase tracking-tight">
                Live Auctions
              </h2>
              <Link
                href="/auctions"
                className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Carousel
                opts={{ align: "start", dragFree: true }}
                className="w-full"
                setApi={setAuctionsApi}
              >
                <CarouselContent className="-ml-3 sm:-ml-4">
                  {activeAuctions.map((auctionItem) => (
                    <CarouselItem
                      key={auctionItem.auction.id}
                      className="pl-3 sm:pl-4 basis-full sm:basis-[48%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <AuctionCard
                        item={auctionItem}
                        artist={getArtistById(auctionItem.artwork.artistId) || fallbackArtist(auctionItem.artwork.artistId)}
                      />
                    </CarouselItem>
                  ))}

                  {/* Discover More */}
                  {showAuctionDiscoverMore && (
                    <CarouselItem className="pl-3 sm:pl-4 basis-full sm:basis-[48%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                      <Link href="/auctions" className="block w-full">
                        <div className="w-full relative overflow-hidden aspect-square border border-gallery-charcoal/20 bg-white flex flex-col items-center justify-center hover:bg-gallery-charcoal/5 transition-colors group cursor-pointer">
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-charcoal group-hover:text-gallery-red transition-colors mb-3">
                            More Auctions
                          </span>
                          <span className="font-bold text-xs uppercase tracking-widest text-gallery-black px-6 py-2 bg-gallery-cream border border-gallery-charcoal/20 shadow-none group-hover:bg-gallery-red group-hover:text-white group-hover:border-gallery-red transition-all">
                            View All
                          </span>
                        </div>
                        <div className="p-3 opacity-0 select-none">Spacer</div>
                      </Link>
                    </CarouselItem>
                  )}
                </CarouselContent>

                <CarouselPrevious className="-left-3 md:-left-5 bg-white border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselNext className="-right-3 md:-right-5 bg-white border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselDots api={auctionsApi} />
              </Carousel>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Artists */}
      {featuredArtists.length > 0 && (
        <section className="py-16 sm:py-24 bg-gallery-cream border-t border-gallery-charcoal/10">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex justify-between items-center mb-8 sm:mb-12 border-b border-gallery-charcoal/20 pb-4"
            >
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-gallery-black uppercase tracking-tight">
                Featured Artists
              </h2>
              <Link
                href="/artists"
                className="flex items-center text-gallery-red text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={staggerContainer}
            >
              <Carousel
                opts={{ align: "start", dragFree: true }}
                className="w-full"
                setApi={setArtistsApi}
              >
                <CarouselContent className="-ml-3 sm:-ml-4">
                  {featuredArtists.map((artist) => (
                    <CarouselItem
                      key={artist.id}
                      className="pl-3 sm:pl-4 basis-[48%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <ArtistCard artist={artist} />
                    </CarouselItem>
                  ))}

                  {/* Discover More */}
                  {showArtistDiscoverMore && (
                    <CarouselItem className="pl-3 sm:pl-4 basis-[48%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                      <Link href="/artists" className="block w-full">
                        <div className="w-full relative overflow-hidden aspect-square border border-gallery-charcoal/20 bg-gallery-cream flex flex-col items-center justify-center hover:bg-gallery-charcoal/5 transition-colors group cursor-pointer rounded-full">
                          <span className="font-bold text-[10px] uppercase tracking-widest text-gallery-charcoal group-hover:text-gallery-red transition-colors mb-2 text-center px-2">
                            More Artists
                          </span>
                          <span className="font-bold text-[10px] uppercase tracking-widest text-gallery-black px-4 py-1.5 bg-white border border-gallery-charcoal/20 shadow-none group-hover:bg-gallery-red group-hover:text-white group-hover:border-gallery-red transition-all">
                            View All
                          </span>
                        </div>
                      </Link>
                    </CarouselItem>
                  )}
                </CarouselContent>

                <CarouselPrevious className="-left-3 md:-left-5 bg-gallery-cream border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselNext className="-right-3 md:-right-5 bg-gallery-cream border border-gallery-charcoal w-8 h-8 md:w-10 md:h-10 hover:bg-gallery-charcoal hover:text-white text-gallery-charcoal rounded-none transition-colors" />
                <CarouselDots api={artistsApi} />
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
