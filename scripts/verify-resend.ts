/**
 * Verify Resend configuration and optionally send test emails.
 *
 * Usage:
 *   npx tsx scripts/verify-resend.ts
 *   npx tsx scripts/verify-resend.ts --send
 *   npx tsx scripts/verify-resend.ts --setup-alert --cron
 *   npx tsx scripts/verify-resend.ts --all
 */
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

async function loadDeps() {
  const { readCronSecret } = await import("../src/lib/cron-auth");
  const { prisma } = await import("../src/lib/db");
  const { emailProviderConfigured, sendEmail } = await import("../src/lib/notifications");
  const { runSearchAlertDigests } = await import("../src/lib/search-alert-digest");
  const { runSponsorRenewalReminders } = await import("../src/lib/sponsor-renewal-reminders");
  return {
    readCronSecret,
    prisma,
    emailProviderConfigured,
    sendEmail,
    runSearchAlertDigests,
    runSponsorRenewalReminders,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes("--all");
  const deps = await loadDeps();
  const { readCronSecret, prisma, emailProviderConfigured, sendEmail, runSearchAlertDigests, runSponsorRenewalReminders } =
    deps;

  console.log("=== Resend configuration ===");
  console.log("emailProviderConfigured:", emailProviderConfigured());
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM?.trim() ?? "(not set)");
  console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY?.trim() ? "(set)" : "(not set)");
  console.log("CRON_SECRET:", readCronSecret() ? "(set locally)" : "(not set locally — OK on Vercel)");

  const activeAlerts = await prisma.searchAlert.count({ where: { active: true } });
  const alerts = await prisma.searchAlert.findMany({ where: { active: true }, take: 5 });
  const alertUsers =
    alerts.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: alerts.map((a) => a.userId) } },
          select: { id: true, email: true },
        })
      : [];
  const emailByUserId = new Map(alertUsers.map((u) => [u.id, u.email]));

  console.log("\n=== Search alerts ===");
  console.log("Active alerts:", activeAlerts);
  for (const a of alerts) {
    console.log(
      `  - ${a.name} (${a.frequency}) → ${emailByUserId.get(a.userId) ?? "no email"} lastSent=${a.lastSentAt?.toISOString() ?? "never"}`,
    );
  }

  if (args.includes("--setup-alert") || runAll) {
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
      select: { id: true, email: true },
    });
    if (!admin?.email) throw new Error("Admin user with email not found");
    const existing = await prisma.searchAlert.findFirst({
      where: { userId: admin.id, active: true, name: "Resend verify test" },
    });
    if (existing) {
      await prisma.searchAlert.update({ where: { id: existing.id }, data: { lastSentAt: null } });
      console.log(`\nReset test alert for ${admin.email}`);
    } else {
      await prisma.searchAlert.create({
        data: {
          userId: admin.id,
          name: "Resend verify test",
          listingType: "rent",
          filters: "{}",
          frequency: "daily",
          active: true,
        },
      });
      console.log(`\nCreated test alert for ${admin.email}`);
    }
  }

  if (!emailProviderConfigured()) {
    if (args.includes("--send") || args.includes("--cron") || runAll) {
      console.error("\nResend not configured locally — add RESEND_API_KEY to .env.local");
      process.exit(1);
    }
    return;
  }

  if (args.includes("--send") || runAll) {
    const to = process.env.ADMIN_EMAIL?.trim() ?? "admin@condominium.in.th";
    console.log(`\n=== Test email → ${to} ===`);
    const test = await sendEmail(
      to,
      "[Condominium.in.th] Resend delivery test",
      "If you received this, Resend is delivering email correctly.\n\n— verify-resend.ts",
    );
    console.log(test);
    if (!test.delivered) process.exit(1);
  }

  if (args.includes("--cron") || runAll) {
    console.log("\n=== Search alert digest (weekly backup) ===");
    console.log(await runSearchAlertDigests());

    console.log("\n=== Sponsor renewal reminders ===");
    console.log(await runSponsorRenewalReminders());
  }

  console.log("\nDone. Check inbox + https://resend.com/emails");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    try {
      const { prisma } = await import("../src/lib/db");
      await prisma.$disconnect();
    } catch {
      /* ignore */
    }
  });
