"use client";

import { XIcon } from "lucide-react";

import { VehiclePreviewBody } from "@/components/vehicle-preview-body";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
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
          className="relative m-0 h-[100dvh] max-h-[100dvh] w-full max-w-none rounded-none border-0 [--drawer-content-max-height:100dvh] [--drawer-content-height:100dvh] [--drawer-inset:0px]"
          aria-describedby="vehicle-preview-desc-mobile"
        >
          <DrawerClose
            render={
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Fechar"
                className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-30 size-11 min-h-11 min-w-11 border border-border bg-background/95 text-foreground shadow-md hover:bg-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            }
          >
            <XIcon className="size-5" aria-hidden />
          </DrawerClose>
          <div
            data-testid="vehicle-preview-mobile-shell"
            className="flex h-full max-h-[100dvh] w-full max-w-full min-w-0 flex-col overflow-hidden px-3 pt-[max(3.25rem,env(safe-area-inset-top)+2.75rem)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          >
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
