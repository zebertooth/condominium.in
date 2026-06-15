/**
 * Import starter inventory CSVs into Neon (projects first, then listings).
 *
 * Usage:
 *   npm run db:import-inventory
 *   npm run db:import-inventory -- --sponsor=3
 *   npm run db:import-inventory -- --listings-only
 *   npm run db:import-inventory -- --projects-only
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  importListingsCsv,
  importProjectsCsv,
  resolveImportAdminUserId,
  sponsorLatestListings,
} from "../src/lib/inventory-import";
import { prisma } from "../src/lib/db";

function readCsv(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  let sponsor = 0;
  let listingsOnly = false;
  let projectsOnly = false;
  let force = false;

  for (const arg of args) {
    if (arg.startsWith("--sponsor=")) {
      sponsor = Math.max(0, parseInt(arg.split("=")[1] ?? "0", 10) || 0);
    } else if (arg === "--listings-only") {
      listingsOnly = true;
    } else if (arg === "--projects-only") {
      projectsOnly = true;
    } else if (arg === "--force") {
      force = true;
    }
  }

  return { sponsor, listingsOnly, projectsOnly, force };
}

async function main() {
  const { sponsor, listingsOnly, projectsOnly, force } = parseArgs();
  const adminUserId = await resolveImportAdminUserId();

  console.log(`Using admin user id: ${adminUserId}`);

  const [publishedCount, projectCount] = await Promise.all([
    prisma.userProperty.count({ where: { status: "published" } }),
    prisma.project.count(),
  ]);

  if (!listingsOnly && projectCount >= 5 && !force) {
    console.log(`Skipping projects — ${projectCount} already exist (use --force to import again)`);
  } else if (!listingsOnly) {
    const projectsCsv = readCsv("public/inventory/starter-projects.csv");
    const projectResult = await importProjectsCsv(projectsCsv);
    console.log(`Projects: imported ${projectResult.imported}, errors ${projectResult.errors.length}`);
    for (const err of projectResult.errors) {
      console.warn(`  row ${err.row}: ${err.message}`);
    }
  }

  if (!projectsOnly && publishedCount >= 10 && !force) {
    console.log(`Skipping listings — ${publishedCount} published already exist (use --force to import again)`);
  } else if (!projectsOnly) {
    const listingsCsv = readCsv("public/inventory/starter-listings.csv");
    const listingResult = await importListingsCsv(listingsCsv, adminUserId);
    console.log(`Listings: imported ${listingResult.imported}, errors ${listingResult.errors.length}`);
    for (const err of listingResult.errors) {
      console.warn(`  row ${err.row}: ${err.message}`);
    }
  }

  if (sponsor > 0) {
    const sponsored = await sponsorLatestListings(sponsor, 30);
    console.log(`Sponsored ${sponsored} newest published listing(s) for 30 days`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
