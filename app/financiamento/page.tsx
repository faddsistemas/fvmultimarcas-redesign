import type { Metadata } from "next";
import Link from "next/link";

import { FinanceSimulator } from "@/components/finance-simulator";
import { PageHero } from "@/components/page-hero";
import { dealer } from "@/lib/site";

export const metadata: Metadata = {
  title: "Financiamento",
  description:
    "A FV Multimarcas encaminha financiamento e refinanciamento em Nova Serrana. A simulação desta página é um exemplo, não uma oferta.",
  alternates: { canonical: "/financiamento/" },
  openGraph: {
    title: "Financiamento | FV Multimarcas",
    description:
      "Como a loja trata financiamento e refinanciamento, com simulador marcado como exemplo.",
    url: "/financiamento/",
  },
};

export default function FinancingPage() {
  return (
    <>
      <PageHero>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10">
          <h1 className="text-3xl font-semibold md:text-4xl">Financiamento</h1>
          <p className="max-w-2xl text-base text-primary-foreground/90">
            A loja recebe o pedido e encaminha a análise para as financeiras
            cujos logotipos publica. Este site não promete taxa, entrada nem
            aprovação.
          </p>
        </div>
      </PageHero>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-xl bg-muted p-4">
            <h2 className="text-xl font-semibold">1. Escolha o veículo</h2>
            <p className="mt-2 text-base">
              Veja o{" "}
              <Link className="text-secondary underline-offset-4 hover:underline" href="/estoque/">
                estoque
              </Link>{" "}
              ou leve outro veículo para a conversa.
            </p>
          </section>
          <section className="rounded-xl bg-muted p-4">
            <h2 className="text-xl font-semibold">2. A loja analisa</h2>
            <p className="mt-2 text-base">
              A equipe pede os dados e encaminha o crédito. O retorno é da
              financeira, não desta página.
            </p>
          </section>
          <section className="rounded-xl bg-muted p-4">
            <h2 className="text-xl font-semibold">3. Refinanciamento</h2>
            <p className="mt-2 text-base">
              Se o veículo já é seu, a FV também trata pedido de refinanciamento
              com as instituições parceiras.
            </p>
          </section>
        </div>
        <FinanceSimulator price={null} />
        <p className="text-base">
          Dúvida sobre documentação ou despachante: fale no{" "}
          <a className="text-secondary underline-offset-4 hover:underline" href={`tel:+${dealer.whatsappE164}`}>
            {dealer.whatsappDisplay}
          </a>{" "}
          ou pela{" "}
          <Link className="text-secondary underline-offset-4 hover:underline" href="/contato/">
            página de contato
          </Link>
          .
        </p>
      </div>
    </>
  );
}
