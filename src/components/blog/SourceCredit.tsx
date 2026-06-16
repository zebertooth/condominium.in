import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { BlogPost } from "@/types/property";

interface SourceCreditProps {
  post: BlogPost;
  locale: Locale;
}

export function SourceCredit({ post, locale }: SourceCreditProps) {
  if (!post.sourceUrl?.trim()) return null;

  const sourceName = post.sourceName?.trim() || "art4d";
  const sourceTitle = post.sourceTitle?.trim();
  const nonTh = locale !== "th";

  return (
    <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">{t("blogSourceCreditHeading", locale)}</p>
      <p className="mt-2 leading-relaxed">
        {nonTh
          ? "This article summarizes content originally published by "
          : "บทความนี้สรุปและแนะนำจากบทความต้นฉบับของ "}
        <Link
          href="https://art4d.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-teal-700 hover:underline"
        >
          {sourceName}
        </Link>
        {nonTh
          ? " — Thailand's architecture and design magazine. Condominium.in.th is featured on art4d as a property search partner."
          : " นิตยสารสถาปัตยกรรมและการออกแบบ — Condominium.in.th เป็นพาร์ทเนอร์ค้นหาอสังหาริมทรัพย์บน art4d"}
      </p>
      {sourceTitle && (
        <p className="mt-3">
          {nonTh ? "Read the full story: " : "อ่านฉบับเต็ม: "}
          <Link
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-700 hover:underline"
          >
            {sourceTitle}
          </Link>
        </p>
      )}
      {!sourceTitle && (
        <p className="mt-3">
          <Link
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-700 hover:underline"
          >
            {nonTh ? "View original article on art4d →" : "ดูบทความต้นฉบับบน art4d →"}
          </Link>
        </p>
      )}
      <p className="mt-3 text-xs text-slate-500">{t("blogSourceCreditRights", locale)}</p>
    </aside>
  );
}
