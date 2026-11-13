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
      className={`grid w-full max-w-full min-w-0 gap-4 ${compact ? "min-h-0 grid-cols-1" : "md:grid-cols-2 md:gap-6"}`}
    >
      <VehiclePreviewGallery
        key={vehicle.slug}
        photos={vehicle.photos}
        title={name}
        compact={compact}
      />
      <div className="flex min-h-0 min-w-0 w-full flex-col gap-3 overflow-x-hidden overflow-y-auto">
        <PreviewHeader compact={compact} vehicle={vehicle} name={name} price={price} />
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          {specs.map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="font-medium text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
        {vehicle.equipment.length > 0 ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Destaques: </span>
            {vehicle.equipment.slice(0, 6).join(" · ")}
          </p>
        ) : null}
        <div className="mt-auto flex shrink-0 flex-col gap-2 pt-1 sm:flex-row">
          <Button
            className="w-full whitespace-normal sm:flex-1"
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
            className="w-full whitespace-normal sm:flex-1"
            render={<a href={wa} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon data-icon="inline-start" />
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
    <header className="shrink-0 space-y-1">
      <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
      <h2
        id="vehicle-preview-heading"
        className={`font-heading font-semibold text-foreground ${compact ? "text-xl" : "text-2xl"}`}
      >
        {name}
        {vehicle.version ? (
          <span className="block text-base font-normal text-muted-foreground">
            {vehicle.version}
          </span>
        ) : null}
      </h2>
      <p className="font-heading text-2xl font-semibold text-secondary">{price}</p>
    </header>
  );
}
