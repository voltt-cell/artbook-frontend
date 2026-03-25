"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface OptimizedImageProps extends HTMLMotionProps<"img"> {
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: number | string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  fallbackIcon,
  aspectRatio,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) setError(true);
    else {
      setError(false);
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <div 
      className={cn("relative overflow-hidden", containerClassName)}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && !error && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className={cn("w-full h-full rounded-none", skeletonClassName)} />
          </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gallery-beige text-gallery-charcoal/20">
          {fallbackIcon || <ImageOff className="w-8 h-8" />}
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setError(true);
            onError?.(e);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          {...props}
        />
      )}
    </div>
  );
}
