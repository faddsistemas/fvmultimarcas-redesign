import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehiclePhoto } from "@/components/vehicle-photo";
import { categoryLabel, formatCurrency, formatKm } from "@/lib/format";
import { whatsappHref } from "@/lib/site";
import { vehicleInquiryMessage, vehicleName, type Vehicle } from "@/lib/vehicles";

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
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
        <Link href={`/veiculo/${vehicle.slug}/`} className="flex flex-col gap-3">
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
        </Link>
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
