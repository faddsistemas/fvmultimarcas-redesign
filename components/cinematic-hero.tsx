"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import { buildHeroSlides, type HeroSlideFrame } from "@/lib/hero-slides";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "cn";

export function CinematicHero() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const slides = useMemo<HeroSlideFrame[]>(() => buildHeroSlides(4), []);

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
      className="relative isolate -mt-16 flex h-[100svh] max-h-[100svh] min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-black pt-16 text-white sm:-mt-[6.5rem] sm:pt-[6.5rem]"
      aria-label="Destaque da FV Multimarcas"
    >
      <div
        className="pointer-events-none absolute inset-0"
        data-testid="hero-media"
        aria-hidden="true"
      >
        {slides.map((slide, index) => {
          const isActive = index === active;
          const objectPosition = isMobile
            ? slide.mobileObjectPosition
            : slide.desktopObjectPosition;
          return (
            <div
              key={`${slide.src}-${index}`}
              data-hero-slide={index}
              data-hero-slide-active={isActive ? "true" : "false"}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="absolute inset-0 overflow-hidden bg-black">
                <div
                  className={cn(
                    "absolute inset-0",
                    isActive && !reducedMotion && !paused && "hero-ken-burns-active",
                  )}
                >
                  <SiteImage
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-[min(52%,22rem)] bg-gradient-to-t from-black/92 via-black/55 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:px-8 md:pb-16">
        <div className="max-w-3xl space-y-3 text-left md:space-y-4">
          <p className="text-sm font-semibold tracking-wide text-white/90">
            Nova Serrana · desde 2005
          </p>
          <h1 className="font-heading text-[clamp(1.75rem,5vw,3.5rem)] font-semibold leading-[1.06] text-white">
            Seu próximo veículo está em Nova Serrana.
          </h1>
          <p className="max-w-xl text-sm text-white/88 md:text-lg">
            A FV Multimarcas compra, vende, troca, consigna e financia carros e motos na Rua Dimas
            Guimarães. O estoque desta página é o que a loja publicou.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 md:gap-3">
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