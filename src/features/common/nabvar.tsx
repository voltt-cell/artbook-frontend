"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Heart, Store, LogOut, Settings, ShoppingBag,
  Sparkles, User, Loader2, Menu, X,
} from "lucide-react";
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

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/artworks", label: "Artworks" },
  { href: "/artists", label: "Artists" },
  { href: "/auctions", label: "Auctions" },
];

const Navbar = () => {
  const { user, isAuthenticated, hasShop, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Mobile menu
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  // Close search dropdown on click outside
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
    setMobileOpen(false);
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setMobileOpen(false);
      router.push(`/artworks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults(null);
    setMobileOpen(false);
  };

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(parseFloat(price));

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const renderDropdownContent = () => {
    if (!searchResults) return null;
    return (
      <>
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

        {searchResults.artworks.length === 0 && searchResults.artists.length === 0 && searchResults.auctions.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gallery-charcoal/50 font-serif italic">No results found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <header className="bg-gallery-cream sticky top-0 z-50 border-b border-gallery-beige">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-3xl font-black tracking-tighter text-gallery-black shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="w-4 h-4 bg-gallery-red" />
            ArtBook
          </Link>

          {/* Center nav — desktop only */}
          <nav className="hidden lg:flex items-center justify-center space-x-4 xl:space-x-6 flex-1 mx-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs uppercase tracking-widest font-semibold px-4 py-1 transition-colors ${pathname === href ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search — desktop only */}
            <div ref={searchRef} className="hidden lg:flex relative w-64 mr-2">
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
                  {renderDropdownContent()}
                </div>
              )}
            </div>

            {/* Favorites — logged in only, desktop */}
            {isAuthenticated && (
              <Link href="/favorites" className="hidden lg:inline-flex">
                <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-none text-gallery-charcoal">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Shop icon — desktop */}
            {hasShop && (
              <Link href="/shop/dashboard" className="hidden lg:inline-flex">
                <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-none text-gallery-charcoal">
                  <Store className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart — always */}
            <CartBadge />

            {/* User menu — desktop */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1 p-0 hover:bg-gallery-cream border border-gallery-charcoal/20 focus-visible:outline-none ring-offset-background transition-colors hidden lg:flex">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-full object-cover" />
                      <AvatarFallback className="bg-gallery-red text-white font-bold text-xs rounded-full">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-xl border border-gallery-charcoal/20 shadow-2xl mt-2 bg-white" align="end" forceMount sideOffset={8}>
                  <div className="px-3 py-2 mb-2 flex items-center gap-3 bg-gallery-cream border border-gallery-charcoal/10 rounded-lg">
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

                  <DropdownMenuItem asChild>
                    <Link href="/buyer/dashboard" className="flex items-center px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-md cursor-pointer transition-colors group">
                      <div className="p-1.5 border border-gallery-charcoal/20 bg-white rounded-md mr-3 group-hover:border-gallery-red transition-colors">
                        <ShoppingBag className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                      </div>
                      Purchases &amp; Orders
                    </Link>
                  </DropdownMenuItem>

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
              <Link href="/login" className="hidden lg:inline-flex ml-2">
                <Button variant="ghost" size="sm" className="font-semibold text-xs tracking-widest uppercase text-gallery-charcoal hover:bg-transparent hover:text-gallery-red rounded-none px-4 h-9 transition-colors">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Hamburger — visible below lg */}
            <button
              className="lg:hidden ml-1 p-2 text-gallery-charcoal hover:text-gallery-red transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gallery-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gallery-cream z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gallery-charcoal/10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gallery-charcoal/60">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-gallery-charcoal hover:text-gallery-red hover:bg-gallery-charcoal/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-5 py-4 border-b border-gallery-charcoal/10 relative">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 h-10 rounded-none border border-gallery-charcoal/30 bg-white focus:ring-0 focus:border-gallery-red text-sm shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults && (searchResults.artworks.length > 0 || searchResults.artists.length > 0 || searchResults.auctions.length > 0)) {
                  setShowDropdown(true);
                }
              }}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gallery-charcoal hover:text-gallery-red">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </form>

          {/* Mobile Search Dropdown */}
          {showDropdown && searchResults && (
            <div className="absolute top-full left-5 right-5 mt-1 bg-white border border-gallery-charcoal/20 shadow-2xl z-[100] max-h-[50vh] overflow-y-auto">
              {renderDropdownContent()}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-3 text-xs uppercase tracking-widest font-bold border-b border-gallery-charcoal/10 transition-colors ${pathname === href ? "text-gallery-red" : "text-gallery-charcoal hover:text-gallery-red"
                }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-4 space-y-1">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-white border border-gallery-charcoal/10">
                  <Avatar className="h-9 w-9 rounded-full border border-gallery-charcoal/20">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-gallery-red text-white font-bold text-xs rounded-full">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-gallery-black uppercase tracking-widest truncate">{user?.name}</p>
                    <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest truncate">{user?.email}</p>
                  </div>
                </div>

                <Link href="/favorites" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                  <Heart className="h-4 w-4" /> Favorites
                </Link>
                <Link href="/buyer/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                  <ShoppingBag className="h-4 w-4" /> My Orders
                </Link>
                {hasShop && (
                  <Link href="/shop/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                    <Store className="h-4 w-4" /> My Shop
                  </Link>
                )}
                {!hasShop && (
                  <Link href="/shop/apply" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-red hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                    <Sparkles className="h-4 w-4" /> Open My Shop
                  </Link>
                )}
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:text-gallery-red w-full text-left">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-black hover:text-gallery-red border-b border-gallery-charcoal/10 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
