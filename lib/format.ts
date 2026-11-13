const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatKm(value: number) {
  return `${numberFormatter.format(value)} km`;
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function categoryLabel(category: "carro" | "moto") {
  switch (category) {
    case "carro":
      return "Carro";
    case "moto":
      return "Moto";
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
}
