import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, dealer, siteUrl } from "@/lib/site";

import "./globals.css";

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading-family",
  display: "swap",
});

const description =
  "FV Multimarcas, no Centro de Nova Serrana–MG: estoque de carros e motos, financiamento, troca, consignação e despachante.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FV Multimarcas | Carros e motos em Nova Serrana",
    template: "%s | FV Multimarcas",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: dealer.name,
    title: "FV Multimarcas | Carros e motos em Nova Serrana",
    description,
    url: "/",
    images: [{ url: absoluteUrl("/brand/og.webp"), width: 1200, height: 630, alt: "FV Multimarcas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FV Multimarcas",
    description,
    images: [absoluteUrl("/brand/og.webp")],
  },
};

const dealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: dealer.name,
  url: siteUrl,
  image: absoluteUrl("/brand/logo.webp"),
  telephone: [`+${dealer.whatsappE164}`, `+${dealer.phoneE164}`],
  email: dealer.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: dealer.street,
    addressLocality: dealer.city,
    addressRegion: dealer.state,
    addressCountry: "BR",
  },
  sameAs: [dealer.instagram, dealer.facebook],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: dealer.googleRating,
    reviewCount: dealer.googleReviewCount,
    bestRating: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={dealerJsonLd} />
        <a
          href="#conteudo"
          className="absolute top-3 left-3 z-50 -translate-y-24 rounded-lg bg-background px-4 py-3 text-foreground focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileContactBar />
      </body>
    </html>
  );
}
