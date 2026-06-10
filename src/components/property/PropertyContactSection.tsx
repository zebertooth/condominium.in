import { LeadForm } from "@/components/lead/LeadForm";
import { OwnerContactCard } from "@/components/property/OwnerContactCard";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { usesEnglishContent } from "@/lib/locale-content";
import { localizedPropertyTitle } from "@/lib/property-i18n";
import type { Property } from "@/types/property";

interface PropertyContactSectionProps {
  property: Property;
  locale: Locale;
}

export function PropertyContactSection({ property, locale }: PropertyContactSectionProps) {
  const isOwnerDirect = property.contactMode === "owner_direct" && property.poster;
  const enContent = usesEnglishContent(locale);
  const displayTitle = localizedPropertyTitle(property, locale);

  if (isOwnerDirect && property.poster) {
    return (
      <div className="mt-12 max-w-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("propertyOwnerHeading", locale)}</h2>
          <p className="mt-2 text-slate-600">{t("propertyOwnerDesc", locale)}</p>
        </div>

        <OwnerContactCard
          poster={property.poster}
          propertySlug={property.slug}
          propertyTitle={displayTitle}
          labels={{
            heading: t("ownerContactInfo", locale),
            phone: enContent ? "Phone" : "โทร",
            email: enContent ? "Email" : "อีเมล",
            noContact: enContent
              ? "Owner has not provided contact details yet."
              : "เจ้าของยังไม่ได้ระบุช่องทางติดต่อ",
          }}
        />

        <div>
          <h3 className="text-lg font-semibold text-slate-900">{t("ownerInquiry", locale)}</h3>
          <div className="mt-4">
            <LeadForm
              source="property"
              contactMode="owner_direct"
              ownerUserId={property.poster.userId}
              posterRole={property.poster.role}
              propertySlug={property.slug}
              propertyTitle={displayTitle}
              btsStation={property.btsStation}
              defaultMessage={
                enContent
                  ? `Interested in "${displayTitle}" — please contact me.`
                  : `สนใจ "${displayTitle}" ต้องการสอบถามข้อมูลเพิ่มเติม`
              }
              submitLabel={enContent ? "Send to owner" : "ส่งถึงเจ้าของ"}
              successMessage={
                enContent
                  ? "Message sent. The owner may contact you directly."
                  : "ส่งข้อความถึงเจ้าของเรียบร้อย"
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900">{t("propertyAgentHeading", locale)}</h2>
      <p className="mt-2 text-slate-600">{t("propertyAgentDesc", locale)}</p>
      <div className="mt-6">
        <LeadForm
          source="property"
          contactMode="agent_team"
          propertySlug={property.slug}
          propertyTitle={displayTitle}
          btsStation={property.btsStation}
          defaultMessage={
            enContent
              ? `Interested in "${displayTitle}" — schedule a viewing.`
              : `สนใจ "${displayTitle}" ต้องการสอบถามข้อมูลเพิ่มเติม / นัดชมทรัพย์`
          }
          submitLabel={enContent ? "Request viewing" : "ส่งคำขอนัดชม"}
        />
      </div>
    </div>
  );
}
