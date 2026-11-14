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
  const mobileScale = slide.mobile.mobileScale ?? 1;
  const pictureStyle = {
    "--hero-pos-mobile": slide.mobile.objectPosition,
    "--hero-pos-desktop": slide.desktop.objectPosition,
    "--hero-mobile-scale": String(mobileScale),
  } as CSSProperties;

  return (
  <div className={cn("absolute inset-0", className)}>
      <img
        src={mobileSrc}
        alt=""
        width={slide.mobile.width}
        height={slide.mobile.height}
        decoding="async"
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover md:hidden"
        style={{
          objectPosition: slide.mobile.objectPosition,
        }}
      />
      <picture
        className="hero-art-picture absolute inset-0 block h-full w-full"
      >
        <source media="(min-width: 768px)" srcSet={desktopSrc} />
        <img
          src={mobileSrc}
          alt={slide.mobile.alt}
          width={slide.mobile.width}
          height={slide.mobile.height}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="hero-art-img h-full w-full object-cover"
          style={pictureStyle}
        />
      </picture>
    </div>
  );
}