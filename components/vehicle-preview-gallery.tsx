"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import type { VehiclePhoto } from "@/lib/vehicles";

export function VehiclePreviewGallery({
  photos,
  title,
  compact = false,
}: {
  photos: VehiclePhoto[];
  title: string;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const total = photos.length;
  const current = photos[index];

  function go(delta: number) {
    if (total === 0) return;
    setIndex((currentIndex) => (currentIndex + delta + total) % total);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (total === 0) return;
      if (event.key === "ArrowRight") {
        setIndex((currentIndex) => (currentIndex + 1) % total);
      }
      if (event.key === "ArrowLeft") {
        setIndex((currentIndex) => (currentIndex - 1 + total) % total);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (!current) {
    return (
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-xl bg-muted ${compact ? "aspect-[16/10] max-h-[min(42dvh,320px)]" : "aspect-[4/3] max-h-[min(52dvh,420px)]"}`}
      />
    );
  }

  const thumbCount = compact ? 4 : 5;

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-xl bg-muted ${compact ? "aspect-[16/10] max-h-[min(42dvh,320px)]" : "aspect-[4/3] max-h-[min(52dvh,420px)]"}`}
        onTouchStart={(event) => {
          const touch = event.changedTouches[0];
          (event.currentTarget as HTMLElement).dataset.touchX = String(touch.clientX);
        }}
        onTouchEnd={(event) => {
          const start = Number(
            (event.currentTarget as HTMLElement).dataset.touchX ?? "0",
          );
          const end = event.changedTouches[0]?.clientX ?? start;
          const diff = end - start;
          if (Math.abs(diff) > 40) {
            go(diff < 0 ? 1 : -1);
          }
        }}
      >
        <SiteImage
          src={current.src}
          alt={current.alt}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-contain"
        />
        {total > 1 ? (
          <div className="absolute inset-x-2 bottom-2 z-10 flex justify-between gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-10 bg-background/90"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-10 bg-background/90"
              aria-label="Próxima foto"
              onClick={() => go(1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        ) : null}
        <p className="sr-only" aria-live="polite">
          Foto {index + 1} de {total} de {title}
        </p>
      </div>
      {total > 1 ? (
        <ul
          className={`grid shrink-0 gap-1.5 ${compact ? "grid-cols-4" : "grid-cols-5"}`}
        >
          {photos.slice(0, thumbCount).map((photo, photoIndex) => {
            const selected = photoIndex === index;
            return (
              <li key={photo.src}>
                <button
                  type="button"
                  aria-label={`Mostrar foto ${photoIndex + 1} de ${total}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setIndex(photoIndex)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${selected ? "border-primary" : "border-transparent"}`}
                >
                  <SiteImage
                    src={photo.src}
                    alt=""
                    fill
                    sizes="12vw"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
