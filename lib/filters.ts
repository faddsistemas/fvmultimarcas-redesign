import type { Vehicle } from "@/lib/vehicles";

export const SORTS = [
  { value: "destaque", label: "Ordem da loja" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "ano-desc", label: "Mais novo" },
  { value: "km-asc", label: "Menor quilometragem" },
] as const;

export type SortKey = (typeof SORTS)[number]["value"];

export type Filters = {
  q: string;
  marca: string[];
  tipo: string[];
  combustivel: string[];
  cambio: string[];
  cor: string[];
  anoMin: string;
  anoMax: string;
  precoMin: string;
  precoMax: string;
  kmMin: string;
  kmMax: string;
  ordem: SortKey;
};

export function emptyFilters(): Filters {
  return {
    q: "",
    marca: [],
    tipo: [],
    combustivel: [],
    cambio: [],
    cor: [],
    anoMin: "",
    anoMax: "",
    precoMin: "",
    precoMax: "",
    kmMin: "",
    kmMax: "",
    ordem: "destaque",
  };
}

const SORT_VALUES = new Set<string>(SORTS.map((sort) => sort.value));

export function isSortKey(value: string): value is SortKey {
  return SORT_VALUES.has(value);
}

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function haystack(vehicle: Vehicle) {
  const parts = [
    vehicle.brand,
    vehicle.model,
    vehicle.title,
    vehicle.version ?? "",
    vehicle.fuel,
    vehicle.color ?? "",
    vehicle.category === "moto" ? "moto motocicleta" : "carro",
    String(vehicle.year),
  ].join(" ");
  const folded = fold(parts);
  return `${folded} ${folded.replace(/\s+/g, "")}`;
}

export function sortVehicles(list: Vehicle[], ordem: SortKey) {
  const copy = [...list];
  switch (ordem) {
    case "destaque":
      return copy;
    case "preco-asc":
      return copy.sort(
        (a, b) => a.price - b.price || a.title.localeCompare(b.title, "pt-BR"),
      );
    case "preco-desc":
      return copy.sort(
        (a, b) => b.price - a.price || a.title.localeCompare(b.title, "pt-BR"),
      );
    case "ano-desc":
      return copy.sort((a, b) => b.year - a.year || a.km - b.km);
    case "km-asc":
      return copy.sort((a, b) => a.km - b.km || b.year - a.year);
    default: {
      const exhaustive: never = ordem;
      return exhaustive;
    }
  }
}

export function filterVehicles(list: Vehicle[], filters: Filters) {
  const query = fold(filters.q);
  const queryCompact = query.replace(/\s+/g, "");
  const anoMin = parseNumber(filters.anoMin);
  const anoMax = parseNumber(filters.anoMax);
  const precoMin = parseNumber(filters.precoMin);
  const precoMax = parseNumber(filters.precoMax);
  const kmMin = parseNumber(filters.kmMin);
  const kmMax = parseNumber(filters.kmMax);

  const matched = list.filter((vehicle) => {
    if (query) {
      const text = haystack(vehicle);
      if (!text.includes(query) && !(queryCompact && text.includes(queryCompact))) {
        return false;
      }
    }
    if (filters.marca.length > 0 && !filters.marca.includes(vehicle.brand)) return false;
    if (filters.tipo.length > 0 && !filters.tipo.includes(vehicle.category)) return false;
    if (filters.combustivel.length > 0 && !filters.combustivel.includes(vehicle.fuel)) {
      return false;
    }
    if (filters.cambio.length > 0) {
      const key = vehicle.transmission ?? "nao-informado";
      if (!filters.cambio.includes(key)) return false;
    }
    if (filters.cor.length > 0) {
      const key = vehicle.color ?? "Não informada";
      if (!filters.cor.includes(key)) return false;
    }
    if (anoMin !== null && vehicle.year < anoMin) return false;
    if (anoMax !== null && vehicle.year > anoMax) return false;
    if (precoMin !== null && vehicle.price < precoMin) return false;
    if (precoMax !== null && vehicle.price > precoMax) return false;
    if (kmMin !== null && vehicle.km < kmMin) return false;
    if (kmMax !== null && vehicle.km > kmMax) return false;
    return true;
  });

  return sortVehicles(matched, filters.ordem);
}

function listParam(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function filtersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search);
  const filters = emptyFilters();
  filters.q = params.get("q") ?? "";
  filters.marca = listParam(params.get("marca"));
  filters.tipo = listParam(params.get("tipo"));
  filters.combustivel = listParam(params.get("combustivel"));
  filters.cambio = listParam(params.get("cambio"));
  filters.cor = listParam(params.get("cor"));
  filters.anoMin = params.get("anoMin") ?? "";
  filters.anoMax = params.get("anoMax") ?? "";
  filters.precoMin = params.get("precoMin") ?? "";
  filters.precoMax = params.get("precoMax") ?? "";
  filters.kmMin = params.get("kmMin") ?? "";
  filters.kmMax = params.get("kmMax") ?? "";
  const ordem = params.get("ordem") ?? "";
  if (isSortKey(ordem)) filters.ordem = ordem;
  return filters;
}

export function filtersToSearch(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.marca.length > 0) params.set("marca", filters.marca.join(","));
  if (filters.tipo.length > 0) params.set("tipo", filters.tipo.join(","));
  if (filters.combustivel.length > 0) {
    params.set("combustivel", filters.combustivel.join(","));
  }
  if (filters.cambio.length > 0) params.set("cambio", filters.cambio.join(","));
  if (filters.cor.length > 0) params.set("cor", filters.cor.join(","));
  if (filters.anoMin.trim()) params.set("anoMin", filters.anoMin.trim());
  if (filters.anoMax.trim()) params.set("anoMax", filters.anoMax.trim());
  if (filters.precoMin.trim()) params.set("precoMin", filters.precoMin.trim());
  if (filters.precoMax.trim()) params.set("precoMax", filters.precoMax.trim());
  if (filters.kmMin.trim()) params.set("kmMin", filters.kmMin.trim());
  if (filters.kmMax.trim()) params.set("kmMax", filters.kmMax.trim());
  if (filters.ordem !== "destaque") params.set("ordem", filters.ordem);
  return params.toString();
}

export type FilterChip = {
  id: string;
  label: string;
  clear: (filters: Filters) => Filters;
};

export function activeChips(filters: Filters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (filters.q.trim()) {
    chips.push({
      id: "q",
      label: `Busca: ${filters.q.trim()}`,
      clear: (current) => ({ ...current, q: "" }),
    });
  }
  for (const marca of filters.marca) {
    chips.push({
      id: `marca-${marca}`,
      label: `Marca: ${marca}`,
      clear: (current) => ({
        ...current,
        marca: current.marca.filter((item) => item !== marca),
      }),
    });
  }
  for (const tipo of filters.tipo) {
    chips.push({
      id: `tipo-${tipo}`,
      label: tipo === "moto" ? "Tipo: moto" : "Tipo: carro",
      clear: (current) => ({
        ...current,
        tipo: current.tipo.filter((item) => item !== tipo),
      }),
    });
  }
  for (const fuel of filters.combustivel) {
    chips.push({
      id: `fuel-${fuel}`,
      label: `Combustível: ${fuel}`,
      clear: (current) => ({
        ...current,
        combustivel: current.combustivel.filter((item) => item !== fuel),
      }),
    });
  }
  const cambioLabels: Record<string, string> = {
    manual: "Câmbio: manual",
    automatico: "Câmbio: automático",
    "nao-informado": "Câmbio: não informado",
  };
  for (const cambio of filters.cambio) {
    chips.push({
      id: `cambio-${cambio}`,
      label: cambioLabels[cambio] ?? `Câmbio: ${cambio}`,
      clear: (current) => ({
        ...current,
        cambio: current.cambio.filter((item) => item !== cambio),
      }),
    });
  }
  for (const cor of filters.cor) {
    chips.push({
      id: `cor-${cor}`,
      label: `Cor: ${cor}`,
      clear: (current) => ({
        ...current,
        cor: current.cor.filter((item) => item !== cor),
      }),
    });
  }
  const ranges: Array<[string, keyof Filters, string]> = [
    ["anoMin", "anoMin", "Ano mín."],
    ["anoMax", "anoMax", "Ano máx."],
    ["precoMin", "precoMin", "Preço mín."],
    ["precoMax", "precoMax", "Preço máx."],
    ["kmMin", "kmMin", "Km mín."],
    ["kmMax", "kmMax", "Km máx."],
  ];
  for (const [id, key, label] of ranges) {
    const value = filters[key];
    if (typeof value === "string" && value.trim()) {
      chips.push({
        id,
        label: `${label}: ${value.trim()}`,
        clear: (current) => ({ ...current, [key]: "" }),
      });
    }
  }
  if (filters.ordem !== "destaque") {
    const sort = SORTS.find((item) => item.value === filters.ordem);
    chips.push({
      id: "ordem",
      label: sort ? `Ordem: ${sort.label}` : "Ordem",
      clear: (current) => ({ ...current, ordem: "destaque" }),
    });
  }
  return chips;
}
