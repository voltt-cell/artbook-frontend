"use client";

import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      await api.post("/newsletter/subscribe", { email: email.trim() });
      toast.success("Successfully subscribed!", {
        description: "You've been added to the ArtBook newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed", {
        description: (error as Error).message,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Hide footer on admin and artist dashboard routes
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/artist/dashboard") || pathname?.startsWith("/shop/dashboard");

  if (isHidden) return null;

  return (
    <footer className="bg-gallery-cream text-gallery-black py-20 border-t border-gallery-charcoal/10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 px-4">
        <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="font-serif text-4xl font-black tracking-tighter text-gallery-black flex items-center gap-2">
            <div className="w-4 h-4 bg-gallery-red hidden sm:block"></div>
            ArtBook
          </Link>
          <p className="text-gallery-charcoal/70 text-sm max-w-xs font-medium">
            Connecting artists and collectors through a curated marketplace for extraordinary art.
          </p>
          <div className="flex space-x-6 pt-2">
            <Instagram className="h-5 w-5 cursor-pointer text-gallery-charcoal hover:text-gallery-red transition-colors" />
            <Twitter className="h-5 w-5 cursor-pointer text-gallery-charcoal hover:text-gallery-red transition-colors" />
            <Facebook className="h-5 w-5 cursor-pointer text-gallery-charcoal hover:text-gallery-red transition-colors" />
            <Mail className="h-5 w-5 cursor-pointer text-gallery-charcoal hover:text-gallery-red transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl font-bold mb-6 text-gallery-black">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/artworks"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                Artworks
              </Link>
            </li>
            <li>
              <Link
                href="/artists"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                Artists
              </Link>
            </li>
            <li>
              <Link
                href="/auctions"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                Auctions
              </Link>
            </li>
          </ul>
        </div>

        {/* Info Links */}
        <div>
          <h4 className="font-serif text-xl font-bold mb-6 text-gallery-black">Information</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-gallery-charcoal/70 hover:text-gallery-red text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-1 border-t md:border-t-0 border-gallery-charcoal/10 pt-8 md:pt-0">
          <h4 className="font-serif text-xl font-bold mb-6 text-gallery-black">
            The Newsletter
          </h4>
          <form onSubmit={handleSubscribe} className="flex border-b border-gallery-charcoal/30 pb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={isSubscribing}
              className="bg-transparent px-2 py-2 outline-none flex-grow text-gallery-black text-sm placeholder-gallery-charcoal/40 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="text-gallery-red text-xs uppercase tracking-widest font-bold px-4 hover:opacity-70 transition-opacity disabled:opacity-70"
            >
              {isSubscribing ? (
                <div className="w-4 h-4 border-2 border-gallery-red/30 border-t-gallery-red rounded-full animate-spin" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          <p className="text-gallery-charcoal/50 text-xs mt-4 italic font-serif">
            Stay updated on new artworks, auctions and featured artists.
          </p>
        </div>
      </div>

      <div className="container mx-auto border-t border-gallery-charcoal/10 mt-16 pt-8 px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gallery-charcoal/50 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
          © {new Date().getFullYear()} ArtBook Gallery <span className="hidden md:inline">|</span> <span className="italic normal-case font-serif tracking-normal text-sm">All rights reserved.</span>
        </p>
        <div className="flex space-x-6">
          <Link
            href="/terms"
            className="text-gallery-charcoal/50 text-xs uppercase tracking-widest font-semibold hover:text-gallery-red transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-gallery-charcoal/50 text-xs uppercase tracking-widest font-semibold hover:text-gallery-red transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
