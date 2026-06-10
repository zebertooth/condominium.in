import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { AdminPaymentTable, type PaymentView } from "@/components/admin/AdminPaymentTable";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const locale = await getLocale();
  await getAdminUser();

  const subscriptions = await prisma.userSubscription.findMany({
    where: {
      paymentMethod: "promptpay",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  const dateLoc = locale === "en" ? "en-US" : "th-TH";

  const paymentViews: PaymentView[] = subscriptions.map((s) => ({
    id: s.id,
    userName: s.user.fullName,
    userEmail: s.user.email,
    packageId: s.packageId,
    pricePaid: s.pricePaid,
    paymentStatus: s.paymentStatus,
    paymentMethod: s.paymentMethod,
    transactionRef: s.transactionRef,
    slipUrl: s.slipUrl,
    status: s.status,
    createdAt: s.createdAt.toLocaleDateString(dateLoc, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminPaymentsTitle", locale)}</h1>
      <p className="mt-1 text-slate-600">{t("adminPaymentsDesc", locale)}</p>

      <div className="mt-8">
        <AdminPaymentTable payments={paymentViews} />
      </div>
    </div>
  );
}
