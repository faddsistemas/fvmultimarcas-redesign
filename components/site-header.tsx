"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, MessageCircleIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { dealer, nav, whatsappHref } from "@/lib/site";
import { cn } from "cn";

function normalizePath(pathname: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let path = pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

function isActive(href: string, path: string) {
  const target = href === "/" ? "/" : href.replace(/\/$/, "");
  if (target === "/") return path === "/";
  if (target === "/estoque" && path.startsWith("/veiculo")) return true;
  return path === target;
}

export function SiteHeader() {
  const pathname = usePathname();
  const path = normalizePath(pathname);
  const [open, setOpen] = useState(false);

  const whatsapp = whatsappHref(
    "Olá, FV Multimarcas! Vim pelo site e quero falar com a loja.",
  );

  const onPrimary =
    "text-primary-foreground hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <header className="sticky top-0 z-30">
      <div className="hidden bg-primary text-primary-foreground sm:block">
        <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between gap-4 px-4 text-sm">
          <p>{dealer.addressLine}</p>
          <p>
            <a className={cn("rounded-sm underline-offset-4 hover:underline", onPrimary)} href={`tel:+${dealer.whatsappE164}`}>
              {dealer.whatsappDisplay}
            </a>
            <span aria-hidden="true"> · </span>
            <a className={cn("rounded-sm underline-offset-4 hover:underline", onPrimary)} href={`tel:+${dealer.phoneE164}`}>
              {dealer.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
      <div className="border-b border-border bg-background text-foreground">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center rounded-lg">
          <SiteImage
            src="/brand/logo.webp"
            alt="FV Multimarcas"
            width={64}
            height={64}
            priority
            className="h-12 w-12 object-contain"
          />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = isActive(item.href, path);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active ? "text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden md:block">
          <Button
            render={
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircleIcon data-icon="inline-start" />
            WhatsApp
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="ml-auto md:hidden"
            render={
              <Button
                variant="outline"
                className="size-11 md:hidden"
                aria-label="Abrir menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full bg-background text-foreground data-[side=left]:w-full sm:max-w-sm"
          >
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {nav.map((item) => {
                const active = isActive(item.href, path);
                return (
<Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 text-base font-medium",
                  active ? "bg-accent text-accent-foreground" : "text-foreground",
                )}
              >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
