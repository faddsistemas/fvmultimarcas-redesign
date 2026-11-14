"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import { publicPath } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { featuredVehicles } from "@/lib/vehicles";
import { cn } from "cn";

type HeroSlide = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function CinematicHero() {
  const reducedMotion = usePrefersReducedMotion();
  const slides = useMemo<HeroSlide[]>(() => {
    const featured = featuredVehicles();
    return featured.slice(0, 4).flatMap((vehicle) => {
      const photo = vehicle.photos[0];
      if (!photo) return [];
      return [
        {
          src: photo.src,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
        },
      ];
    });
  }, []);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((index) => (index + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (reducedMotion || paused || slides.length < 2) return;
    const id = window.setInterval(advance, 9000);
    return () => window.clearInterval(id);
  }, [advance, paused, reducedMotion, slides.length]);

  const scrollToSearch = () => {
    const target = document.getElementById("busca-estoque");
    target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      data-testid="cinematic-hero"
      className="relative isolate -mt-16 flex min-h-[min(100svh,52rem)] w-full flex-col justify-end overflow-hidden bg-black pt-16 text-white sm:-mt-[6.5rem] sm:pt-[6.5rem] md:min-h-[100svh]"
      aria-label="Destaque da FV Multimarcas"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={`${slide.src}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "hero-ken-burns absolute inset-[-4%] bg-cover bg-center",
                  isActive && !reducedMotion && !paused && "hero-ken-burns-active",
                )}
                style={{ backgroundImage: `url(${publicPath(slide.src)})` }}
              />
              <SiteImage
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                priority={index === 0}
                className="sr-only"
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 via-black/45 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-12 pt-8 md:pb-16 md:pt-12">
        <p className="text-sm font-semibold tracking-wide text-white/90">
          Nova Serrana · desde 2005
        </p>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.08] text-white md:text-5xl lg:text-6xl">
          Seu próximo veículo está em Nova Serrana.
        </h1>
        <p className="max-w-xl text-base text-white/85 md:text-lg">
          A FV Multimarcas compra, vende, troca, consigna e financia carros e motos na Rua Dimas
          Guimarães. O estoque desta página é o que a loja publicou.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            render={<Link href="/estoque/" />}
            className="h-11 rounded-full border border-white/25 bg-white/15 px-6 text-white shadow-none backdrop-blur-md hover:bg-white/25"
          >
            Ver estoque publicado
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-full border border-white/20 bg-black/20 px-5 text-white backdrop-blur-sm hover:bg-white/10"
            onClick={scrollToSearch}
          >
            Buscar veículo
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80">
        <button
          type="button"
          onClick={scrollToSearch}
          className="flex min-h-11 min-w-11 flex-col items-center justify-center rounded-full transition-colors duration-200 hover:text-white"
          aria-label="Rolar para a busca no estoque"
        >
          <ChevronDownIcon className="size-6 motion-safe:animate-bounce" aria-hidden="true" />
        </button>
      </div>

      {slides.length > 1 ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 bottom-6 z-10 size-11 rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md hover:bg-black/45"
          aria-pressed={paused}
          aria-label={paused ? "Retomar movimento do destaque" : "Pausar movimento do destaque"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
        </Button>
      ) : null}
    </section>
  );
}