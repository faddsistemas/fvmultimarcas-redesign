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

function vehicleFromUrl() {
  const slug = readVehiclePreviewParam();
  if (!slug) return null;
  return getVehicle(slug) ?? null;
}

export function VehiclePreviewProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const syncFromUrl = useCallback(() => {
    setVehicle(vehicleFromUrl());
  }, []);

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
  }, [syncFromUrl]);

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
