import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import pg from "pg";
import { DEFAULT_BLOG_POSTS, DEFAULT_TEAM_AGENTS } from "../src/lib/default-content";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
        },
      });
    }
    console.log(`Seeded ${DEFAULT_TEAM_AGENTS.length} team agents`);
  }

  const blogCount = await prisma.blogArticle.count();
  if (blogCount === 0) {
    for (const post of DEFAULT_BLOG_POSTS) {
      await prisma.blogArticle.create({
        data: {
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
          status: "published",
        },
      });
    }
    console.log(`Seeded ${DEFAULT_BLOG_POSTS.length} blog articles`);
  }
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
