"use client";

import { MessageCircleIcon } from "lucide-react";

import SpotlightCard from "@/components/SpotlightCard";
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
    <SpotlightCard
      theme="light"
      spotlightColor="rgba(207, 27, 28, 0.35)"
      className="flex h-full flex-col p-0"
    >
      <article className="flex h-full flex-col">
        <button
          type="button"
          className="flex w-full flex-col gap-3 text-left"
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
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            />
            <Badge variant="secondary" className="absolute top-3 left-3 h-7 px-2">
              {categoryLabel(vehicle.category)}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
            <h3 className="font-heading text-xl font-semibold text-foreground">
              {vehicle.title}
            </h3>
            <p className="text-sm text-foreground">
              {vehicle.year}
              <span aria-hidden="true"> · </span>
              {km}
              <span aria-hidden="true"> · </span>
              {vehicle.color ?? "Cor não informada"}
            </p>
          </div>
        </button>
        <a href={vehicleDetailHref(vehicle.slug)} className="sr-only">
          Abrir página completa de {vehicleName(vehicle)}
        </a>
        <div className="mt-auto flex flex-col gap-3 px-4 pt-3 pb-4">
          <p className="font-heading text-2xl font-semibold text-secondary">{price}</p>
          <Button
            variant="outline"
            render={<a href={href} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon data-icon="inline-start" />
            Chamar no WhatsApp
          </Button>
          <p className="sr-only">{vehicleName(vehicle)}</p>
        </div>
      </article>
    </SpotlightCard>
  );
}
