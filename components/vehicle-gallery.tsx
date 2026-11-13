"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { VehiclePhoto } from "@/components/vehicle-photo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VehiclePhoto as Photo } from "@/lib/vehicles";

export function VehicleGallery({
  photos,
  title,
}: {
  photos: Photo[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const current = photos[index];
  const total = photos.length;

  function go(next: number) {
    if (total === 0) return;
    setIndex((next + total) % total);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % total);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + total) % total);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  if (!current) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <VehiclePhoto photo={undefined} sizes="100vw" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <button
          type="button"
          className="absolute inset-0"
          onClick={() => setOpen(true)}
          aria-label={`Ampliar foto ${index + 1} de ${total} de ${title}`}
        >
          <SiteImage
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain"
          />
        </button>
        {total > 1 ? (
          <div className="absolute inset-x-3 bottom-3 z-10 flex justify-between">
            <Button
              type="button"
              variant="secondary"
              className="size-11"
              aria-label="Foto anterior"
              onClick={() => go(index - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="size-11"
              aria-label="Próxima foto"
              onClick={() => go(index + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        ) : null}
      </div>
      {total > 1 ? (
        <ul className="grid grid-cols-5 gap-2">
          {photos.map((photo, photoIndex) => {
            const selected = photoIndex === index;
            return (
              <li key={photo.src}>
                <button
                  type="button"
                  aria-label={`Mostrar foto ${photoIndex + 1} de ${total}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setIndex(photoIndex)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 ${selected ? "border-primary" : "border-transparent"}`}
                >
                  <SiteImage
                    src={photo.src}
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          overlayClassName="bg-black/85"
          className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-5xl border-0 bg-secondary p-4 text-secondary-foreground sm:max-w-5xl"
        >
          <DialogTitle className="sr-only">Fotos de {title}</DialogTitle>
          <DialogDescription className="text-white">
            Foto {index + 1} de {total}
          </DialogDescription>
          <div className="relative aspect-[4/3] w-full">
            <SiteImage
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          {total > 1 ? (
            <div className="flex justify-between gap-3">
              <Button type="button" variant="outline" onClick={() => go(index - 1)}>
                <ChevronLeftIcon data-icon="inline-start" />
                Anterior
              </Button>
              <Button type="button" variant="outline" onClick={() => go(index + 1)}>
                Próxima
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
