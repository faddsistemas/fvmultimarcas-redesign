import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { LocationBlock } from "@/components/location-block";
import { dealer } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Endereço, telefones, e-mail e redes da FV Multimarcas em Nova Serrana. Envie uma mensagem que abre no WhatsApp da loja.",
  alternates: { canonical: "/contato/" },
  openGraph: {
    title: "Contato | FV Multimarcas",
    description: "Fale com a FV Multimarcas no Centro de Nova Serrana.",
    url: "/contato/",
  },
};

export default function ContactPage() {
  return (
    <>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10">
          <h1 className="text-3xl font-semibold md:text-4xl">Contato</h1>
          <p className="max-w-2xl text-base text-white">
            A loja atende no Centro de Nova Serrana. O horário de funcionamento
            não está publicado no site atual, então não inventamos um horário aqui.
          </p>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Fale com a equipe</h2>
            <ul className="flex flex-col gap-2 text-base">
              <li>
                WhatsApp:{" "}
                <a className="text-secondary underline-offset-4 hover:underline" href={`tel:+${dealer.whatsappE164}`}>
                  {dealer.whatsappDisplay}
                </a>
              </li>
              <li>
                Fixo:{" "}
                <a className="text-secondary underline-offset-4 hover:underline" href={`tel:+${dealer.phoneE164}`}>
                  {dealer.phoneDisplay}
                </a>
              </li>
              <li>
                E-mail:{" "}
                <a className="text-secondary underline-offset-4 hover:underline" href={`mailto:${dealer.email}`}>
                  {dealer.email}
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a className="text-secondary underline-offset-4 hover:underline" href={dealer.instagram} target="_blank" rel="noopener noreferrer">
                  @fvmult
                </a>
              </li>
              <li>
                Facebook:{" "}
                <a className="text-secondary underline-offset-4 hover:underline" href={dealer.facebook} target="_blank" rel="noopener noreferrer">
                  FVMULTT
                </a>
              </li>
            </ul>
            <p className="text-base">
              Despachante, documentação e visita à loja podem ser combinados por
              esses canais.
            </p>
          </section>
          <ContactForm />
        </div>
        <LocationBlock />
      </div>
    </>
  );
}
