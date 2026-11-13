"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { VehiclePreviewModal } from "@/components/vehicle-preview-modal";
import {
  readVehiclePreviewParam,
  setVehiclePreviewParam,
} from "@/lib/vehicle-preview-url";
import { getVehicle, type Vehicle } from "@/lib/vehicles";

type VehiclePreviewContextValue = {
  openPreview: (vehicle: Vehicle) => void;
  closePreview: () => void;
  isOpen: boolean;
  vehicle: Vehicle | null;
};

const VehiclePreviewContext = createContext<VehiclePreviewContextValue | null>(
  null,
);

export function useVehiclePreview() {
  const context = useContext(VehiclePreviewContext);
  if (!context) {
    throw new Error("useVehiclePreview must be used within VehiclePreviewProvider");
  }
  return context;
}

function isVehicleDetailPath(pathname: string) {
  return /\/veiculo\/[^/]+\/?$/.test(pathname);
}

function vehicleFromUrl(pathname: string) {
  if (isVehicleDetailPath(pathname)) return null;
  const slug = readVehiclePreviewParam();
  if (!slug) return null;
  return getVehicle(slug) ?? null;
}

export function VehiclePreviewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const syncFromUrl = useCallback(() => {
    const path =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    if (isVehicleDetailPath(path)) {
      setVehicle(null);
      if (readVehiclePreviewParam()) setVehiclePreviewParam(null);
      return;
    }
    setVehicle(vehicleFromUrl(path));
  }, [pathname]);

  const openPreview = useCallback((next: Vehicle) => {
    setVehicle(next);
    setVehiclePreviewParam(next.slug);
  }, []);

  const closePreview = useCallback(() => {
    setVehicle(null);
    setVehiclePreviewParam(null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync ?veiculo= on load/back
    syncFromUrl();
    const onPopState = () => syncFromUrl();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [syncFromUrl, pathname]);

  const value = useMemo(
    () => ({
      openPreview,
      closePreview,
      isOpen: vehicle !== null,
      vehicle,
    }),
    [closePreview, openPreview, vehicle],
  );

  return (
    <VehiclePreviewContext.Provider value={value}>
      {children}
      <VehiclePreviewModal
        vehicle={vehicle}
        open={vehicle !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closePreview();
        }}
      />
    </VehiclePreviewContext.Provider>
  );
}
