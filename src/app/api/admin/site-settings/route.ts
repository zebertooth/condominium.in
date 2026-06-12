import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { parseRequestJson } from "@/lib/request";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { z } from "zod";

const adSlotsSchema = z.object({
  homeLeaderboard: z.string(),
  homeMid: z.string(),
  listingTop: z.string(),
  listingInfeed: z.string(),
  propertyTop: z.string(),
  propertySidebar: z.string(),
  blogTop: z.string(),
  blogInarticle: z.string(),
  footer: z.string(),
});

const siteSettingsSchema = z.object({
  homeTitle: z.string().min(5, "Title too short"),
  homeDescription: z.string().min(20, "Description too short"),
  homeTitleEn: z.string().min(5, "English title too short"),
  homeDescriptionEn: z.string().min(20, "English description too short"),
  keywords: z.string(),
  titleSuffix: z.string().min(1, "Title suffix required"),
  adSlots: adSlotsSchema,
});

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getSiteSettings();
    return NextResponse.json({
      ...settings,
      keywords: settings.keywords.join(", "),
    });
  } catch (error) {
    return adminRouteError(error, "โหลดการตั้งค่า SEO ไม่สำเร็จ");
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await parseRequestJson(request);
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const settings = await updateSiteSettings(parsed.data);
    return NextResponse.json({
      message: "บันทึกการตั้งค่า SEO และ AdSense แล้ว",
      settings: {
        ...settings,
        keywords: settings.keywords.join(", "),
      },
    });
  } catch (error) {
    return adminRouteError(error, "บันทึกการตั้งค่า SEO ไม่สำเร็จ");
  }
}
