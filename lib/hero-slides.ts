import { featuredVehicles, type Vehicle, type VehiclePhoto } from "@/lib/vehicles";

export type HeroSlideMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition: string;
};

export type HeroSlideFrame = {
  desktop: HeroSlideMedia;
  mobile: HeroSlideMedia;
};

type HeroOverride = {
  desktopPhotoIndex?: number;
  mobilePhotoIndex?: number;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
};

/**
 * Desktop: foto mais horizontal (cover em 1280).
 * Mobile: foto vertical do anúncio (frente 3/4) com carro inteiro acima do texto.
 */
const HERO_OVERRIDES: Record<string, HeroOverride> = {
  "t-cross-2026": {
    desktopPhotoIndex: 2,
    mobilePhotoIndex: 1,
    desktopObjectPosition: "58% center",
  },
  "fiat-mobi-like-2025-cinza": {
    desktopPhotoIndex: 2,
    mobilePhotoIndex: 1,
    desktopObjectPosition: "55% center",
  },
  "fiat-mobi-like-2025-branca": {
    desktopPhotoIndex: 2,
    mobilePhotoIndex: 2,
    desktopObjectPosition: "56% center",
  },
  "fiat-argo-drive-2024": {
    desktopPhotoIndex: 4,
    mobilePhotoIndex: 2,
    desktopObjectPosition: "52% center",
  },
};

function pickLandscapePhotoIndex(vehicle: Vehicle) {
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

function pickPortraitPhotoIndex(vehicle: Vehicle) {
  let best = 0;
  let bestRatio = Number.POSITIVE_INFINITY;
  vehicle.photos.forEach((photo, index) => {
    const ratio = photo.width / photo.height;
    if (ratio < 1 && ratio < bestRatio) {
      bestRatio = ratio;
      best = index;
    }
  });
  if (bestRatio === Number.POSITIVE_INFINITY) {
    return 0;
  }
  return best;
}

function toMedia(photo: VehiclePhoto, objectPosition: string): HeroSlideMedia {
  return {
    src: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    objectPosition,
  };
}

function defaultObjectPosition(aspect: number, viewport: "desktop" | "mobile") {
  if (viewport === "desktop") {
    if (aspect >= 1.2) return "55% center";
    if (aspect >= 0.95) return "center 42%";
    return "72% 40%";
  }
  return aspect < 1 ? "center 30%" : "center 38%";
}

export function buildHeroSlides(limit = 4): HeroSlideFrame[] {
  return featuredVehicles()
    .slice(0, limit)
    .flatMap((vehicle) => {
      const override = HERO_OVERRIDES[vehicle.slug] ?? {};
      const desktopIndex =
        override.desktopPhotoIndex ?? pickLandscapePhotoIndex(vehicle);
      const mobileIndex =
        override.mobilePhotoIndex ?? pickPortraitPhotoIndex(vehicle);

      const desktopPhoto = vehicle.photos[desktopIndex];
      const mobilePhoto = vehicle.photos[mobileIndex];
      if (!desktopPhoto || !mobilePhoto) return [];

      const desktopAspect = desktopPhoto.width / desktopPhoto.height;
      const mobileAspect = mobilePhoto.width / mobilePhoto.height;

      return [
        {
          desktop: toMedia(
            desktopPhoto,
            override.desktopObjectPosition ??
              defaultObjectPosition(desktopAspect, "desktop"),
          ),
          mobile: toMedia(
            mobilePhoto,
            override.mobileObjectPosition ??
              defaultObjectPosition(mobileAspect, "mobile"),
          ),
        },
      ];
    });
}