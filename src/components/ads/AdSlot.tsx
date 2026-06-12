import type { ComponentProps } from "react";
import { AdPlacement } from "@/components/ads/AdPlacement";
import { getSiteSettings } from "@/lib/site-settings";
import type { AdSlotKey } from "@/lib/adsense";

type AdSlotProps = Omit<ComponentProps<typeof AdPlacement>, "slotId" | "position"> & {
  position: AdSlotKey;
};

export async function AdSlot({ position, ...props }: AdSlotProps) {
  const settings = await getSiteSettings();
  const slotId = settings.adSlots[position];
  if (!slotId) return null;
  return <AdPlacement slotId={slotId} position={position} {...props} />;
}
