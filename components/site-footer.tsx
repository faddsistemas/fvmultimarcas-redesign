import Link from "next/link";

import { dealer, nav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <p className="font-heading text-lg font-semibold">{dealer.name}</p>
          <p className="text-sm text-white">
            Loja de carros e motos no Centro de Nova Serrana, em atividade desde{" "}
            {dealer.founded}.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Páginas</p>
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Contato</p>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`tel:+${dealer.whatsappE164}`}>
                WhatsApp {dealer.whatsappDisplay}
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`tel:+${dealer.phoneE164}`}>
                Fixo {dealer.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`mailto:${dealer.email}`}>
                {dealer.email}
              </a>
            </li>
            <li>{dealer.addressLine}</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Redes</p>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
                href={dealer.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @fvmult
              </a>
            </li>
            <li>
              <a
                className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
                href={dealer.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook FVMULTT
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-white">
          <p>
            Proposta de site. Preços, quilometragem, cores e fotos foram
            reproduzidos do estoque publicado em {dealer.sourceSite} em 13 de
            novembro de 2026. Confirme a disponibilidade com a loja.
          </p>
          <p>© {dealer.founded}–{new Date().getFullYear()} {dealer.name}</p>
        </div>
      </div>
    </footer>
  );
}
