import Link from "next/link";

import { SiteImage } from "@/components/site-image";

import CountUp from "@/components/CountUp";
import { HeroSearch } from "@/components/hero-search";
import { JsonLd } from "@/components/json-ld";
import { LocationBlock } from "@/components/location-block";
import { ScrollReveal } from "@/components/scroll-reveal";
import SpotlightCard from "@/components/SpotlightCard";
import { VehicleCard } from "@/components/vehicle-card";
import reviews from "@/data/reviews.json";
import { dealer, services, partners } from "@/lib/site";
import { vehicleBrands, vehicles } from "@/lib/vehicles";

const yearsOnMarket = new Date().getFullYear() - dealer.founded;

const reviewJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: dealer.name,
  review: reviews.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewBody: review.text,
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={reviewJsonLd} />
      <HeroSearch brands={vehicleBrands()} />
      <ScrollReveal className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">Estoque publicado</h2>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              {vehicles.length} veículos com preço, ano e quilometragem como estão no anúncio da loja.
            </p>
          </div>
          <Link
            href="/estoque/"
            className="link-animated inline-flex min-h-11 items-center text-secondary"
          >
            Abrir o estoque com filtros
          </Link>
        </div>
        <ScrollReveal as="ul" staggerMs={70} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <li key={vehicle.slug} className="min-w-0">
              <VehicleCard vehicle={vehicle} priority={index === 0} />
            </li>
          ))}
        </ScrollReveal>
      </ScrollReveal>
      <section className="bg-muted">
        <ScrollReveal className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:py-24">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">O que a loja faz</h2>
          <ScrollReveal as="ul" staggerMs={80} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <li key={service.title}>
                <SpotlightCard
                  theme="light"
                  spotlightColor="rgba(5, 60, 104, 0.28)"
                  className="flex h-full flex-col gap-3 rounded-2xl"
                >
                  <h3 className="text-xl font-semibold md:text-2xl">{service.title}</h3>
                  <p className="text-base text-foreground">{service.description}</p>
                  <Link
                    href={service.href}
                    className="link-animated mt-auto inline-flex min-h-11 items-center text-secondary"
                  >
                    Ver {service.title.toLowerCase()}
                  </Link>
                </SpotlightCard>
              </li>
            ))}
          </ScrollReveal>
        </ScrollReveal>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-4 md:py-20">
          <Stat value={yearsOnMarket} label={`anos de loja, desde ${dealer.founded}`} />
          <Stat
            value={dealer.googleRating}
            decimals={1}
            decimalSeparator=","
            label="nota no Google, publicada pela loja"
          />
          <Stat value={dealer.googleReviewCount} label="avaliações consideradas nessa nota" />
          <Stat value={vehicles.length} label="veículos neste estoque" />
        </div>
      </section>
      <ScrollReveal className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">Por que passar na FV</h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-base md:text-lg">
              <li>Endereço fixo no Centro de Nova Serrana desde {dealer.founded}.</li>
              <li>Compra, venda, troca, consignação, financiamento e despachante no mesmo lugar.</li>
              <li>Preço, ano e quilometragem visíveis antes de chamar no WhatsApp.</li>
              <li>
                Atendimento pelo celular {dealer.whatsappDisplay} e pelo fixo {dealer.phoneDisplay}.
              </li>
            </ul>
          </div>
          <SiteImage
            src="/brand/fachada.webp"
            alt="Fachada da FV Multimarcas na Rua Dimas Guimarães, 600, Centro, Nova Serrana, com a placa da loja e veículos na entrada"
            width={1200}
            height={1000}
            className="h-auto w-full rounded-2xl"
          />
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">Parceiros de financiamento</h2>
          <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
            Estes são os logotipos que a própria loja publica hoje. A presença da marca não significa
            uma taxa fechada: a condição sai da análise.
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {partners.map((partner) => (
              <li
                key={partner.src}
                className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3"
              >
                <SiteImage
                  src={partner.src}
                  alt={"alt" in partner ? partner.alt : `Logotipo ${partner.name}`}
                  width={120}
                  height={64}
                  className="h-12 w-auto object-contain"
                />
                <span className="text-sm font-medium">{partner.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
      <section className="bg-muted">
        <ScrollReveal className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:py-24">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">O que os clientes publicaram</h2>
          <p className="max-w-3xl text-base md:text-lg">
            Textos exibidos no site atual da loja, com origem indicada como Google. A nota informada é{" "}
            {dealer.googleRating.toString().replace(".", ",")} de 5, com base em {dealer.googleReviewCount}{" "}
            avaliações. Os comentários estão como foram publicados, sem correção.
          </p>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <li
                key={review.author}
                className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <blockquote className="text-base text-foreground">“{review.text}”</blockquote>
                <p className="mt-auto text-sm font-medium">{review.author}</p>
                <p className="text-sm text-muted-foreground">Avaliação publicada via Google</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <LocationBlock />
      </section>
    </>
  );
}

function Stat({
  value,
  label,
  decimals,
  decimalSeparator,
}: {
  value: number;
  label: string;
  decimals?: number;
  decimalSeparator?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <CountUp
        to={value}
        decimals={decimals}
        decimalSeparator={decimalSeparator}
        duration={1.2}
        className="font-heading text-4xl font-semibold text-white md:text-5xl"
      />
      <p className="text-sm text-white md:text-base">{label}</p>
    </div>
  );
}