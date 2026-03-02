import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gallery-cream flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col ml-64 min-w-0">
                <AdminHeader />
                <main className="flex-1 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
