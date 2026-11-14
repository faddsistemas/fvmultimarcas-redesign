"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "lucide-react";

import {
  HeroSlideMobileImage,
  HeroSlidePicture,
} from "@/components/hero-slide-picture";
import { Button } from "@/components/ui/button";
import { buildHeroSlides, type HeroSlideFrame } from "@/lib/hero-slides";
import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "cn";

const HERO_PANEL_BG = "#0b0b0b";

export function CinematicHero() {
  const reducedMotion = usePrefersReducedMotion();
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

  const activeSlide = slides[active];

  return (
    <section
      data-testid="cinematic-hero"
      className={cn(
        "relative isolate -mt-16 grid h-[100svh] max-h-[100svh] min-h-[100svh] w-full overflow-hidden pt-16 text-white",
        "grid-rows-[var(--hero-mobile-media)_minmax(0,1fr)]",
        "pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]",
        "md:flex md:pb-0 md:pt-[6.5rem]",
        "md:-mt-[6.5rem] md:justify-end md:bg-black",
      )}
      style={
        {
          backgroundColor: HERO_PANEL_BG,
          "--hero-mobile-media": activeSlide.mobile.mediaHeight,
        } as CSSProperties
      }
      aria-label="Destaque da FV Multimarcas"
    >
      <div
        data-testid="hero-media-mobile"
        className="relative min-h-0 w-full overflow-hidden md:hidden"
      >
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={`m-${slide.mobile.src}-${index}`}
              data-hero-slide={index}
              data-hero-slide-active={isActive ? "true" : "false"}
              className={cn(
                "absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <HeroSlideMobileImage slide={slide} priority={index === 0} />
            </div>
          );
        })}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/35 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/80 to-transparent"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        data-testid="hero-media"
        aria-hidden="true"
      >
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={`d-${slide.desktop.src}-${slide.mobile.src}-${index}`}
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
                    isActive &&
                      !reducedMotion &&
                      !paused &&
                      "md:hero-ken-burns-active",
                  )}
                >
                  <HeroSlidePicture slide={slide} priority={index === 0} />
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-[min(52%,22rem)] bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-col justify-end overflow-hidden bg-[#0b0b0b] px-4 pb-0 pt-1.5 md:mx-auto md:max-w-6xl md:flex-1 md:bg-transparent md:px-8 md:pb-16 md:pt-8">
        <div className="max-w-3xl space-y-1.5 text-left md:space-y-4">
          <p className="text-xs font-semibold tracking-wide text-white/90 md:text-sm">
            Nova Serrana · desde 2005
          </p>
          <h1 className="font-heading text-[clamp(1.35rem,5.8vw,3.5rem)] font-semibold leading-[1.06] text-white">
            Seu próximo veículo está em Nova Serrana.
          </h1>
          <p className="hidden max-w-xl text-sm text-white/88 md:block md:text-lg">
            A FV Multimarcas compra, vende, troca, consigna e financia carros e motos na Rua Dimas
            Guimarães. O estoque desta página é o que a loja publicou.
          </p>
          <div
            data-testid="hero-ctas"
            className="flex flex-wrap items-center gap-2 pt-0.5 md:gap-3 md:pt-1"
          >
            <Button
              render={<Link href="/estoque/" />}
              className="h-9 rounded-full border border-white/25 bg-white/15 px-4 text-xs text-white shadow-none backdrop-blur-md hover:bg-white/25 md:h-11 md:px-6 md:text-sm"
            >
              Ver estoque publicado
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-full border border-white/20 bg-black/20 px-3.5 text-xs text-white backdrop-blur-sm hover:bg-white/10 md:h-11 md:px-5 md:text-sm"
              onClick={scrollToSearch}
            >
              Buscar veículo
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/80 md:flex">
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
          className="absolute top-[max(4.25rem,env(safe-area-inset-top)+3.25rem)] right-2 z-20 size-9 rounded-full border border-white/20 bg-black/25 text-white opacity-80 backdrop-blur-sm hover:bg-black/40 md:top-auto md:right-4 md:bottom-5 md:size-11 md:opacity-100"
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