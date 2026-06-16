"use client";

import { useEffect, useState } from "react";
import { MyProperties } from "@/components/dashboard/MyProperties";
import { PackageShop } from "@/components/dashboard/PackageShop";
import {
  readSponsorPaymentSession,
  SponsorPaymentWizard,
  type SponsorPaymentSession,
} from "@/components/dashboard/SponsorPaymentWizard";
import type { Property } from "@/types/property";

interface DashboardClientAreaProps {
  properties: Property[];
  canPost: boolean;
  userRole: string;
  paidFeaturesEnabled: boolean;
  showPackageShop: boolean;
}

export function DashboardClientArea({
  properties,
  canPost,
  userRole,
  paidFeaturesEnabled,
  showPackageShop,
}: DashboardClientAreaProps) {
  const [wizard, setWizard] = useState<{
    propertyId: string;
    propertyTitle: string;
    initialSession?: SponsorPaymentSession | null;
  } | null>(null);

  function openWizard(propertyId: string, propertyTitle: string) {
    setWizard({ propertyId, propertyTitle, initialSession: null });
  }

  function resumeWizard(session: SponsorPaymentSession) {
    setWizard({
      propertyId: session.propertyId,
      propertyTitle: session.propertyTitle,
      initialSession: session,
    });
  }

  useEffect(() => {
    const session = readSponsorPaymentSession();
    if (!session || session.status === "confirmed" || session.step < 2) return;
    const property = properties.find((p) => p.id === session.propertyId);
    if (property) {
      setWizard({
        propertyId: session.propertyId,
        propertyTitle: session.propertyTitle,
        initialSession: session,
      });
    }
  }, [properties]);

  return (
    <>
      <MyProperties
        properties={properties}
        canPost={canPost}
        userRole={userRole}
        paidFeaturesEnabled={paidFeaturesEnabled}
        onSponsorClick={(property) => openWizard(property.id, property.title)}
      />
      {showPackageShop && (
        <PackageShop onResumePayment={resumeWizard} />
      )}
      {wizard && (
        <SponsorPaymentWizard
          propertyId={wizard.propertyId}
          propertyTitle={wizard.propertyTitle}
          initialSession={wizard.initialSession}
          onClose={() => setWizard(null)}
        />
      )}
    </>
  );
}
