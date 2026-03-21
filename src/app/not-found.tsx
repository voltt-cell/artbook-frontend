import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gallery-cream px-4 text-center">
      <div className="text-gallery-red font-sans font-black text-8xl md:text-9xl tracking-tighter mb-4">
        404
      </div>
      <h2 className="font-playfair text-4xl md:text-5xl font-black text-gallery-black mb-6 uppercase">
        Masterpiece<br />Missing
      </h2>
      <p className="text-gallery-charcoal max-w-lg mb-10 text-lg">
        The gallery wall is empty here. The page or artwork you're looking for might have been moved or doesn't exist.
      </p>
      <Button 
        asChild
        variant="outline"
        className="rounded-none border border-gallery-charcoal text-gallery-charcoal hover:bg-gallery-charcoal hover:text-white uppercase tracking-widest px-8 h-12"
      >
        <Link href="/">
          Return to Gallery
        </Link>
      </Button>
    </div>
  );
}
