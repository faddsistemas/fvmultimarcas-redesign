"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import type { VehiclePhoto } from "@/lib/vehicles";
import { cn } from "cn";

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
        className={cn(
          "relative w-full shrink-0 overflow-hidden rounded-xl bg-muted",
          compact
            ? "aspect-[4/3] max-h-[min(30dvh,11.5rem)] min-h-[8.5rem]"
            : "aspect-[4/3] max-h-[min(52dvh,420px)]",
        )}
      />
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-col", compact ? "gap-1" : "gap-2")}>
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden rounded-xl bg-muted",
          compact
            ? "aspect-[4/3] max-h-[min(30dvh,11.5rem)] min-h-[8.5rem]"
            : "aspect-[4/3] max-h-[min(52dvh,420px)]",
        )}
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
          <div className="absolute inset-x-1.5 bottom-1.5 z-10 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn(
                "bg-background/90 text-foreground [&_svg]:text-foreground",
                compact ? "size-8 [&_svg]:size-4" : "size-10 [&_svg]:size-5",
              )}
              aria-label="Foto anterior"
              onClick={() => go(-1)}
            >
              <ChevronLeftIcon />
            </Button>
            {compact ? (
              <ol className="flex flex-1 justify-center gap-1.5" aria-label="Fotos do veículo">
                {photos.map((photo, photoIndex) => {
                  const selected = photoIndex === index;
                  return (
                    <li key={photo.src}>
                      <button
                        type="button"
                        aria-label={`Mostrar foto ${photoIndex + 1} de ${total}`}
                        aria-current={selected ? "true" : undefined}
                        onClick={() => setIndex(photoIndex)}
                        className={cn(
                          "block size-2 rounded-full transition-colors",
                          selected ? "bg-primary" : "bg-foreground/35",
                        )}
                      />
                    </li>
                  );
                })}
              </ol>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={cn(
                "bg-background/90 text-foreground [&_svg]:text-foreground",
                compact ? "size-8 [&_svg]:size-4" : "size-10 [&_svg]:size-5",
              )}
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
      {!compact && total > 1 ? (
        <ul className="grid shrink-0 grid-cols-5 gap-1.5">
          {photos.slice(0, 5).map((photo, photoIndex) => {
            const selected = photoIndex === index;
            return (
              <li key={photo.src}>
                <button
                  type="button"
                  aria-label={`Mostrar foto ${photoIndex + 1} de ${total}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setIndex(photoIndex)}
                  className={`relative block aspect-square w-full min-h-10 overflow-hidden rounded-md border-2 ${selected ? "border-primary" : "border-transparent"}`}
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