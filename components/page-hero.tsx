import type { ReactNode } from "react";

import { cn } from "cn";

export function PageHero({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <header
      className={cn(
        "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </header>
  );
}
