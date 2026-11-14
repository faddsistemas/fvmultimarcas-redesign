"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon, MessageCircleIcon, XIcon } from "lucide-react";

import { SiteImage } from "@/components/site-image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
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
  const [solid, setSolid] = useState(path !== "/");
  const onHomeHero = path === "/";

  const whatsapp = whatsappHref(
    "Olá, FV Multimarcas! Vim pelo site e quero falar com a loja.",
  );

  useEffect(() => {
    if (!onHomeHero) {
      setSolid(true);
      return;
    }
    const onScroll = () => {
      setSolid(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHomeHero]);

  const overlay = onHomeHero && !solid;

  const onPrimary = overlay
    ? "text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "text-primary-foreground hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <header
      className={cn(
        "z-40 transition-[background-color,box-shadow,border-color] duration-[400ms] ease-out",
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0",
        overlay
          ? "border-b border-transparent bg-transparent text-white shadow-none"
          : "border-b border-border bg-background text-foreground shadow-sm",
      )}
    >
      <div
        className={cn(
          "hidden sm:block transition-colors duration-[400ms]",
          overlay ? "bg-black/25 text-white backdrop-blur-sm" : "bg-primary text-primary-foreground",
        )}
      >
        <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between gap-4 px-4 text-sm">
          <p>{dealer.addressLine}</p>
          <p>
            <a
              className={cn("rounded-sm underline-offset-4 hover:underline link-animated", onPrimary)}
              href={`tel:+${dealer.whatsappE164}`}
            >
              {dealer.whatsappDisplay}
            </a>
            <span aria-hidden="true"> · </span>
            <a
              className={cn("rounded-sm underline-offset-4 hover:underline link-animated", onPrimary)}
              href={`tel:+${dealer.phoneE164}`}
            >
              {dealer.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
      <div className={cn("transition-colors duration-[400ms]", overlay ? "bg-transparent" : "")}>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="flex shrink-0 items-center rounded-lg">
            <SiteImage
              src="/brand/logo.webp"
              alt="FV Multimarcas"
              width={64}
              height={64}
              priority
              className={cn(
                "h-12 w-12 object-contain transition-[filter] duration-200",
                overlay && "brightness-0 invert",
              )}
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
                    "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    overlay
                      ? active
                        ? "text-white"
                        : "text-white/90 hover:bg-white/10"
                      : active
                        ? "text-primary"
                        : "text-foreground hover:bg-muted",
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
              className={cn(
                "transition-colors duration-200",
                overlay &&
                  "border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25",
              )}
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
                  className={cn(
                    "size-11 md:hidden",
                    overlay && "border-white/40 bg-black/20 text-white hover:bg-white/10",
                  )}
                  aria-label="Abrir menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-full max-w-md border-border bg-background text-foreground shadow-2xl duration-400 data-[side=left]:w-[min(100%,24rem)] sm:max-w-md"
            >
              <SheetHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                <SheetTitle className="font-heading text-xl">Menu</SheetTitle>
                <SheetClose
                  render={
                    <Button variant="ghost" size="icon" className="size-11 rounded-full">
                      <XIcon className="size-5" />
                      <span className="sr-only">Fechar</span>
                    </Button>
                  }
                />
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-2 py-2">
                {nav.map((item) => {
                  const active = isActive(item.href, path);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-xl px-4 text-base font-medium transition-colors duration-200",
                        active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted",
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