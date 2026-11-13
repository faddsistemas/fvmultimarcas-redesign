import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">Página não encontrada</h1>
      <p className="text-base">
        Esse endereço não existe neste site. Volte ao início ou abra o estoque.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/" />}>Ir para o início</Button>
        <Button variant="outline" render={<Link href="/estoque/" />}>
          Ver estoque
        </Button>
      </div>
    </div>
  );
}
