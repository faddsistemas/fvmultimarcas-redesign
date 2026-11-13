export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

/** Prefix for raw <img> and other tags that do not go through next/image or next/link. */
export function publicPath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

export const dealer = {
  name: "FV Multimarcas",
  legalName: "FV Multimarcas",
  city: "Nova Serrana",
  state: "MG",
  street: "R. Dimas Guimarães, 600",
  neighborhood: "Centro",
  addressLine: "R. Dimas Guimarães, 600 – Centro, Nova Serrana–MG",
  whatsappE164: "5537988184344",
  whatsappDisplay: "(37) 98818-4344",
  phoneE164: "553732267328",
  phoneDisplay: "(37) 3226-7328",
  email: "ja.moto@hotmail.com",
  instagram: "https://www.instagram.com/fvmult/",
  facebook: "https://www.facebook.com/FVMULTT",
  founded: 2005,
  googleRating: 4.8,
  googleReviewCount: 66,
  mapsQuery: "R. Dimas Guimarães, 600, Centro, Nova Serrana, MG",
  fipeUrl: "https://veiculos.fipe.org.br/",
  sourceSite: "https://fvmultimarcas.com.br",
  stockCapturedOn: "2026-11-13",
} as const;

export function whatsappHref(message: string) {
  return `https://wa.me/${dealer.whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function telHref(e164: string) {
  return `tel:+${e164}`;
}

export const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(dealer.mapsQuery)}&z=16&output=embed`;

export const mapsExternalHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.mapsQuery)}`;

export const nav = [
  { href: "/", label: "Início" },
  { href: "/estoque/", label: "Estoque" },
  { href: "/venda-seu-carro/", label: "Venda seu carro" },
  { href: "/financiamento/", label: "Financiamento" },
  { href: "/contato/", label: "Contato" },
] as const;

export const containerClass = "mx-auto w-full max-w-6xl px-4";

export const services = [
  {
    title: "Financiamento",
    description:
      "A loja recebe o pedido e encaminha a análise para as financeiras parceiras. A taxa e a aprovação saem dessa análise, não de uma conta genérica.",
    href: "/financiamento/",
  },
  {
    title: "Venda do seu carro",
    description:
      "Quer vender o usado? Envie marca, ano e quilometragem pelo WhatsApp. A equipe responde com o próximo passo.",
    href: "/venda-seu-carro/",
  },
  {
    title: "Despachante",
    description:
      "Transferência e documentação podem ser tratadas na própria loja, para o comprador não correr atrás de cartório sozinho.",
    href: "/contato/",
  },
  {
    title: "Refinanciamento",
    description:
      "Se o veículo já está no seu nome, a FV encaminha o pedido de crédito com garantia nas instituições que publica como parceiras.",
    href: "/financiamento/",
  },
  {
    title: "Consignação",
    description:
      "A loja pode anunciar e negociar o seu carro. Prazo, comissão e forma de pagamento são combinados com a equipe.",
    href: "/venda-seu-carro/",
  },
  {
    title: "Compra e troca",
    description:
      "A FV compra veículos e aceita o usado como parte do pagamento de outro. A avaliação é feita na loja, no Centro.",
    href: "/venda-seu-carro/",
  },
] as const;

export const partners = [
  { name: "Banco BV", src: "/partners/bv.png" },
  { name: "Santander", src: "/partners/santander.png" },
  { name: "Itaú", src: "/partners/itau.png" },
  { name: "Bradesco", src: "/partners/bradesco.jpg" },
  { name: "Banco Pan", src: "/partners/pan.png" },
  { name: "Safra", src: "/partners/safra.png" },
  { name: "Fontecred", src: "/partners/fontecred.png" },
  {
    name: "Parceiro",
    src: "/partners/parceiro.png",
    alt: "Logotipo azul com a letra D, publicado pela FV Multimarcas entre os parceiros. O nome da instituição não está legível no arquivo.",
  },
] as const;

export const priceBands = [
  { id: "ate-20", label: "Até R$ 20 mil", min: "", max: "20000" },
  { id: "20-50", label: "R$ 20 a 50 mil", min: "20000", max: "50000" },
  { id: "50-80", label: "R$ 50 a 80 mil", min: "50000", max: "80000" },
  { id: "acima-80", label: "Acima de R$ 80 mil", min: "80000", max: "" },
] as const;

export type PriceBandId = (typeof priceBands)[number]["id"];
