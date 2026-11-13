"use client";

import { VehiclePreviewBody } from "@/components/vehicle-preview-body";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";
import { vehicleName, type Vehicle } from "@/lib/vehicles";

export function VehiclePreviewModal({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!vehicle) return null;

  const title = vehicleName(vehicle);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="up">
        <DrawerContent
          className="m-0 h-[100dvh] max-h-[100dvh] w-full max-w-none rounded-none border-0 [--drawer-content-max-height:100dvh] [--drawer-content-height:100dvh] [--drawer-inset:0px]"
          aria-describedby="vehicle-preview-desc-mobile"
        >
          <div className="flex h-full max-h-[100dvh] w-full max-w-full min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto p-4 pt-6 pb-6">
            <DrawerTitle id="vehicle-preview-title" className="sr-only">
              {title}
            </DrawerTitle>
            <DrawerDescription id="vehicle-preview-desc-mobile" className="sr-only">
              Prévia do veículo {title}
            </DrawerDescription>
            <VehiclePreviewBody vehicle={vehicle} compact />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-5xl flex-col gap-4 overflow-hidden p-4 sm:max-w-5xl"
        aria-describedby="vehicle-preview-desc"
      >
        <DialogTitle id="vehicle-preview-title" className="sr-only">
          {title}
        </DialogTitle>
        <DialogDescription id="vehicle-preview-desc" className="sr-only">
          Prévia do veículo {title}
        </DialogDescription>
        <VehiclePreviewBody vehicle={vehicle} />
      </DialogContent>
    </Dialog>
  );
}
