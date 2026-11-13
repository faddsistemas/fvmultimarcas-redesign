"use client";

import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { whatsappHref } from "@/lib/site";

const interests = [
  { value: "vender", label: "Vender" },
  { value: "consignar", label: "Consignar" },
  { value: "trocar", label: "Dar na troca" },
] as const;

type Interest = (typeof interests)[number]["value"];

export function SellForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [interest, setInterest] = useState<Interest>("vender");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; vehicle?: string }>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome.";
    if (phone.trim().length < 8) nextErrors.phone = "Informe um telefone com DDD.";
    if (!vehicle.trim()) nextErrors.vehicle = "Informe marca e modelo.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const interestLabel = interests.find((item) => item.value === interest)?.label ?? "Vender";
    const message = [
      "Olá, FV Multimarcas! Quero falar sobre o meu veículo.",
      `Nome: ${name.trim()}`,
      `Telefone: ${phone.trim()}`,
      `Interesse: ${interestLabel}`,
      `Veículo: ${vehicle.trim()}`,
      year.trim() ? `Ano: ${year.trim()}` : null,
      km.trim() ? `Quilometragem: ${km.trim()}` : null,
      note.trim() ? `Observação: ${note.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-4 md:p-6" noValidate>
      <FieldGroup>
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="venda-nome">Nome</FieldLabel>
          <Input
            id="venda-nome"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>
        <Field data-invalid={errors.phone ? true : undefined}>
          <FieldLabel htmlFor="venda-telefone">Telefone</FieldLabel>
          <Input
            id="venda-telefone"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            aria-invalid={errors.phone ? true : undefined}
            onChange={(event) => setPhone(event.target.value)}
          />
          {errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
        </Field>
        <Field data-invalid={errors.vehicle ? true : undefined}>
          <FieldLabel htmlFor="venda-veiculo">Marca e modelo</FieldLabel>
          <Input
            id="venda-veiculo"
            value={vehicle}
            aria-invalid={errors.vehicle ? true : undefined}
            onChange={(event) => setVehicle(event.target.value)}
          />
          {errors.vehicle ? <FieldError>{errors.vehicle}</FieldError> : null}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="venda-ano">Ano</FieldLabel>
            <Input
              id="venda-ano"
              inputMode="numeric"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="venda-km">Quilometragem</FieldLabel>
            <Input
              id="venda-km"
              inputMode="numeric"
              value={km}
              onChange={(event) => setKm(event.target.value)}
            />
          </Field>
        </div>
        <FieldSet>
          <FieldLegend>O que você quer fazer</FieldLegend>
          <ToggleGroup
            aria-label="Tipo de interesse"
            value={[interest]}
            onValueChange={(groupValue) => {
              const next = groupValue[groupValue.length - 1];
              if (next === "vender" || next === "consignar" || next === "trocar") {
                setInterest(next);
              }
            }}
            className="flex flex-wrap"
          >
            {interests.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} className="h-11 px-3">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldSet>
        <Field>
          <FieldLabel htmlFor="venda-nota">Observação</FieldLabel>
          <Textarea
            id="venda-nota"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-28"
          />
        </Field>
        <Button type="submit">
          <MessageCircleIcon data-icon="inline-start" />
          Abrir WhatsApp com esta mensagem
        </Button>
        <p className="text-sm text-muted-foreground">
          O formulário não envia dados para um servidor. Ele só monta a mensagem e
          abre o WhatsApp da loja.
        </p>
      </FieldGroup>
    </form>
  );
}
