import { SiteImage } from "@/components/site-image";
import type { VehiclePhoto } from "@/lib/vehicles";
import { cn } from "cn";

export function VehiclePhoto({
  photo,
  sizes,
  priority = false,
  className,
}: {
  photo: VehiclePhoto | undefined;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!photo) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary px-4 text-center text-secondary-foreground",
          className,
        )}
      >
        <SiteImage
          src="/brand/logo.webp"
          alt=""
          width={72}
          height={72}
          className="h-16 w-16 object-contain"
        />
        <p className="font-heading text-lg font-semibold">Foto em breve</p>
      </div>
    );
  }

  return (
    <SiteImage
      src={photo.src}
      alt={photo.alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover object-[center_32%]", className)}
    />
  );
}
