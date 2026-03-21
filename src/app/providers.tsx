"use client";

import { AuthProvider } from "@/context/auth-context";
import { ReactLenis } from "lenis/react";

/**
 * Client-side providers wrapper.
 * This component is marked "use client" so it only runs in the browser.
 * The root layout (server component) renders this to provide client context.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ReactLenis>
    );
}
