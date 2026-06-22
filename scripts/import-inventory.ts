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
import { runStarterInventoryImport } from "../src/lib/inventory-import";
import { prisma } from "../src/lib/db";

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

  const result = await runStarterInventoryImport({
    force,
    sponsor,
    listingsOnly,
    projectsOnly,
  });

  console.log(`Published: ${result.publishedBefore} → ${result.publishedAfter}`);

  if (result.skipped.projects) console.log(`Skipped projects: ${result.skipped.projects}`);
  if (result.skipped.listings) console.log(`Skipped listings: ${result.skipped.listings}`);

  if (result.projects) {
    console.log(`Projects: imported ${result.projects.imported}, errors ${result.projects.errors.length}`);
    for (const err of result.projects.errors) {
      console.warn(`  row ${err.row}: ${err.message}`);
    }
  }

  if (result.listings) {
    console.log(`Listings: imported ${result.listings.imported}, errors ${result.listings.errors.length}`);
    for (const err of result.listings.errors) {
      console.warn(`  row ${err.row}: ${err.message}`);
    }
  }

  if (result.sponsored > 0) {
    console.log(`Sponsored ${result.sponsored} newest published listing(s) for 30 days`);
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
