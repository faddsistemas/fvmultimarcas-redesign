"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

import SplitText from "@/components/SplitText";
import TiltedCard from "@/components/TiltedCard";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { priceBands, publicPath, type PriceBandId } from "@/lib/site";

export function HeroSearch({ brands }: { brands: string[] }) {
  const router = useRouter();
  const allBrands = "Todas as marcas";
  const [marca, setMarca] = useState(allBrands);
  const [modelo, setModelo] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [band, setBand] = useState<PriceBandId | "">("");

  function applyBand(next: PriceBandId | "") {
    setBand(next);
    const selected = priceBands.find((item) => item.id === next);
    setPrecoMin(selected?.min ?? "");
    setPrecoMax(selected?.max ?? "");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (marca !== allBrands) params.set("marca", marca);
    if (modelo.trim()) params.set("q", modelo.trim());
    if (precoMin.trim()) params.set("precoMin", precoMin.trim());
    if (precoMax.trim()) params.set("precoMax", precoMax.trim());
    const query = params.toString();
    router.push(query ? `/estoque/?${query}` : "/estoque/");
  }

  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:py-14">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-wide text-white">
            Nova Serrana · desde 2005
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            <SplitText
              text="Seu próximo veículo está em Nova Serrana."
              tag="span"
              effect="blur"
              splitType="words"
              trigger="load"
              color="#ffffff"
            />
          </h1>
          <p className="max-w-xl text-base text-white">
            A FV Multimarcas compra, vende, troca, consigna e financia carros e
            motos na Rua Dimas Guimarães. O estoque desta página é o que a loja
            publicou.
          </p>
        </div>
        <TiltedCard
          imageSrc={publicPath("/vehicles/t-cross-2026/3.webp")}
          altText="Volkswagen T CROSS branco, ano 2026, fotografado na FV Multimarcas"
          containerWidth="100%"
          containerHeight="min(70vw, 420px)"
          imageWidth="100%"
          imageHeight="100%"
          rotateAmplitude={8}
          scaleOnHover={1.02}
          showTooltip={false}
          gyroscope={false}
          radius={16}
        />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-10">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-background p-4 text-foreground shadow-lg md:p-6"
          aria-labelledby="busca-titulo"
        >
          <h2 id="busca-titulo" className="text-xl font-semibold">
            Buscar no estoque
          </h2>
          <FieldGroup className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="busca-marca">Marca</FieldLabel>
                <Select
                  value={marca}
                  onValueChange={(value) => setMarca(value ?? allBrands)}
                >
                  <SelectTrigger id="busca-marca" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={allBrands}>Todas as marcas</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="busca-modelo">Modelo</FieldLabel>
                <Input
                  id="busca-modelo"
                  value={modelo}
                  onChange={(event) => setModelo(event.target.value)}
                  placeholder="Ex.: Voyage, Mobi, Pop"
                  autoComplete="off"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="busca-preco-min">Preço mínimo (R$)</FieldLabel>
                <Input
                  id="busca-preco-min"
                  inputMode="numeric"
                  value={precoMin}
                  onChange={(event) => {
                    setBand("");
                    setPrecoMin(event.target.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="busca-preco-max">Preço máximo (R$)</FieldLabel>
                <Input
                  id="busca-preco-max"
                  inputMode="numeric"
                  value={precoMax}
                  onChange={(event) => {
                    setBand("");
                    setPrecoMax(event.target.value);
                  }}
                />
              </Field>
            </div>
            <ToggleGroup
              aria-label="Faixas de preço"
              variant="outline"
              value={band ? [band] : []}
              onValueChange={(groupValue) => {
                const next = groupValue[groupValue.length - 1] ?? "";
                applyBand(next as PriceBandId | "");
              }}
              className="flex flex-wrap"
            >
              {priceBands.map((item) => (
                <ToggleGroupItem key={item.id} value={item.id} className="h-11 px-3">
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button type="submit" className="w-full sm:w-auto">
              <SearchIcon data-icon="inline-start" />
              Ver veículos
            </Button>
          </FieldGroup>
        </form>
      </div>
    </section>
  );
}
