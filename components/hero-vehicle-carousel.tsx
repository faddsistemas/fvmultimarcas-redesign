"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { VehiclePhoto } from "@/components/vehicle-photo";
import { useVehiclePreview } from "@/components/vehicle-preview-provider";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { formatCurrency, formatKm } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import {
  featuredVehicles,
  vehicleDetailHref,
  vehicleName,
  type Vehicle,
} from "@/lib/vehicles";

export function HeroVehicleCarousel() {
  const items = featuredVehicles();
  const reducedMotion = usePrefersReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback((next: CarouselApi) => {
    if (!next) return;
    setSelected(next.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- embla initial snap
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || reducedMotion || paused || items.length < 2) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5500);
    return () => window.clearInterval(id);
  }, [api, items.length, paused, reducedMotion]);

  return (
    <div
      className="relative w-full max-w-full min-w-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full max-w-full"
        aria-label="Veículos em destaque"
      >
        <CarouselContent className="ml-0">
          {items.map((vehicle, index) => (
            <CarouselItem key={vehicle.slug} className="basis-full pl-0">
              <HeroCarouselSlide vehicle={vehicle} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="secondary"
          className="left-2 size-11 border-0 bg-white/95 text-secondary shadow-md hover:bg-white disabled:opacity-40 [&_svg]:size-5 [&_svg]:text-secondary"
        />
        <CarouselNext
          variant="secondary"
          className="right-2 size-11 border-0 bg-white/95 text-secondary shadow-md hover:bg-white disabled:opacity-40 [&_svg]:size-5 [&_svg]:text-secondary"
        />
      </Carousel>
      <CarouselDots
        count={items.length}
        selected={selected}
        onSelect={(index) => api?.scrollTo(index)}
      />
    </div>
  );
}

function HeroCarouselSlide({
  vehicle,
  priority,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const { openPreview } = useVehiclePreview();
  const price = formatCurrency(vehicle.price);
  const km = formatKm(vehicle.km);
  const name = vehicleName(vehicle);

  return (
    <article className="overflow-hidden rounded-2xl bg-background text-foreground shadow-xl ring-1 ring-black/5">
      <button
        type="button"
        className="flex w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#8B0000]"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey) {
            window.open(vehicleDetailHref(vehicle.slug), "_blank", "noopener");
            return;
          }
          openPreview(vehicle);
        }}
      >
        <div className="relative aspect-[4/3] bg-muted">
          <VehiclePhoto
            photo={vehicle.photos[0]}
            priority={priority}
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </div>
        <div className="flex flex-col gap-1 px-4 py-3">
          <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
          <h2 className="font-heading text-xl font-semibold">{name}</h2>
          <p className="text-sm">
            {vehicle.year}
            <span aria-hidden="true"> · </span>
            {km}
          </p>
          <p className="font-heading text-2xl font-semibold text-secondary">{price}</p>
          <span className="text-sm font-medium text-primary">Toque para ver detalhes</span>
        </div>
      </button>
      <a href={vehicleDetailHref(vehicle.slug)} className="sr-only">
        Abrir página completa do {name}
      </a>
    </article>
  );
}

function CarouselDots({
  count,
  selected,
  onSelect,
}: {
  count: number;
  selected: number;
  onSelect: (index: number) => void;
}) {
  if (count < 2) return null;
  return (
    <div
      className="mt-3 flex justify-center gap-2"
      role="tablist"
      aria-label="Slides do carrossel"
    >
      {Array.from({ length: count }, (_, index) => (
        <Button
          key={index}
          type="button"
          variant="ghost"
          size="icon-xs"
          role="tab"
          aria-selected={index === selected}
          aria-label={`Ir para o slide ${index + 1}`}
          className={cn(
            "size-2.5 rounded-full p-0",
            index === selected ? "bg-white" : "bg-white/45 hover:bg-white/70",
          )}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
