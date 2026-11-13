"use client";

import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/format";

function installment(principal: number, monthlyRate: number, months: number) {
  if (principal <= 0 || months <= 0) return null;
  if (monthlyRate === 0) return principal / months;
  const growth = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function FinanceSimulator({
  price,
  lockPrice = false,
}: {
  price: number | null;
  lockPrice?: boolean;
}) {
  const [amount, setAmount] = useState(price ? String(price) : "");
  const [downPayment, setDownPayment] = useState(
    price ? String(Math.round(price * 0.2)) : "",
  );
  const [months, setMonths] = useState(48);
  const [rate, setRate] = useState("1.99");

  const result = useMemo(() => {
    const vehiclePrice = Number(amount.replace(",", "."));
    const down = Number((downPayment || "0").replace(",", "."));
    const monthlyRate = Number(rate.replace(",", ".")) / 100;
    if (!Number.isFinite(vehiclePrice) || vehiclePrice <= 0) {
      return { error: "Informe um valor maior que zero." };
    }
    if (!Number.isFinite(down) || down < 0) {
      return { error: "A entrada precisa ser zero ou um valor positivo." };
    }
    if (down >= vehiclePrice) {
      return { error: "A entrada está igual ou maior que o valor informado." };
    }
    if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
      return { error: "A taxa de exemplo precisa ser zero ou positiva." };
    }
    const financed = vehiclePrice - down;
    const payment = installment(financed, monthlyRate, months);
    if (payment === null) return { error: "Não foi possível calcular esta combinação." };
    const total = payment * months + down;
    return {
      error: null,
      payment,
      financed,
      total,
      interest: total - vehiclePrice,
    };
  }, [amount, downPayment, months, rate]);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5" aria-labelledby="simulacao-titulo">
      <div className="flex flex-col gap-2">
        <h2 id="simulacao-titulo" className="text-2xl font-semibold">
          Simulação de parcela
        </h2>
        <Alert role="note">
          <AlertTitle>Isto não é uma proposta da loja nem de um banco.</AlertTitle>
          <AlertDescription>
            A taxa começa em 1,99% ao mês só como exemplo editável. A parcela real
            depende da análise de crédito e das condições da financeira.
          </AlertDescription>
        </Alert>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sim-valor">
            {lockPrice ? "Preço anunciado (R$)" : "Valor de exemplo (R$)"}
          </FieldLabel>
          <Input
            id="sim-valor"
            inputMode="decimal"
            value={amount}
            readOnly={lockPrice}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sim-entrada">Entrada de exemplo (R$)</FieldLabel>
          <Input
            id="sim-entrada"
            inputMode="decimal"
            value={downPayment}
            onChange={(event) => setDownPayment(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sim-prazo">Prazo: {months} meses</FieldLabel>
          <Slider
            id="sim-prazo"
            min={12}
            max={60}
            step={6}
            value={[months]}
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              if (typeof next === "number") setMonths(next);
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sim-taxa">Taxa de exemplo ao mês (%)</FieldLabel>
          <Input
            id="sim-taxa"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
        </Field>
      </FieldGroup>
      {result.error ? (
        <p className="text-sm text-destructive" role="status">
          {result.error}
        </p>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-secondary p-3 text-secondary-foreground">
            <dt className="text-sm">Parcela de exemplo</dt>
            <dd className="text-2xl font-semibold">{formatCurrency(result.payment ?? 0)}</dd>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-sm text-muted-foreground">Valor financiado</dt>
            <dd className="text-xl font-semibold">{formatCurrency(result.financed ?? 0)}</dd>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <dt className="text-sm text-muted-foreground">Total da simulação</dt>
            <dd className="text-xl font-semibold">{formatCurrency(result.total ?? 0)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
