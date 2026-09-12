"use client";

import { useState } from "react";

import { WishMedia } from "@/components/wishlist/wish-media";
import { cn } from "@/lib/utils";
import { plural } from "@/lib/format";

export function WishGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="rounded-[12px] border border-subtle bg-sunken p-3.5">
      <WishMedia
        key={current}
        src={current}
        alt={images.length ? name : ""}
        fallback={<span className="eyebrow text-ink-muted">No image yet</span>}
        className="aspect-square w-full rounded-[9px]"
      />
      {images.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((url, index) => (
            <li key={url + index}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === active}
                className={cn(
                  "size-12 overflow-hidden rounded-[8px] border",
                  index === active ? "border-brand" : "border-control",
                )}
              >
                <WishMedia src={url} alt="" className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {images.length > 0 && (
        <p className="mt-3 text-[11.5px] text-ink-muted">
          {images.length} {plural(images.length, "image", "images")} · added by URL
        </p>
      )}
    </div>
  );
}
