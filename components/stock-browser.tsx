"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  activeChips,
  emptyFilters,
  filtersFromSearch,
  filtersToSearch,
  filterVehicles,
  isSortKey,
  SORTS,
  type Filters,
} from "@/lib/filters";
import type { Vehicle } from "@/lib/vehicles";

function toggleValue(list: string[], value: string, checked: boolean) {
  if (checked) return list.includes(value) ? list : [...list, value];
  return list.filter((item) => item !== value);
}

function CheckGroup({
  legend,
  note,
  name,
  options,
  selected,
  idPrefix,
  onToggle,
}: {
  legend: string;
  note?: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  idPrefix: string;
  onToggle: (value: string, checked: boolean) => void;
}) {
  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      <FieldGroup className="gap-2">
        {options.map((option) => {
          const id = `${idPrefix}-${name}-${option.value}`;
          return (
            <Field key={option.value} orientation="horizontal">
              <Checkbox
                id={id}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => onToggle(option.value, checked)}
              />
              <FieldLabel htmlFor={id}>{option.label}</FieldLabel>
            </Field>
          );
        })}
      </FieldGroup>
    </FieldSet>
  );
}

function FilterFields({
  idPrefix,
  filters,
  brands,
  fuels,
  colors,
  onChange,
}: {
  idPrefix: string;
  filters: Filters;
  brands: string[];
  fuels: string[];
  colors: string[];
  onChange: (next: Filters) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-q`}>Palavra</FieldLabel>
        <Input
          id={`${idPrefix}-q`}
          value={filters.q}
          onChange={(event) => onChange({ ...filters, q: event.target.value })}
          placeholder="Marca, modelo ou ano"
        />
      </Field>
      <CheckGroup
        legend="Marca"
        name="marca"
        idPrefix={idPrefix}
        selected={filters.marca}
        options={brands.map((brand) => ({ value: brand, label: brand }))}
        onToggle={(value, checked) =>
          onChange({ ...filters, marca: toggleValue(filters.marca, value, checked) })
        }
      />
      <CheckGroup
        legend="Tipo"
        name="tipo"
        idPrefix={idPrefix}
        selected={filters.tipo}
        options={[
          { value: "carro", label: "Carro" },
          { value: "moto", label: "Moto" },
        ]}
        onToggle={(value, checked) =>
          onChange({ ...filters, tipo: toggleValue(filters.tipo, value, checked) })
        }
      />
      <CheckGroup
        legend="Combustível"
        name="combustivel"
        idPrefix={idPrefix}
        selected={filters.combustivel}
        options={fuels.map((fuel) => ({ value: fuel, label: fuel }))}
        onToggle={(value, checked) =>
          onChange({
            ...filters,
            combustivel: toggleValue(filters.combustivel, value, checked),
          })
        }
      />
      <CheckGroup
        legend="Câmbio"
        note="Nenhum anúncio publicado informa o câmbio. O filtro já está pronto para quando a loja preencher esse dado."
        name="cambio"
        idPrefix={idPrefix}
        selected={filters.cambio}
        options={[
          { value: "manual", label: "Manual" },
          { value: "automatico", label: "Automático" },
          { value: "nao-informado", label: "Não informado" },
        ]}
        onToggle={(value, checked) =>
          onChange({ ...filters, cambio: toggleValue(filters.cambio, value, checked) })
        }
      />
      <CheckGroup
        legend="Cor"
        name="cor"
        idPrefix={idPrefix}
        selected={filters.cor}
        options={colors.map((color) => ({ value: color, label: color }))}
        onToggle={(value, checked) =>
          onChange({ ...filters, cor: toggleValue(filters.cor, value, checked) })
        }
      />
      <FieldSet>
        <FieldLegend>Ano</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-ano-min`}>De</FieldLabel>
            <Input
              id={`${idPrefix}-ano-min`}
              inputMode="numeric"
              value={filters.anoMin}
              onChange={(event) => onChange({ ...filters, anoMin: event.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-ano-max`}>Até</FieldLabel>
            <Input
              id={`${idPrefix}-ano-max`}
              inputMode="numeric"
              value={filters.anoMax}
              onChange={(event) => onChange({ ...filters, anoMax: event.target.value })}
            />
          </Field>
        </div>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Preço (R$)</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-preco-min`}>Mínimo</FieldLabel>
            <Input
              id={`${idPrefix}-preco-min`}
              inputMode="numeric"
              value={filters.precoMin}
              onChange={(event) =>
                onChange({ ...filters, precoMin: event.target.value })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-preco-max`}>Máximo</FieldLabel>
            <Input
              id={`${idPrefix}-preco-max`}
              inputMode="numeric"
              value={filters.precoMax}
              onChange={(event) =>
                onChange({ ...filters, precoMax: event.target.value })
              }
            />
          </Field>
        </div>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Quilometragem</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-km-min`}>Mínima</FieldLabel>
            <Input
              id={`${idPrefix}-km-min`}
              inputMode="numeric"
              value={filters.kmMin}
              onChange={(event) => onChange({ ...filters, kmMin: event.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-km-max`}>Máxima</FieldLabel>
            <Input
              id={`${idPrefix}-km-max`}
              inputMode="numeric"
              value={filters.kmMax}
              onChange={(event) => onChange({ ...filters, kmMax: event.target.value })}
            />
          </Field>
        </div>
      </FieldSet>
      <Button type="button" variant="outline" onClick={() => onChange(emptyFilters())}>
        Limpar filtros
      </Button>
    </div>
  );
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("fv-filters", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("fv-filters", onStoreChange);
  };
}

function locationSearch() {
  return window.location.search;
}

function emptySearch() {
  return "";
}

function subscribeHydration() {
  return () => undefined;
}

function hydratedClient() {
  return true;
}

function hydratedServer() {
  return false;
}

export function StockBrowser({
  vehicles,
  brands,
  fuels,
  colors,
}: {
  vehicles: Vehicle[];
  brands: string[];
  fuels: string[];
  colors: string[];
}) {
  const search = useSyncExternalStore(subscribeToLocation, locationSearch, emptySearch);
  const hydrated = useSyncExternalStore(subscribeHydration, hydratedClient, hydratedServer);
  const filters = useMemo(() => filtersFromSearch(search), [search]);
  const [sheetOpen, setSheetOpen] = useState(false);

  function update(next: Filters) {
    const query = filtersToSearch(next);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("fv-filters"));
  }

  const results = useMemo(() => filterVehicles(vehicles, filters), [vehicles, filters]);
  const chips = activeChips(filters);
  const countLabel =
    results.length === 1 ? "1 veículo encontrado" : `${results.length} veículos encontrados`;

  const fields = (idPrefix: string) => (
    <FilterFields
      idPrefix={idPrefix}
      filters={filters}
      brands={brands}
      fuels={fuels}
      colors={colors}
      onChange={update}
    />
  );

  return (
    <div data-filters-ready={hydrated ? "true" : "false"} className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-4 text-lg font-semibold">Filtros</h2>
          {fields("desk")}
        </div>
      </aside>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-base font-medium" aria-live="polite">
            {countLabel}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                className="lg:hidden"
                render={<Button variant="outline" className="w-full sm:w-auto lg:hidden" />}
              >
                <SlidersHorizontalIcon data-icon="inline-start" />
                Filtros{chips.length > 0 ? ` (${chips.length})` : ""}
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full data-[side=left]:w-full sm:max-w-md"
              >
                <SheetHeader>
                  <SheetTitle>Filtros do estoque</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4">{fields("sheet")}</div>
                <SheetFooter>
                  <Button type="button" onClick={() => setSheetOpen(false)}>
                    Ver {results.length} {results.length === 1 ? "resultado" : "resultados"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Field className="min-w-52">
              <FieldLabel htmlFor="ordem">Ordenar</FieldLabel>
              <Select
                value={filters.ordem}
                onValueChange={(value) => {
                  if (!value || !isSortKey(value)) return;
                  update({ ...filters, ordem: value });
                }}
              >
                <SelectTrigger id="ordem" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SORTS.map((sort) => (
                      <SelectItem key={sort.value} value={sort.value}>
                        {sort.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
        {chips.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Filtros ativos">
            {chips.map((chip) => (
              <li key={chip.id}>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-3 text-sm text-secondary-foreground"
                  onClick={() => update(chip.clear(filters))}
                >
                  {chip.label}
                  <XIcon aria-hidden="true" />
                  <span className="sr-only">Remover filtro {chip.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {results.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Nenhum veículo com esses filtros</EmptyTitle>
              <EmptyDescription>
                Tire um filtro ou limpe a busca. O câmbio, por exemplo, não veio
                preenchido nos anúncios publicados.
              </EmptyDescription>
            </EmptyHeader>
            <Button type="button" onClick={() => update(emptyFilters())}>
              Limpar filtros
            </Button>
          </Empty>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((vehicle) => (
              <li key={vehicle.slug} className="min-w-0">
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
