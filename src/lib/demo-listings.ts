import { prisma } from "@/lib/db";
import type { Property } from "@/types/property";

const DEFAULT_HIDE_THRESHOLD = 3;

export interface DemoListingStatus {
  showDemos: boolean;
  publishedUserCount: number;
  threshold: number;
  forceShow: boolean;
  forceHide: boolean;
}

function readConfig() {
  const forceShow = process.env.SHOW_DEMO_LISTINGS === "true";
  const forceHide = process.env.SHOW_DEMO_LISTINGS === "false";
  const parsed = parseInt(process.env.DEMO_HIDE_THRESHOLD ?? "", 10);
  const threshold = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_HIDE_THRESHOLD;
  return { forceShow, forceHide, threshold };
}

export async function countPublishedUserListings(): Promise<number> {
  return prisma.userProperty.count({ where: { status: "published" } });
}

/** Demo seed listings show until enough real published inventory exists. */
export async function shouldShowDemoListings(publishedUserCount?: number): Promise<boolean> {
  const { forceShow, forceHide, threshold } = readConfig();
  if (forceShow) return true;
  if (forceHide) return false;

  const count = publishedUserCount ?? (await countPublishedUserListings());
  return count < threshold;
}

export async function getDemoListingStatus(): Promise<DemoListingStatus> {
  const { forceShow, forceHide, threshold } = readConfig();
  const publishedUserCount = await countPublishedUserListings();
  const showDemos = forceShow || (!forceHide && publishedUserCount < threshold);
  return { showDemos, publishedUserCount, threshold, forceShow, forceHide };
}

export function filterVisibleDemoListings(
  demos: Property[],
  showDemos: boolean,
): Property[] {
  return showDemos ? demos : [];
}
