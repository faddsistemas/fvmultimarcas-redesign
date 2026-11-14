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
      className="relative isolate -mt-16 flex h-[100svh] max-h-[100svh] min-h-[100svh] w-full flex-col overflow-hidden bg-black pt-16 text-white sm:-mt-[6.5rem] sm:pt-[6.5rem]"
      aria-label="Destaque da FV Multimarcas"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === active;
          const bg = publicPath(slide.src);
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
                  "absolute inset-0 scale-105 bg-cover bg-center",
                  isActive && !reducedMotion && !paused && "hero-bg-drift-active",
                )}
                style={{
                  backgroundImage: `url(${bg})`,
                  filter: "blur(28px) brightness(0.45) saturate(1.15)",
                }}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:h-56" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div
          className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-2 pt-2 md:min-h-0 md:pb-0"
          data-testid="hero-stage"
        >
          <div className="relative flex min-h-[min(42svh,22rem)] flex-1 items-center justify-center py-2 sm:min-h-[min(46svh,26rem)] md:min-h-0 md:flex-[1.15] md:py-4">
            {slides.map((slide, index) => {
              const isActive = index === active;
              return (
                <div
                  key={`car-${slide.src}-${index}`}
                  className={cn(
                    "absolute inset-x-4 inset-y-2 flex items-center justify-center transition-opacity duration-[1200ms] ease-out md:inset-x-8",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  <SiteImage
                    src={slide.src}
                    alt={slide.alt}
                    width={slide.width}
                    height={slide.height}
                    priority={index === 0}
                    className="max-h-full w-auto max-w-full object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                  />
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex shrink-0 flex-col gap-3 pb-10 pt-2 md:max-w-3xl md:gap-4 md:pb-14 md:pt-0">
            <p className="text-sm font-semibold tracking-wide text-white/90">
              Nova Serrana · desde 2005
            </p>
            <h1 className="font-heading text-[clamp(1.65rem,5.2vw,3.25rem)] font-semibold leading-[1.08] text-white">
              Seu próximo veículo está em Nova Serrana.
            </h1>
            <p className="max-w-xl text-sm text-white/85 md:text-base">
              A FV Multimarcas compra, vende, troca, consigna e financia carros e motos na Rua Dimas
              Guimarães. O estoque desta página é o que a loja publicou.
            </p>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Button
                render={<Link href="/estoque/" />}
                className="h-10 rounded-full border border-white/25 bg-white/15 px-5 text-sm text-white shadow-none backdrop-blur-md hover:bg-white/25 md:h-11 md:px-6"
              >
                Ver estoque publicado
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full border border-white/20 bg-black/20 px-4 text-sm text-white backdrop-blur-sm hover:bg-white/10 md:h-11 md:px-5"
                onClick={scrollToSearch}
              >
                Buscar veículo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80">
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
          className="absolute right-4 bottom-5 z-20 size-11 rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md hover:bg-black/45"
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