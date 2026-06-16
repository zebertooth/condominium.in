import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/seo";

export interface NewsletterArticleNotifyResult {
  sent: number;
  skipped: number;
  errors: string[];
}

interface ArticleForNewsletter {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
}

function articleCopy(article: ArticleForNewsletter, locale: Locale): { title: string; excerpt: string } {
  if (locale !== "th" && article.titleEn.trim()) {
    return {
      title: article.titleEn,
      excerpt: article.excerptEn.trim() || article.excerpt,
    };
  }
  return { title: article.title, excerpt: article.excerpt };
}

function buildNewsletterEmail(
  article: ArticleForNewsletter,
  locale: Locale,
): { subject: string; text: string } {
  const { title, excerpt } = articleCopy(article, locale);
  const url = `${siteConfig.url}/blog/${article.slug}`;

  if (locale === "en") {
    return {
      subject: `[${siteConfig.name}] New article: ${title}`,
      text: [
        "Hello,",
        "",
        `We published a new article on ${siteConfig.name}:`,
        "",
        title,
        excerpt,
        "",
        `Read more: ${url}`,
        "",
        `Browse all articles: ${siteConfig.url}/blog`,
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
    };
  }

  return {
    subject: `[${siteConfig.name}] บทความใหม่: ${title}`,
    text: [
      "สวัสดีครับ/ค่ะ",
      "",
      `มีบทความใหม่บน ${siteConfig.name}:`,
      "",
      title,
      excerpt,
      "",
      `อ่านต่อ: ${url}`,
      "",
      `ดูบทความทั้งหมด: ${siteConfig.url}/blog`,
      "",
      `— ${siteConfig.name}`,
    ].join("\n"),
  };
}

/** Email active newsletter subscribers when an article is first published. */
export async function notifyNewsletterSubscribersForArticle(
  article: ArticleForNewsletter,
): Promise<NewsletterArticleNotifyResult> {
  const result: NewsletterArticleNotifyResult = { sent: 0, skipped: 0, errors: [] };

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    select: { email: true, locale: true },
  });

  if (subscribers.length === 0) {
    return result;
  }

  for (const sub of subscribers) {
    const locale = (sub.locale || "th") as Locale;
    const { subject, text } = buildNewsletterEmail(article, locale);
    const emailResult = await sendEmail(sub.email, subject, text);

    if (emailResult.delivered) {
      result.sent++;
    } else {
      result.skipped++;
      result.errors.push(`${sub.email}: ${emailResult.error ?? "failed"}`);
    }
  }

  return result;
}

export async function countActiveNewsletterSubscribers(): Promise<number> {
  return prisma.newsletterSubscriber.count({ where: { active: true } });
}
