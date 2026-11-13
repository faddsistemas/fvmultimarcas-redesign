import { dealer, mapsEmbedSrc, mapsExternalHref } from "@/lib/site";

export function LocationBlock() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Onde estamos</h2>
        <p className="text-base text-foreground">
          A loja fica na {dealer.addressLine}. O mapa abaixo aponta esse endereço.
        </p>
        <address className="flex flex-col gap-1 text-base not-italic">
          <span>{dealer.street}</span>
          <span>
            {dealer.neighborhood}, {dealer.city}–{dealer.state}
          </span>
          <a className="min-h-11 text-secondary underline-offset-4 hover:underline" href={`tel:+${dealer.whatsappE164}`}>
            {dealer.whatsappDisplay}
          </a>
          <a className="min-h-11 text-secondary underline-offset-4 hover:underline" href={`tel:+${dealer.phoneE164}`}>
            {dealer.phoneDisplay}
          </a>
          <a className="min-h-11 text-secondary underline-offset-4 hover:underline" href={`mailto:${dealer.email}`}>
            {dealer.email}
          </a>
        </address>
        <a
          className="inline-flex min-h-11 items-center text-secondary underline-offset-4 hover:underline"
          href={mapsExternalHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir o endereço no Google Maps
        </a>
      </div>
      <iframe
        title="Mapa da FV Multimarcas na Rua Dimas Guimarães, 600, Centro, Nova Serrana"
        src={mapsEmbedSrc}
        className="min-h-72 w-full rounded-xl border border-border"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
