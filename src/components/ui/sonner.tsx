"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            richColors
            position="bottom-right"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gallery-black group-[.toaster]:border-gallery-charcoal/20 group-[.toaster]:shadow-none group-[.toaster]:rounded-none font-serif rounded-none",
                    description: "group-[.toast]:text-gallery-charcoal/70 font-sans",
                    actionButton:
                        "group-[.toast]:bg-gallery-black group-[.toast]:text-white uppercase tracking-widest text-xs font-bold rounded-none",
                    cancelButton:
                        "group-[.toast]:bg-gallery-cream group-[.toast]:text-gallery-charcoal uppercase tracking-widest text-xs font-bold rounded-none border border-gallery-charcoal/20",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
