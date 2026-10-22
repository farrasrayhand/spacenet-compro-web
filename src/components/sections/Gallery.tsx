"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";

type GalleryProps = {
  items: GalleryItem[];
  emptyNote: string;
};

export function Gallery({ items, emptyNote }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((current) => (current === null ? null : (current + 1) % items.length));
      if (event.key === "ArrowLeft")
        setIndex((current) => (current === null ? null : (current - 1 + items.length) % items.length));
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, items.length]);

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
        {emptyNote}
      </p>
    );
  }

  const active = index !== null ? items[index] : null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, itemIndex) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => setIndex(itemIndex)}
              className="group block w-full overflow-hidden rounded-lg border border-line bg-surface text-left"
              aria-label={`Perbesar foto: ${item.alt}`}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden bg-mist">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </span>
              {item.caption ? (
                <span className="block px-3 py-2 text-sm text-muted">{item.caption}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={active.alt}>
          <div className="flex items-center justify-between text-white">
            <p className="text-sm">
              Foto {(index ?? 0) + 1} dari {items.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setIndex(null)}
              className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/10"
              aria-label="Tutup galeri"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() => setIndex((current) => (current === null ? null : (current - 1 + items.length) % items.length))}
              className="absolute left-0 flex h-11 w-11 items-center justify-center rounded bg-black/40 text-white hover:bg-black/60"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>

            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="100vw"
              className="max-h-[75vh] w-auto rounded object-contain"
            />

            <button
              type="button"
              onClick={() => setIndex((current) => (current === null ? null : (current + 1) % items.length))}
              className="absolute right-0 flex h-11 w-11 items-center justify-center rounded bg-black/40 text-white hover:bg-black/60"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {active.caption ? <p className="pb-2 text-center text-sm text-white/80">{active.caption}</p> : null}
        </div>
      ) : null}
    </>
  );
}
