"use client";

import { useEffect } from "react";
import type { ListingPoster } from "@/types/property";

interface OwnerContactCardProps {
  poster: ListingPoster;
  propertySlug: string;
  propertyTitle: string;
  labels: {
    heading: string;
    phone: string;
    email: string;
    noContact: string;
  };
}

async function logMatching(
  eventType: "owner_contact_view" | "owner_phone_click" | "owner_email_click",
  data: Record<string, string | undefined>,
) {
  await fetch("/api/analytics/matching", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, ...data }),
  });
}

export function OwnerContactCard({ poster, propertySlug, propertyTitle, labels }: OwnerContactCardProps) {
  useEffect(() => {
    void logMatching("owner_contact_view", {
      propertySlug,
      propertyTitle,
      ownerUserId: poster.userId,
      posterRole: poster.role,
    });
  }, [poster.userId, poster.role, propertySlug, propertyTitle]);

  const hasPhone = Boolean(poster.phone);
  const hasEmail = Boolean(poster.email);

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
      <h3 className="font-semibold text-teal-900">{labels.heading}</h3>
      <p className="mt-1 text-lg font-medium text-slate-900">{poster.fullName}</p>

      <div className="mt-4 space-y-2 text-sm">
        {hasPhone && (
          <a
            href={`tel:${poster.phone}`}
            onClick={() =>
              void logMatching("owner_phone_click", {
                propertySlug,
                propertyTitle,
                ownerUserId: poster.userId,
                posterRole: poster.role,
              })
            }
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-teal-800 shadow-sm hover:bg-teal-100"
          >
            📞 {labels.phone}: {poster.phone}
          </a>
        )}
        {hasEmail && (
          <a
            href={`mailto:${poster.email}?subject=${encodeURIComponent(`สนใจ ${propertyTitle}`)}`}
            onClick={() =>
              void logMatching("owner_email_click", {
                propertySlug,
                propertyTitle,
                ownerUserId: poster.userId,
                posterRole: poster.role,
              })
            }
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-teal-800 shadow-sm hover:bg-teal-100"
          >
            ✉️ {labels.email}: {poster.email}
          </a>
        )}
        {!hasPhone && !hasEmail && (
          <p className="text-slate-600">{labels.noContact}</p>
        )}
      </div>
    </div>
  );
}
