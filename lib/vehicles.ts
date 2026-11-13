import rawVehicles from "@/data/vehicles.json";

export type VehicleCategory = "carro" | "moto";

export type VehiclePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Vehicle = {
  slug: string;
  title: string;
  version: string | null;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  color: string | null;
  fuel: string;
  category: VehicleCategory;
  transmission: "manual" | "automatico" | null;
  equipment: string[];
  photos: VehiclePhoto[];
  sourceUrl: string;
};

export const vehicles: Vehicle[] = rawVehicles as Vehicle[];

export function getVehicle(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function vehicleBrands() {
  return [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export function vehicleFuels() {
  return [...new Set(vehicles.map((vehicle) => vehicle.fuel))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export function vehicleColors() {
  const colors = vehicles.map((vehicle) => vehicle.color ?? "Não informada");
  return [...new Set(colors)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function relatedVehicles(vehicle: Vehicle, limit = 3) {
  const others = vehicles.filter((item) => item.slug !== vehicle.slug);
  const sameBrand = others.filter((item) => item.brand === vehicle.brand);
  const pool = sameBrand.length >= limit ? sameBrand : others;
  return [...pool]
    .sort(
      (a, b) =>
        Math.abs(a.price - vehicle.price) - Math.abs(b.price - vehicle.price),
    )
    .slice(0, limit);
}

export function vehicleName(vehicle: Vehicle) {
  return `${vehicle.brand} ${vehicle.title}`;
}

export function vehicleInquiryMessage(vehicle: Vehicle, priceLabel: string, kmLabel: string) {
  const color = vehicle.color ? `, cor ${vehicle.color}` : "";
  return `Olá, FV Multimarcas! Vi no site o ${vehicleName(vehicle)} ${vehicle.year} (${priceLabel}, ${kmLabel}${color}) e quero mais informações.`;
}
