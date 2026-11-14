import type { CSSProperties } from "react";

import { publicPath } from "@/lib/site";
import type { HeroSlideFrame } from "@/lib/hero-slides";
import { cn } from "cn";

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
  const mobileSrc = publicPath(slide.mobile.src);

  return (
    <picture className={cn("hero-art-picture absolute inset-0 block h-full w-full", className)}>
      <source media="(min-width: 768px)" srcSet={desktopSrc} />
      <img
        src={mobileSrc}
        alt={slide.mobile.alt}
        width={slide.mobile.width}
        height={slide.mobile.height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="hero-art-img h-full w-full object-cover"
        style={
          {
            "--hero-pos-mobile": slide.mobile.objectPosition,
            "--hero-pos-desktop": slide.desktop.objectPosition,
          } as CSSProperties
        }
      />
    </picture>
  );
}