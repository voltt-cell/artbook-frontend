"use client";

import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export function AdminHeader() {
    const { user } = useAuth();
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === "/admin") return "Dashboard Overview";
        if (pathname?.startsWith("/admin/users")) return "User Management";
        if (pathname?.startsWith("/admin/artworks")) return "Artwork Management";
        if (pathname?.startsWith("/admin/applications")) return "Shop Applications";
        if (pathname?.startsWith("/admin/auctions")) return "Platform Auctions";
        if (pathname?.startsWith("/admin/orders")) return "Platform Orders";
        return "Admin Area";
    };

    return (
        <header className="h-16 bg-gallery-cream/80 backdrop-blur-md border-b border-gallery-charcoal/10 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h1 className="text-xl font-serif font-black text-gallery-black uppercase tracking-widest">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gallery-black leading-none uppercase tracking-wider">{user?.name}</p>
                        <p className="text-xs text-gallery-charcoal/70 mt-1.5 leading-none">{user?.email}</p>
                    </div>
                    <Avatar className="h-10 w-10 border border-gallery-charcoal/20 shadow-none rounded-none">
                        <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-none object-cover" />
                        <AvatarFallback className="bg-gallery-charcoal text-white font-serif font-bold text-sm rounded-none">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
