"use client";

import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappHref } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome.";
    if (phone.trim().length < 8) nextErrors.phone = "Informe um telefone com DDD.";
    if (message.trim().length < 5) nextErrors.message = "Escreva o que você precisa.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const text = [
      "Olá, FV Multimarcas! Entrei em contato pelo site.",
      `Nome: ${name.trim()}`,
      `Telefone: ${phone.trim()}`,
      message.trim(),
    ].join("\n");
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-4 md:p-6" noValidate>
      <FieldGroup>
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="contato-nome">Nome</FieldLabel>
          <Input
            id="contato-nome"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name ? <FieldError>{errors.name}</FieldError> : null}
        </Field>
        <Field data-invalid={errors.phone ? true : undefined}>
          <FieldLabel htmlFor="contato-telefone">Telefone</FieldLabel>
          <Input
            id="contato-telefone"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            aria-invalid={errors.phone ? true : undefined}
            onChange={(event) => setPhone(event.target.value)}
          />
          {errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
        </Field>
        <Field data-invalid={errors.message ? true : undefined}>
          <FieldLabel htmlFor="contato-mensagem">Mensagem</FieldLabel>
          <Textarea
            id="contato-mensagem"
            value={message}
            className="min-h-28"
            aria-invalid={errors.message ? true : undefined}
            onChange={(event) => setMessage(event.target.value)}
          />
          {errors.message ? <FieldError>{errors.message}</FieldError> : null}
        </Field>
        <Button type="submit">
          <MessageCircleIcon data-icon="inline-start" />
          Abrir WhatsApp
        </Button>
      </FieldGroup>
    </form>
  );
}
