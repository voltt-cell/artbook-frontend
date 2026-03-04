"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Store, LogOut, Settings, ShoppingBag, Sparkles } from "lucide-react";
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

const Navbar = () => {
  const { user, isAuthenticated, hasShop, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artworks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

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
          {/* Global Search */}
          <div className="hidden md:flex relative w-64 mr-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search by artist, gallery, style..."
                className="w-full pl-4 pr-10 h-10 rounded-none border-b border-t-0 border-l-0 border-r-0 border-gallery-charcoal bg-transparent focus:ring-0 focus:border-gallery-red transition-all text-sm rounded-none shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-gallery-charcoal hover:text-gallery-red rounded-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Favorites - Logged In Only */}
          {isAuthenticated && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-full text-gallery-charcoal">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Shop Icon - Only when user has a shop */}
          {hasShop && (
            <Link href="/shop/dashboard">
              <Button variant="ghost" size="icon" className="hover:text-gallery-red hover:bg-transparent rounded-full text-gallery-charcoal">
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
                <Button variant="ghost" className="relative h-10 w-10 rounded-none ml-1 p-0 hover:bg-gallery-cream border border-gallery-charcoal/20 focus-visible:outline-none ring-offset-background transition-colors">
                  <Avatar className="h-8 w-8 rounded-none">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-none object-cover" />
                    <AvatarFallback className="bg-gallery-red text-white font-bold text-xs rounded-none">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-4 rounded-none border-gallery-charcoal/20 shadow-2xl mt-2 bg-white" align="end" forceMount sideOffset={8}>
                <div className="px-3 py-3 mb-4 flex items-center gap-3 bg-gallery-cream border border-gallery-charcoal/10 rounded-none mix-blend-multiply">
                  <Avatar className="h-10 w-10 border border-gallery-charcoal/20 rounded-none shadow-none">
                    <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-none object-cover" />
                    <AvatarFallback className="bg-gallery-red text-white font-bold rounded-none">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-xs uppercase tracking-widest font-black text-gallery-black truncate">{user?.name}</p>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-gallery-charcoal/50 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-gallery-charcoal/10 my-2" />

                {/* Purchases & Orders - Always visible */}
                <DropdownMenuItem asChild>
                  <Link href="/buyer/dashboard" className="flex items-center px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-none cursor-pointer transition-colors group">
                    <div className="p-2 border border-gallery-charcoal/20 bg-white rounded-none mr-4 group-hover:border-gallery-red transition-colors">
                      <ShoppingBag className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                    </div>
                    Purchases & Orders
                  </Link>
                </DropdownMenuItem>

                {/* My Shop - if they have one */}
                {hasShop && (
                  <DropdownMenuItem asChild>
                    <Link href="/shop/dashboard" className="flex items-center px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-none cursor-pointer transition-colors group">
                      <div className="p-2 border border-gallery-charcoal/20 bg-white rounded-none mr-4 group-hover:border-gallery-red transition-colors">
                        <Store className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                      </div>
                      My Shop
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* Open Your Shop - if they don't have one */}
                {!hasShop && (
                  <DropdownMenuItem asChild>
                    <Link href="/shop/apply" className="flex items-center px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-red hover:bg-gallery-red hover:text-white rounded-none cursor-pointer transition-colors group">
                      <div className="p-2 border border-gallery-red bg-white rounded-none mr-4 group-hover:bg-gallery-black group-hover:border-gallery-black transition-colors">
                        <Sparkles className="h-4 w-4 text-gallery-red group-hover:text-white" />
                      </div>
                      Open Your Shop
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-cream hover:text-gallery-red rounded-none cursor-pointer transition-colors group">
                    <div className="p-2 border border-gallery-charcoal/20 bg-white rounded-none mr-4 group-hover:border-gallery-red transition-colors">
                      <Settings className="h-4 w-4 text-gallery-charcoal group-hover:text-gallery-red" />
                    </div>
                    Account Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gallery-charcoal/10 my-2" />

                <DropdownMenuItem onClick={handleLogout} className="flex items-center px-3 py-3 text-xs uppercase tracking-widest font-bold text-gallery-charcoal hover:bg-gallery-black hover:text-white rounded-none cursor-pointer transition-colors group mt-2">
                  <div className="p-2 border border-gallery-charcoal/20 bg-white rounded-none mr-4 group-hover:border-gallery-charcoal/40 group-hover:bg-gallery-charcoal transition-colors">
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
                  My Details
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
