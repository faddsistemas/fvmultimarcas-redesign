import Image, { type ImageProps } from "next/image";

import { publicPath } from "@/lib/site";

/**
 * next/image with `images.unoptimized` copies `src` as-is and does not apply
 * `basePath`. Prefix local paths here so GitHub Pages can load them.
 */
export function SiteImage({ src, alt, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? publicPath(src) : src;
  return <Image src={resolved} alt={alt} {...props} />;
}
