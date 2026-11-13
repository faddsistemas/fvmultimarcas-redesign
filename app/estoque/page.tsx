import type { Metadata } from "next";

import { StockBrowser } from "@/components/stock-browser";
import { vehicleBrands, vehicleColors, vehicleFuels, vehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Estoque",
  description:
    "Estoque da FV Multimarcas em Nova Serrana: filtre por marca, ano, preço, quilometragem, câmbio, combustível e cor.",
  alternates: { canonical: "/estoque/" },
  openGraph: {
    title: "Estoque | FV Multimarcas",
    description:
      "Carros e motos publicados pela FV Multimarcas, com filtros e ordenação.",
    url: "/estoque/",
  },
};

export default function EstoquePage() {
  return (
    <>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10">
          <h1 className="text-3xl font-semibold md:text-4xl">Estoque</h1>
          <p className="max-w-2xl text-base text-white">
            {vehicles.length} anúncios publicados pela loja. Os filtros funcionam
            neste aparelho e atualizam o endereço da página, para você poder
            compartilhar a busca.
          </p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <StockBrowser
          vehicles={vehicles}
          brands={vehicleBrands()}
          fuels={vehicleFuels()}
          colors={vehicleColors()}
        />
      </div>
    </>
  );
}
