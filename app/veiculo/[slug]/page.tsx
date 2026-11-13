import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";

import { FinanceSimulator } from "@/components/finance-simulator";
import { JsonLd } from "@/components/json-ld";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleGallery } from "@/components/vehicle-gallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatCurrency, formatKm } from "@/lib/format";
import { absoluteUrl, dealer, telHref, whatsappHref } from "@/lib/site";
import {
  getVehicle,
  relatedVehicles,
  vehicleInquiryMessage,
  vehicleName,
  vehicles,
  type Vehicle,
} from "@/lib/vehicles";

type VehiclePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Veículo" };
  const title = `${vehicleName(vehicle)} ${vehicle.year}`;
  const description = `${title} por ${formatCurrency(vehicle.price)}, ${formatKm(vehicle.km)}, na FV Multimarcas em Nova Serrana.`;
  const image = vehicle.photos[0];
  return {
    title,
    description,
    alternates: { canonical: `/veiculo/${vehicle.slug}/` },
    openGraph: {
      title,
      description,
      url: `/veiculo/${vehicle.slug}/`,
      images: image
        ? [{ url: absoluteUrl(image.src), width: image.width, height: image.height, alt: image.alt }]
        : undefined,
    },
  };
}

function transmissionLabel(vehicle: Vehicle) {
  switch (vehicle.transmission) {
    case "manual":
      return "Manual";
    case "automatico":
      return "Automático";
    case null:
      return "Não informado no anúncio";
    default: {
      const exhaustive: never = vehicle.transmission;
      return exhaustive;
    }
  }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const price = formatCurrency(vehicle.price);
  const km = formatKm(vehicle.km);
  const name = vehicleName(vehicle);
  const inquiry = whatsappHref(vehicleInquiryMessage(vehicle, price, km));
  const pageUrl = absoluteUrl(`/veiculo/${vehicle.slug}/`);
  const related = relatedVehicles(vehicle);
  const specs = [
    ["Marca", vehicle.brand],
    ["Modelo", vehicle.model],
    ["Versão", vehicle.version ?? "Não informada no anúncio"],
    ["Ano", String(vehicle.year)],
    ["Quilometragem", km],
    ["Cor", vehicle.color ?? "Não informada no anúncio"],
    ["Combustível", vehicle.fuel],
    ["Câmbio", transmissionLabel(vehicle)],
    ["Tipo", categoryLabel(vehicle.category)],
  ];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${name} ${vehicle.year}`,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.km,
      unitCode: "KMT",
    },
    fuelType: vehicle.fuel,
    vehicleConfiguration: categoryLabel(vehicle.category),
    image: vehicle.photos.map((photo) => absoluteUrl(photo.src)),
    url: pageUrl,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      seller: { "@type": "AutoDealer", name: dealer.name },
    },
  };
  if (vehicle.color) jsonLd.color = vehicle.color;

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/estoque/" />}>Estoque</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {name} {vehicle.year}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <VehicleGallery photos={vehicle.photos} title={`${name} ${vehicle.year}`} />
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-medium text-muted-foreground">
            {vehicle.brand} · {categoryLabel(vehicle.category)}
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {name} {vehicle.year}
          </h1>
          <p className="text-base">
            {km}
            <span aria-hidden="true"> · </span>
            {vehicle.color ?? "Cor não informada"}
            <span aria-hidden="true"> · </span>
            {vehicle.fuel}
          </p>
          <div className="rounded-xl bg-secondary p-5 text-secondary-foreground">
            <p className="text-sm">Preço anunciado</p>
            <p className="font-heading text-4xl font-semibold">{price}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button render={<a href={inquiry} target="_blank" rel="noopener noreferrer" />}>
                <MessageCircleIcon data-icon="inline-start" />
                Chamar no WhatsApp
              </Button>
              <Button
                variant="outline"
                render={<a href={telHref(dealer.whatsappE164)} />}
              >
                <PhoneIcon data-icon="inline-start" />
                Ligar {dealer.whatsappDisplay}
              </Button>
            </div>
          </div>
          <a
            className="text-sm text-secondary underline-offset-4 hover:underline"
            href={vehicle.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conferir este anúncio no site atual
          </a>
        </div>
      </div>
      <section className="flex flex-col gap-3" aria-labelledby="ficha-titulo">
        <h2 id="ficha-titulo" className="text-2xl font-semibold">
          Ficha técnica
        </h2>
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2">
          {specs.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 bg-card px-4 py-3">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="flex flex-col gap-3" aria-labelledby="equipamentos-titulo">
        <h2 id="equipamentos-titulo" className="text-2xl font-semibold">
          Equipamentos
        </h2>
        {vehicle.equipment.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {vehicle.equipment.map((item) => (
              <li key={item} className="rounded-lg bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-2xl text-base">
            Este anúncio não traz a lista de equipamentos. Peça o detalhe no
            WhatsApp, citando o {name} {vehicle.year}.
          </p>
        )}
      </section>
      <FinanceSimulator price={vehicle.price} lockPrice />
      <p className="text-base">
        Para a referência oficial de preço de mercado, consulte a{" "}
        <a
          className="text-secondary underline-offset-4 hover:underline"
          href={dealer.fipeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          tabela FIPE
        </a>
        . Este site não calcula e não substitui essa consulta.
      </p>
      {related.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Outros da loja</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <VehicleCard vehicle={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
