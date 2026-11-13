"use client";

const PARAM = "veiculo";

export function setVehiclePreviewParam(slug: string | null) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set(PARAM, slug);
  } else {
    url.searchParams.delete(PARAM);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", next);
}

export function readVehiclePreviewParam() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(PARAM);
}
