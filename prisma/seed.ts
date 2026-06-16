import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import pg from "pg";
import {
  DEFAULT_BLOG_POSTS,
  DEFAULT_TEAM_AGENTS,
  PILOT_PROJECT_REVIEW,
  SECOND_PROJECT_REVIEW,
  SUKHUMVIT_AREA_ROUNDUP,
  ART4D_ARTICLES,
} from "../src/lib/default-content";
import { normalizeDatabaseUrl } from "../src/lib/database-url";
import type { BlogPost } from "../src/types/property";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString: normalizeDatabaseUrl(connectionString) });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function blogPostData(post: BlogPost, projectId?: string) {
  return {
    slug: post.slug,
    title: post.title,
    titleEn: post.titleEn ?? "",
    excerpt: post.excerpt,
    excerptEn: post.excerptEn ?? "",
    content: post.content,
    contentEn: post.contentEn ?? "",
    category: post.category,
    categoryEn: post.categoryEn ?? "",
    imageUrl: post.imageUrl ?? "",
    publishedAt: new Date(post.publishedAt),
    readTime: post.readTime,
    seoTitle: post.seoTitle,
    seoTitleEn: post.seoTitleEn ?? "",
    seoDescription: post.seoDescription,
    seoDescriptionEn: post.seoDescriptionEn ?? "",
    status: "published" as const,
    articleType: post.articleType ?? "guide",
    projectId: projectId ?? null,
    authorName: post.authorName ?? "",
    authorTitle: post.authorTitle ?? "",
    reviewNumber: post.reviewNumber ?? null,
    factsJson: post.facts ? JSON.stringify(post.facts) : "{}",
    sectionsJson: post.sections ? JSON.stringify(post.sections) : "[]",
    galleryUrls: post.galleryUrls ? JSON.stringify(post.galleryUrls) : "[]",
    videoUrl: post.videoUrl ?? "",
    relatedSlugs: post.relatedSlugs ? JSON.stringify(post.relatedSlugs) : "[]",
    sourceName: post.sourceName ?? "",
    sourceUrl: post.sourceUrl ?? "",
    sourceTitle: post.sourceTitle ?? "",
  };
}

async function seedArt4dArticles() {
  let project = await prisma.project.findUnique({ where: { slug: "dusit-central-park" } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        slug: "dusit-central-park",
        name: "Dusit Central Park",
        nameEn: "Dusit Central Park",
        developer: "Dusit Thani × Central Pattana",
        location: "Silom-Sathorn, Bangkok",
        district: "บางรัก",
        btsStation: "ศาลาแดง",
        amenities: JSON.stringify(["Roof Park", "Central Park retail", "Pool", "Fitness"]),
        totalUnits: 406,
        completionDate: new Date("2025-01-01"),
        imageUrl: ART4D_ARTICLES[0]?.imageUrl ?? "",
        description: "มิกซ์ยูส Dusit Central Park — โรงแรม ที่พักอาศัย ออฟฟิศ Central Park",
        descriptionEn: "Dusit Central Park mixed-use — hotel, residences, office, Central Park retail",
        published: true,
      },
    });
    console.log("Seeded project: Dusit Central Park");
  }

  for (const post of ART4D_ARTICLES) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    const projectId = post.projectSlug ? project.id : undefined;
    await prisma.blogArticle.create({
      data: blogPostData(post, projectId),
    });
    console.log(`Seeded art4d article: ${post.slug}`);
  }
}

async function seedPhase11Editorial() {
  let lifeProject = await prisma.project.findUnique({ where: { slug: "life-asoke-hype" } });
  if (!lifeProject) {
    lifeProject = await prisma.project.create({
      data: {
        slug: "life-asoke-hype",
        name: "Life Asoke Hype",
        nameEn: "Life Asoke Hype",
        developer: "AP (Thailand)",
        location: "อโศก กรุงเทพฯ",
        district: "วัฒนา",
        btsStation: "อโศก",
        amenities: JSON.stringify(["Infinity pool", "Co-working", "Fitness", "รปภ. 24 ชม."]),
        totalUnits: 1200,
        completionDate: new Date("2021-06-01"),
        imageUrl: SECOND_PROJECT_REVIEW.imageUrl ?? "",
        description: "คอนโด Life Asoke Hype ใกล้ BTS อโศก",
        descriptionEn: "Life Asoke Hype condo near BTS Asoke",
        published: true,
      },
    });
    console.log("Seeded project: Life Asoke Hype");
  }

  for (const post of [SECOND_PROJECT_REVIEW, SUKHUMVIT_AREA_ROUNDUP]) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    const projectId =
      post.slug === SECOND_PROJECT_REVIEW.slug ? lifeProject.id : undefined;
    await prisma.blogArticle.create({
      data: blogPostData(post, projectId),
    });
    console.log(`Seeded editorial: ${post.slug}`);
  }
}

async function seedPilotProjectAndReview() {
  let project = await prisma.project.findUnique({ where: { slug: "noble-reform" } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        slug: "noble-reform",
        name: "Noble Reform",
        nameEn: "Noble Reform",
        developer: "Noble Development",
        location: "พญาไท กรุงเทพฯ",
        district: "พญาไท",
        btsStation: "พญาไท",
        amenities: JSON.stringify(["สระว่ายน้ำ", "ฟิตเนส", "ล็obby", "รปภ. 24 ชม."]),
        totalUnits: 800,
        completionDate: new Date("2019-01-01"),
        imageUrl: PILOT_PROJECT_REVIEW.imageUrl ?? "",
        description: "คอนโด Noble Reform ใกล้ BTS พญาไท",
        descriptionEn: "Noble Reform condo near BTS Phayathai",
        published: true,
      },
    });
    console.log("Seeded project: Noble Reform");
  }

  const existingReview = await prisma.blogArticle.findUnique({
    where: { slug: PILOT_PROJECT_REVIEW.slug },
  });
  if (!existingReview) {
    await prisma.blogArticle.create({
      data: blogPostData(PILOT_PROJECT_REVIEW, project.id),
    });
    console.log(`Seeded pilot review: ${PILOT_PROJECT_REVIEW.slug}`);
  }
}

async function seedContent() {
  const agentCount = await prisma.teamAgent.count();
  if (agentCount === 0) {
    for (const agent of DEFAULT_TEAM_AGENTS) {
      await prisma.teamAgent.create({
        data: {
          name: agent.name,
          role: agent.role,
          roleEn: agent.roleEn,
          areas: JSON.stringify(agent.areas),
          languages: JSON.stringify(agent.languages),
          deals: agent.deals,
          imageUrl: agent.imageUrl,
          sortOrder: agent.sortOrder,
          published: true,
          agentCategory: "team",
        },
      });
    }
    console.log(`Seeded ${DEFAULT_TEAM_AGENTS.length} team agents`);
  }

  const blogCount = await prisma.blogArticle.count();
  if (blogCount === 0) {
    for (const post of DEFAULT_BLOG_POSTS) {
      await prisma.blogArticle.create({
        data: blogPostData(post),
      });
    }
    console.log(`Seeded ${DEFAULT_BLOG_POSTS.length} blog articles`);
  }

  await seedPilotProjectAndReview();
  await seedPhase11Editorial();
  await seedArt4dArticles();
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@condominium.in.th";
  const password = process.env.ADMIN_PASSWORD ?? "admin123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "admin", emailVerified: true },
    });
    console.log(`Admin updated: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        emailVerified: true,
        fullName: "Admin",
        passwordHash,
        role: "admin",
      },
    });
    console.log(`Admin created: ${email} / ${password}`);
  }

  await seedContent();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
