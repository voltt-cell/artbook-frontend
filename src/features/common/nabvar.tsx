"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Store, LogOut, Settings, ShoppingBag, Sparkles, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { CartBadge } from "@/components/cart-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

// ------- Search Result Types -------
type SearchResults = {
  artworks: { id: string; title: string; imageUrl: string; images: string[] | null; price: string; medium: string; artistId: string }[];
  artists: { id: string; name: string; shopName: string | null; profileImage: string | null }[];
  auctions: { auctionId: string; artworkId: string; artworkTitle: string; artworkImage: string; artworkImages: string[] | null; currentBid: string | null; startingBid: string; endTime: string }[];
};

const Navbar = () => {
  const { user, isAuthenticated, hasShop, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get<SearchResults>(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchResults(data);
        const hasResults = data.artworks.length > 0 || data.artists.length > 0 || data.auctions.length > 0;
        setShowDropdown(hasResults);
      } catch {
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/artworks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults(null);
  };

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(parseFloat(price));

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="bg-gallery-cream sticky top-0 z-50 border-b border-gallery-beige">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <Link href="/" className="font-serif text-3xl font-black tracking-tighter text-gallery-black shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2">
          <div className="w-4 h-4 bg-gallery-red hidden sm:block"></div>
          ArtBook
        </Link>

        {/* Navigation Links - Center */}
        <nav className="hidden lg:flex items-center justify-center space-x-6 absolute left-1/2 -translate-x-1/2 h-full">
          <Link
            href="/"
            className={`flex items-center h-full text-xs uppercase tracking-widest font-semibold px-4 transition-colors ${pathname === "/" ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
              }`}
          >
            Home
          </Link>
          <Link
            href="/artworks"
            className={`flex items-center h-full text-xs uppercase tracking-widest font-semibold px-4 transition-colors ${pathname === "/artworks" ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
              }`}
          >
            Artworks
          </Link>
          <Link
            href="/artists"
            className={`flex items-center h-full text-xs uppercase tracking-widest font-semibold px-4 transition-colors ${pathname === "/artists" ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
              }`}
          >
            Artists
          </Link>
          <Link
            href="/auctions"
            className={`flex items-center h-full text-xs uppercase tracking-widest font-semibold px-4 transition-colors ${pathname === "/auctions" ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
              }`}
          >
            Auctions
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search with Live Dropdown */}
          <div ref={searchRef} className="hidden md:flex relative w-64 mr-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search art, artists, auctions..."
                className="w-full pl-4 pr-10 h-10 rounded-none border-b border-t-0 border-l-0 border-r-0 border-gallery-charcoal bg-transparent focus:ring-0 focus:border-gallery-red transition-all text-sm shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults && (searchResults.artworks.length > 0 || searchResults.artists.length > 0 || searchResults.auctions.length > 0)) {
                    setShowDropdown(true);
                  }
                }}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gallery-charcoal hover:text-gallery-red rounded-none"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gallery-charcoal/20 shadow-2xl z-[100] max-h-[70vh] overflow-y-auto">

                {/* Artworks */}
                {searchResults.artworks.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gallery-cream/80 border-b border-gallery-charcoal/10">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/60">Artworks</span>
                    </div>
                    {searchResults.artworks.map((art) => (
                      <Link
                        key={art.id}
                        href={`/artwork/${art.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gallery-cream/50 transition-colors border-b border-gallery-charcoal/5 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-gallery-cream flex-shrink-0 overflow-hidden">
                          <img src={art.images?.[0] || art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gallery-black truncate">{art.title}</p>
                          <p className="text-[10px] uppercase tracking-widest text-gallery-charcoal/50 font-semibold">{art.medium}</p>
                        </div>
                        <span className="text-sm font-serif font-bold text-gallery-black">{formatPrice(art.price)}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Artists */}
                {searchResults.artists.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gallery-cream/80 border-b border-gallery-charcoal/10">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/60">Artists</span>
                    </div>
                    {searchResults.artists.map((artist) => (
                      <Link
                        key={artist.id}
                        href={`/artist/${artist.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gallery-cream/50 transition-colors border-b border-gallery-charcoal/5 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-gallery-cream flex-shrink-0 overflow-hidden rounded-full border border-gallery-charcoal/20">
                          {artist.profileImage ? (
                            <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gallery-red text-white text-xs font-bold">
                              {artist.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gallery-black truncate">{artist.shopName || artist.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-gallery-charcoal/50 font-semibold">Artist</p>
                        </div>
                        <User className="w-4 h-4 text-gallery-charcoal/30" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Auctions */}
                {searchResults.auctions.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gallery-cream/80 border-b border-gallery-charcoal/10">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/60">Live Auctions</span>
                    </div>
                    {searchResults.auctions.map((auction) => (
                      <Link
                        key={auction.auctionId}
                        href={`/artwork/${auction.artworkId}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gallery-cream/50 transition-colors border-b border-gallery-charcoal/5 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-gallery-cream flex-shrink-0 overflow-hidden">
                          <img src={auction.artworkImages?.[0] || auction.artworkImage} alt={auction.artworkTitle} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gallery-black truncate">{auction.artworkTitle}</p>
                          <p className="text-[10px] uppercase tracking-widest text-gallery-red font-bold">Live Auction</p>
                        </div>
                        <span className="text-sm font-serif font-bold text-gallery-black">
                          {formatPrice(auction.currentBid || auction.startingBid)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {searchResults.artworks.length === 0 && searchResults.artists.length === 0 && searchResults.auctions.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gallery-charcoal/50 font-serif italic">No results found for &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Favorites - Logged In Only */}
          {isAuthenticated && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-none text-gallery-charcoal">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Shop Icon - Only when user has a shop */}
          {hasShop && (
            <Link href="/shop/dashboard">
              <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-none text-gallery-charcoal">
                <Store className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Cart - Always Visible */}
          <CartBadge />

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1 p-0 hover:bg-gallery-cream border border-gallery-charcoal/20 focus-visible:outline-none ring-offset-background transition-colors">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-gallery-red text-white font-bold text-xs rounded-full">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 rounded-xl border border-gallery-charcoal/20 shadow-2xl mt-2 bg-white" align="end" forceMount sideOffset={8}>
                <div className="px-3 py-2 mb-2 flex items-center gap-3 bg-gallery-cream border border-gallery-charcoal/10 rounded-lg mix-blend-multiply">
                  <Avatar className="h-10 w-10 border border-gallery-charcoal/20 rounded-full shadow-none">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-gallery-red text-white font-bold rounded-full">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-xs uppercase tracking-widest font-black text-gallery-black truncate">{user?.name}</p>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-gallery-charcoal/50 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-gallery-charcoal/10 my-1" />

                {/* Purchases & Orders - Always visible */}
                <DropdownMenuItem asChild>
                  <Link href="/buyer/dashboard" className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-md cursor-pointer transition-colors group">
                    <div className="p-1.5 border border-gallery-charcoal/20 bg-white rounded-md mr-3 group-hover:border-gallery-red transition-colors">
                      <ShoppingBag className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                    </div>
                    Purchases & Orders
                  </Link>
                </DropdownMenuItem>

                {/* My Shop - if they have one */}
                {hasShop && (
                  <DropdownMenuItem asChild>
                    <Link href="/shop/dashboard" className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-md cursor-pointer transition-colors group">
                      <div className="p-1.5 border border-gallery-charcoal/20 bg-white rounded-md mr-3 group-hover:border-gallery-red transition-colors">
                        <Store className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                      </div>
                      My Shop
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* Open Your Shop - if they don't have one */}
                {!hasShop && (
                  <DropdownMenuItem asChild>
                    <Link href="/shop/apply" className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-red hover:bg-gallery-red hover:text-white rounded-md cursor-pointer transition-colors group">
                      <div className="p-1.5 border border-gallery-red bg-white rounded-md mr-3 group-hover:bg-gallery-black group-hover:border-gallery-black transition-colors">
                        <Sparkles className="h-4 w-4 text-gallery-red group-hover:text-white" />
                      </div>
                      Open Your Shop
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-md cursor-pointer transition-colors group">
                    <div className="p-1.5 border border-gallery-charcoal/20 bg-white rounded-md mr-3 group-hover:border-gallery-red transition-colors">
                      <Settings className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                    </div>
                    Account Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gallery-charcoal/10 my-1" />

                <DropdownMenuItem onClick={handleLogout} className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-black hover:text-white rounded-md cursor-pointer transition-colors group mt-1">
                  <div className="p-1.5 border border-gallery-charcoal/20 bg-white rounded-md mr-3 group-hover:border-gallery-charcoal/40 group-hover:bg-gallery-charcoal transition-colors">
                    <LogOut className="h-4 w-4 text-gallery-charcoal group-hover:text-white" />
                  </div>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center ml-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-xs tracking-widest uppercase text-gallery-charcoal hover:bg-transparent hover:text-gallery-red rounded-none px-4 h-9 transition-colors">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
