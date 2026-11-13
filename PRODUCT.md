# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui (Base UI), React Bits (GSAP/motion), static export to GitHub Pages (`NEXT_PUBLIC_BASE_PATH=/fvmultimarcas-redesign`).

## Users

Moradores de Nova Serrana–MG e região que buscam **carros ou motos seminovos** com preço, ano e km publicados; também quem quer **vender, trocar ou consignar** o veículo ou pedir **financiamento**. Secundário: visitantes vindos do Instagram, Google ou indicação que precisam de contato rápido (WhatsApp/telefone).

## Product Purpose

Site comercial da **FV Multimarcas** para apresentar o estoque publicado, facilitar busca e contato, e apoiar jornadas de venda, troca, consignação e financiamento. Sucesso: visitante encontra um veículo real, entende o preço e abre conversa com a loja sem fricção.

## Positioning

Revenda multimarcas **no Centro de Nova Serrana desde 2005**, com estoque espelhado do que a loja publica em fvmultimarcas.com.br — sem preços ou depoimentos inventados neste redesign.

## Operating Context

Loja física na R. Dimas Guimarães, 600 – Centro. Atendimento por WhatsApp e telefone fixo. Proposta de site para aprovação do cliente (Tiago), hospedada em GitHub Pages, com deploy automático na `main`.

## Capabilities and Constraints

- Rotas: início, estoque com filtros, detalhe por veículo, venda do carro, financiamento, contato.
- Dados: `data/vehicles.json` (10 veículos) e `data/reviews.json` (citações Google reais).
- Hero com carrossel de destaques, busca, modal de prévia (`?veiculo=slug`), mapa embutido.
- Não fabricar avaliações, preços FIPE ou aprovação de crédito; simulador de parcelas é exemplo, não oferta bancária.

## Brand Commitments

- Nome **FV Multimarcas**; vermelho da marca **#CF1B1C** (hero com gradiente para tons mais escuros); azul-marinho **#053C68** em CTAs de apoio.
- Animações e acabamento solicitados pelo cliente (carrossel, modal, React Bits, contraste WCAG no hero) fazem parte do escopo — não são “extras” removíveis.
- Tom: direto, local, confiável; idioma pt-BR.

## Evidence on Hand

- Fotos em `public/vehicles/`, logo em `public/brand/`, parceiros financeiros em `public/partners/`.
- Depoimentos: `data/reviews.json`; nota média Google 4,8 (66 avaliações) conforme `lib/site.ts`.
- Site de origem do estoque: https://fvmultimarcas.com.br
- Instagram: @fvmult; Facebook: FVMULTT.

## Product Principles

1. Mostrar apenas estoque e dados que a loja publicou.
2. Contato (WhatsApp) visível em mobile e desktop.
3. Performance e acessibilidade em páginas estáticas.
4. Visual comercial forte alinhado à marca vermelha, sem perder legibilidade.
5. Deploy reproduzível: build verde → Pages.

## Accessibility & Inclusion

WCAG AA alvo em texto, contrastes e foco (skip link, modais com Dialog/Drawer, `prefers-reduced-motion` no carrossel). Português do Brasil em toda a interface.
