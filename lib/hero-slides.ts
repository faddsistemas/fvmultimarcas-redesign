import { featuredVehicles, type Vehicle } from "@/lib/vehicles";

export type HeroSlideFrame = {
  src: string;
  alt: string;
  width: number;
  height: number;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
};

type HeroOverride = {
  photoIndex?: number;
  desktop?: string;
  mobile?: string;
};

/** Enquadramento por veículo: foto mais aberta + ponto focal para o carro inteiro em cover. */
const HERO_OVERRIDES: Record<string, HeroOverride> = {
  "t-cross-2026": { photoIndex: 2, desktop: "58% center", mobile: "center 42%" },
  "fiat-mobi-like-2025-cinza": { photoIndex: 2, desktop: "55% center", mobile: "center 40%" },
  "fiat-mobi-like-2025-branca": { photoIndex: 2, desktop: "56% center", mobile: "center 40%" },
  "fiat-argo-drive-2024": { photoIndex: 4, desktop: "52% center", mobile: "center 44%" },
};

function pickHeroPhotoIndex(vehicle: Vehicle, override?: number) {
  if (override !== undefined) return override;
  let best = 0;
  let bestRatio = 0;
  vehicle.photos.forEach((photo, index) => {
    const ratio = photo.width / photo.height;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = index;
    }
  });
  return best;
}

function defaultObjectPosition(aspect: number, viewport: "desktop" | "mobile") {
  if (viewport === "desktop") {
    if (aspect >= 1.2) return "55% center";
    if (aspect >= 0.95) return "center 42%";
    return "72% 40%";
  }
  if (aspect >= 1.15) return "center 45%";
  return "center 38%";
}

export function buildHeroSlides(limit = 4): HeroSlideFrame[] {
  return featuredVehicles()
    .slice(0, limit)
    .flatMap((vehicle) => {
      const override = HERO_OVERRIDES[vehicle.slug] ?? {};
      const photoIndex = pickHeroPhotoIndex(vehicle, override.photoIndex);
      const photo = vehicle.photos[photoIndex];
      if (!photo) return [];

      const aspect = photo.width / photo.height;
      return [
        {
          src: photo.src,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
          desktopObjectPosition:
            override.desktop ?? defaultObjectPosition(aspect, "desktop"),
          mobileObjectPosition:
            override.mobile ?? defaultObjectPosition(aspect, "mobile"),
        },
      ];
    });
}