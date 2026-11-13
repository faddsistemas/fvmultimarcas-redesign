import type { Metadata } from "next";

import { SellForm } from "@/components/sell-form";

export const metadata: Metadata = {
  title: "Venda seu carro",
  description:
    "Envie os dados do seu veículo para a FV Multimarcas avaliar venda, consignação ou troca. A mensagem abre no WhatsApp da loja.",
  alternates: { canonical: "/venda-seu-carro/" },
  openGraph: {
    title: "Venda seu carro | FV Multimarcas",
    description: "Fale com a FV Multimarcas sobre venda, consignação ou troca.",
    url: "/venda-seu-carro/",
  },
};

const paths = [
  {
    title: "Venda",
    text: "Você passa marca, ano e quilometragem. A loja responde se tem interesse em comprar e combina a avaliação no Centro.",
  },
  {
    title: "Consignação",
    text: "O veículo pode ficar anunciado pela FV. Prazo e forma de acerto são conversados com a equipe, não estão fixados neste site.",
  },
  {
    title: "Troca",
    text: "O usado entra como parte do pagamento de outro veículo do estoque. A diferença e a avaliação são feitas na loja.",
  },
];

export default function SellPage() {
  return (
    <>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10">
          <h1 className="text-3xl font-semibold md:text-4xl">Venda seu carro</h1>
          <p className="max-w-2xl text-base text-white">
            A FV compra, consigna e aceita troca. Preencha o que você sabe e a
            mensagem segue para o WhatsApp da loja. Não há cadastro nem envio
            para outro sistema.
          </p>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          {paths.map((path) => (
            <section key={path.title} className="rounded-xl bg-muted p-4">
              <h2 className="text-xl font-semibold">{path.title}</h2>
              <p className="mt-2 text-base">{path.text}</p>
            </section>
          ))}
        </div>
        <SellForm />
      </div>
    </>
  );
}
