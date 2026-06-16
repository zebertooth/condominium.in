import { prisma } from "@/lib/db";
import { sendSponsorPaymentConfirmedEmail } from "@/lib/payment-notifications";
import { clearSponsorReminderFields } from "@/lib/sponsor-renewal-reminders";
import {
  isSponsorSubscriptionPackageId,
  parseSponsorPackageId,
} from "@/lib/sponsor-subscription";

export interface ActivateSubscriptionResult {
  subscriptionId: string;
  packageId: string;
  sponsorPropertyId?: string;
  emailSent: boolean;
}

/** Mark subscription confirmed and apply sponsor boost (if applicable). */
export async function activateConfirmedSubscription(
  subscriptionId: string,
): Promise<ActivateSubscriptionResult> {
  const subscription = await prisma.userSubscription.update({
    where: { id: subscriptionId },
    data: {
      paymentStatus: "confirmed",
      status: "active",
    },
    include: {
      user: { select: { email: true, fullName: true } },
    },
  });

  let sponsorPropertyId: string | undefined;
  let emailSent = false;

  if (isSponsorSubscriptionPackageId(subscription.packageId)) {
    const parsed = parseSponsorPackageId(subscription.packageId);
    if (parsed) {
      sponsorPropertyId = parsed.propertyId;
      const property = await prisma.userProperty.update({
        where: { id: parsed.propertyId },
        data: {
          isSponsored: true,
          sponsoredUntil: subscription.expiresAt,
          ...clearSponsorReminderFields(),
        },
      });

      const email = subscription.user.email?.trim();
      if (email) {
        try {
          await sendSponsorPaymentConfirmedEmail({
            email,
            ownerName: subscription.user.fullName || "เจ้าของประกาศ",
            title: property.title,
            slug: property.slug,
            amountBaht: subscription.pricePaid,
            sponsoredUntil: subscription.expiresAt,
            durationDays: parsed.tier?.durationDays,
          });
          emailSent = true;
        } catch (err) {
          console.error("[payment-activation] sponsor confirm email failed", err);
        }
      }
    }
  }

  return {
    subscriptionId: subscription.id,
    packageId: subscription.packageId,
    sponsorPropertyId,
    emailSent,
  };
}
