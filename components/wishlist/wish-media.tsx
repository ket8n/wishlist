"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// Falls back to a plain panel when there is no image or the URL fails to load.
export function WishMedia({
  src,
  alt,
  fallback,
  className,
  children,
}: {
  src?: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-media", className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user URLs, no optimizer
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          // Catches images that failed before hydration attached onError.
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailed(true);
          }}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        fallback && (
          <div aria-hidden className="absolute inset-0 flex items-center justify-center p-2 text-center">
            {fallback}
          </div>
        )
      )}
      {children}
    </div>
  );
}
