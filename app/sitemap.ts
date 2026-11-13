import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { vehicles } from "@/lib/vehicles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-13");
  const pages = ["/", "/estoque/", "/venda-seu-carro/", "/contato/"];
  return [
    ...pages.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...vehicles.map((vehicle) => ({
      url: absoluteUrl(`/veiculo/${vehicle.slug}/`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
