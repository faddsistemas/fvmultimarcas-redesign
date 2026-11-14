"use client";

import { ArrowRightIcon, MessageCircleIcon } from "lucide-react";

import { useVehiclePreview } from "@/components/vehicle-preview-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehiclePhoto } from "@/components/vehicle-photo";
import { categoryLabel, formatCurrency, formatKm } from "@/lib/format";
import { whatsappHref } from "@/lib/site";
import {
  vehicleDetailHref,
  vehicleInquiryMessage,
  vehicleName,
  type Vehicle,
} from "@/lib/vehicles";
import { cn } from "cn";

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const { openPreview } = useVehiclePreview();
  const price = formatCurrency(vehicle.price);
  const km = formatKm(vehicle.km);
  const href = whatsappHref(vehicleInquiryMessage(vehicle, price, km));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border/80">
      <button
        type="button"
        className="relative flex w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey) {
            window.open(vehicleDetailHref(vehicle.slug), "_blank", "noopener");
            return;
          }
          openPreview(vehicle);
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <VehiclePhoto
            photo={vehicle.photos[0]}
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transform-none",
              "motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]",
            )}
          />
          <Badge variant="secondary" className="absolute top-3 left-3 z-10 h-7 px-2">
            {categoryLabel(vehicle.category)}
          </Badge>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="min-w-0 flex flex-col gap-0.5 text-white">
              <p className="text-xs font-medium tracking-wide text-white/80">{vehicle.brand}</p>
              <h3 className="truncate font-heading text-lg font-semibold">{vehicle.title}</h3>
              <p className="text-xs text-white/85">
                {vehicle.year}
                <span aria-hidden="true"> · </span>
                {km}
              </p>
            </div>
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm",
                "transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5",
              )}
              aria-hidden="true"
            >
              <ArrowRightIcon className="size-4" />
            </span>
          </div>
        </div>
      </button>
      <a href={vehicleDetailHref(vehicle.slug)} className="sr-only">
        Abrir página completa de {vehicleName(vehicle)}
      </a>
      <div className="flex flex-col gap-3 px-4 py-4">
        <p className="font-heading text-2xl font-semibold text-secondary">{price}</p>
        <Button
          variant="outline"
          className="transition-colors duration-200"
          render={<a href={href} target="_blank" rel="noopener noreferrer" />}
        >
          <MessageCircleIcon data-icon="inline-start" />
          Chamar no WhatsApp
        </Button>
      </div>
    </article>
  );
}