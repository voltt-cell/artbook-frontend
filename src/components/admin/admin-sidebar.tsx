"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Image, Store, Gavel, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Artworks", href: "/admin/artworks", icon: Image },
    { name: "Applications", href: "/admin/applications", icon: Store },
    { name: "Auctions", href: "/admin/auctions", icon: Gavel },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gallery-cream border-r border-gallery-charcoal/10 flex flex-col z-40">
            <div className="h-16 flex items-center px-6 border-b border-gallery-charcoal/10 shrink-0">
                <Link href="/admin" className="font-serif text-2xl font-black text-gallery-black tracking-tighter shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2">
                    <div className="w-3 h-3 bg-gallery-red"></div>
                    ArtBook <span className="text-gallery-charcoal/50 text-xs font-sans font-bold uppercase tracking-widest ml-1 mt-1">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link key={link.name} href={link.href} className="block">
                            <div className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer group transition-all duration-300 ${isActive ? "text-gallery-red font-bold" : "text-gallery-charcoal/70 hover:text-gallery-black"}`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeAdminTab"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-gallery-red"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? "text-gallery-red" : "text-gallery-charcoal/50 group-hover:text-gallery-charcoal"}`} />
                                <span className={`relative z-10 text-xs uppercase tracking-widest ${isActive ? 'font-bold' : 'font-semibold'}`}>{link.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gallery-charcoal/10 shrink-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gallery-charcoal/70 hover:text-gallery-red transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold group"
                >
                    <LogOut className="h-5 w-5 text-gallery-charcoal/50 group-hover:text-gallery-red transition-colors" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
