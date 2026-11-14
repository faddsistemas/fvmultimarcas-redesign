"use client";

import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { VehiclePreviewGallery } from "@/components/vehicle-preview-gallery";
import { useVehiclePreview } from "@/components/vehicle-preview-provider";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatCurrency, formatKm } from "@/lib/format";
import { whatsappHref } from "@/lib/site";
import {
  vehicleDetailPath,
  vehicleInquiryMessage,
  vehicleName,
  type Vehicle,
} from "@/lib/vehicles";
import { cn } from "cn";

function transmissionLabel(vehicle: Vehicle) {
  switch (vehicle.transmission) {
    case "manual":
      return "Manual";
    case "automatico":
      return "Automático";
    case null:
      return "Não informado";
    default: {
      const exhaustive: never = vehicle.transmission;
      return exhaustive;
    }
  }
}

export function VehiclePreviewBody({
  vehicle,
  compact,
}: {
  vehicle: Vehicle;
  compact?: boolean;
}) {
  const { closePreview } = useVehiclePreview();
  const price = formatCurrency(vehicle.price);
  const km = formatKm(vehicle.km);
  const name = vehicleName(vehicle);
  const wa = whatsappHref(vehicleInquiryMessage(vehicle, price, km));

  const specs = [
    { label: "Ano", value: String(vehicle.year) },
    { label: "Quilometragem", value: km },
    { label: "Cor", value: vehicle.color ?? "Não informada" },
    { label: "Combustível", value: vehicle.fuel },
    { label: "Câmbio", value: transmissionLabel(vehicle) },
    { label: "Categoria", value: categoryLabel(vehicle.category) },
  ];

  return (
    <div
      data-testid="vehicle-preview-body"
      className={cn(
        "grid w-full max-w-full min-w-0",
        compact
          ? "min-h-0 flex-1 grid-rows-[auto_1fr] grid-cols-1 gap-2 overflow-hidden"
          : "gap-4 md:grid-cols-2 md:gap-6",
      )}
    >
      <VehiclePreviewGallery
        key={vehicle.slug}
        photos={vehicle.photos}
        title={name}
        compact={compact}
      />
      <div
        className={cn(
          "flex min-h-0 min-w-0 w-full flex-col overflow-hidden",
          compact ? "gap-1.5" : "gap-3 overflow-x-hidden overflow-y-auto",
        )}
      >
        <PreviewHeader compact={compact} vehicle={vehicle} name={name} price={price} />
        <dl
          className={cn(
            "grid shrink-0 grid-cols-2 gap-x-2",
            compact ? "gap-y-1 text-xs" : "gap-y-2 text-sm",
          )}
        >
          {specs.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-col gap-0">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="truncate font-medium text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
        {vehicle.equipment.length > 0 ? (
          <p
            className={cn(
              "shrink-0 text-muted-foreground",
              compact ? "line-clamp-1 text-[0.7rem] leading-snug" : "line-clamp-2 text-sm",
            )}
          >
            <span className="font-medium text-foreground">Destaques: </span>
            {vehicle.equipment.slice(0, compact ? 4 : 6).join(" · ")}
          </p>
        ) : null}
        <div
          className={cn(
            "mt-auto flex shrink-0 flex-col gap-1.5 pt-0.5",
            compact ? "" : "gap-2 sm:flex-row",
          )}
        >
          <Button
            className={cn(
              "w-full whitespace-normal",
              compact ? "h-9 px-3 text-xs" : "sm:flex-1",
            )}
            render={
              <Link
                href={vehicleDetailPath(vehicle.slug)}
                onClick={() => closePreview()}
              />
            }
          >
            Ver anúncio completo
          </Button>
          <Button
            variant="secondary"
            className={cn(
              "w-full whitespace-normal",
              compact ? "h-9 px-3 text-xs" : "sm:flex-1",
            )}
            render={<a href={wa} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon data-icon="inline-start" className={compact ? "size-3.5" : undefined} />
            Chamar no WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewHeader({
  compact,
  vehicle,
  name,
  price,
}: {
  compact?: boolean;
  vehicle: Vehicle;
  name: string;
  price: string;
}) {
  return (
    <header className="shrink-0 space-y-0">
      <p className={cn("text-muted-foreground", compact ? "text-[0.7rem]" : "text-sm")}>
        {vehicle.brand}
      </p>
      <h2
        id="vehicle-preview-heading"
        className={cn(
          "font-heading font-semibold leading-tight text-foreground",
          compact ? "text-base" : "text-2xl",
        )}
      >
        {name}
        {vehicle.version ? (
          <span
            className={cn(
              "block font-normal text-muted-foreground",
              compact ? "text-xs" : "text-base",
            )}
          >
            {vehicle.version}
          </span>
        ) : null}
      </h2>
      <p
        className={cn(
          "font-heading font-semibold text-secondary",
          compact ? "text-lg" : "text-2xl",
        )}
      >
        {price}
      </p>
    </header>
  );
}