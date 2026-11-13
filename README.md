# FV Multimarcas — proposta de site

Site estático da revenda FV Multimarcas (Nova Serrana–MG), feito em Next.js para publicar no GitHub Pages.

Endereço previsto: https://tiiandradee2.github.io/fvmultimarcas-redesign/

## Como rodar

```bash
npm install
npm run dev
```

O `basePath` só entra no build quando `NEXT_PUBLIC_BASE_PATH` está definido. No computador, sem essa variável, o site abre na raiz.

Build igual ao das páginas do GitHub:

```bash
NEXT_PUBLIC_BASE_PATH=/fvmultimarcas-redesign \
NEXT_PUBLIC_SITE_URL=https://tiiandradee2.github.io/fvmultimarcas-redesign \
npm run build
```

A pasta `out/` é o site estático.

## Estoque

Os 10 veículos, preços, anos, quilometragens, cores, combustíveis e fotos vieram dos anúncios publicados em fvmultimarcas.com.br em 13 de novembro de 2026. Câmbio e lista de equipamentos não estavam nesses anúncios e aparecem como não informados. A simulação de parcela usa taxa de exemplo e não é oferta.
