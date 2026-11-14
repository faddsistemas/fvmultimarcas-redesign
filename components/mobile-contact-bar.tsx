import { MessageCircleIcon, PhoneIcon } from "lucide-react";

import { dealer, telHref, whatsappHref } from "@/lib/site";

export function MobileContactBar() {
  const whatsapp = whatsappHref(
    "Olá, FV Multimarcas! Vim pelo site e quero falar com a loja.",
  );

  return (
    <nav
      aria-label="Contato rápido"
      data-testid="mobile-contact-bar"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-primary px-3 text-sm font-semibold text-primary-foreground"
      >
        <MessageCircleIcon aria-hidden="true" />
        WhatsApp
      </a>
      <a
        href={telHref(dealer.whatsappE164)}
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-secondary px-3 text-sm font-semibold text-secondary-foreground"
      >
        <PhoneIcon aria-hidden="true" />
        Ligar
      </a>
    </nav>
  );
}
