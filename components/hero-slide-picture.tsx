import type { CSSProperties } from "react";

import { publicPath } from "@/lib/site";
import type { HeroSlideFrame } from "@/lib/hero-slides";
import { cn } from "cn";

/** Full-bleed desktop art direction (picture + cover). */
export function HeroSlidePicture({
  slide,
  priority,
  className,
}: {
  slide: HeroSlideFrame;
  priority?: boolean;
  className?: string;
}) {
  const desktopSrc = publicPath(slide.desktop.src);
  const pictureStyle = {
    "--hero-pos-desktop": slide.desktop.objectPosition,
  } as CSSProperties;

  return (
    <picture
      className={cn("hero-art-picture absolute inset-0 block h-full w-full", className)}
    >
      <source media="(min-width: 768px)" srcSet={desktopSrc} />
      <img
        src={desktopSrc}
        alt={slide.desktop.alt}
        width={slide.desktop.width}
        height={slide.desktop.height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="hero-art-img hidden h-full w-full object-cover md:block"
        style={pictureStyle}
      />
    </picture>
  );
}

/** Mobile: uma foto vertical, largura total, altura automática (carro inteiro). */
export function HeroSlideMobileImage({
  slide,
  priority,
}: {
  slide: HeroSlideFrame;
  priority?: boolean;
}) {
  const mobileSrc = publicPath(slide.mobile.src);
  return (
    <img
      data-hero-slide-img="true"
      src={mobileSrc}
      alt={slide.mobile.alt}
      width={slide.mobile.width}
      height={slide.mobile.height}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="mx-auto block h-auto max-h-[min(44svh,17.5rem)] w-full max-w-full object-contain object-top"
    />
  );
}