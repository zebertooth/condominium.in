import Image from "next/image";
import Link from "next/link";
import { AgentInterestForm } from "@/components/agents/AgentInterestForm";
import { AgentReviewForm } from "@/components/agents/AgentReviewForm";
import { StarRating } from "@/components/agents/StarRating";
import {
  AGENT_CATEGORIES,
  agentCategoryLabel,
  groupByAgentCategory,
} from "@/lib/agent-application";
import { getCurrentUser } from "@/lib/auth";
import { createMetadata } from "@/lib/seo";
import { getPublishedTeamAgents } from "@/lib/team-agents";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata() {
  return createMetadata({
    title: "ทีมเอเจนต์อสังหาริมทรัพย์",
    description:
      "ทีมเอเจนต์มืออาชีพพาไปชมคอนโดและบ้านจริง ให้คำปรึกษาและดูแลจนปิดดีลในกรุงเทพฯ",
    path: "/agents",
    keywords: ["เอเจนต์อสังหา", "นัดชมคอนโด", "ตัวแทนขายคอนโด"],
  });
}

function AgentCard({
  agent,
  nonTh,
  loggedIn,
}: {
  agent: Awaited<ReturnType<typeof getPublishedTeamAgents>>[number];
  nonTh: boolean;
  loggedIn: boolean;
}) {
  const role = nonTh && agent.roleEn ? agent.roleEn : agent.role;
  const isDbAgent = !agent.id.startsWith("default-");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {agent.imageUrl ? (
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <Image src={agent.imageUrl} alt={agent.name} fill className="object-cover" sizes="64px" />
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
          {agent.name.charAt(2) || "?"}
        </div>
      )}
      <h3 className="mt-4 text-lg font-bold text-slate-900">{agent.name}</h3>
      <p className="text-sm text-teal-700">{role}</p>
      {agent.reviewCount && agent.averageRating ? (
        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={agent.averageRating} size="sm" />
          <span className="text-xs text-slate-500">
            {agent.averageRating} ({agent.reviewCount})
          </span>
        </div>
      ) : null}
      <p className="mt-3 text-sm text-slate-600">
        {nonTh ? "Areas" : "ย่าน"}: {agent.areas.join(", ")}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {nonTh ? "Languages" : "ภาษา"}: {agent.languages.join(", ")}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-800">
        {nonTh ? `${agent.deals}+ deals closed` : `ปิดดีลสำเร็จ ${agent.deals}+ รายการ`}
      </p>
      {isDbAgent && (
        <AgentReviewForm teamAgentId={agent.id} agentName={agent.name} loggedIn={loggedIn} />
      )}
    </div>
  );
}

export default async function AgentsPage() {
  const [agents, locale, user] = await Promise.all([
    getPublishedTeamAgents(),
    getLocale(),
    getCurrentUser(),
  ]);
  const nonTh = locale !== "th";
  const grouped = groupByAgentCategory(agents);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("agents", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {nonTh ? t("agentDesc", locale) : "นอกจาก AI ค้นหาทรัพย์แล้ว เรามีทีมเอเจนต์ที่พาไปชมทรัพย์จริง ตอบคำถามเรื่องสัญญาเช่า/ซื้อขาย และดูแลจนปิดดีล"}
      </p>

      {AGENT_CATEGORIES.map((category) => {
        const list = grouped[category];
        if (list.length === 0) return null;
        return (
          <section key={category} className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">{agentCategoryLabel(category, locale)}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {list.map((agent) => (
                <AgentCard key={agent.id} agent={agent} nonTh={nonTh} loggedIn={Boolean(user)} />
              ))}
            </div>
          </section>
        );
      })}

      <section
        id="join-agent"
        className="mt-12 scroll-mt-24 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8 shadow-sm"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t("agentsJoinTitle", locale)}</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{t("agentsJoinDesc", locale)}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="font-bold text-teal-600">✓</span>
                {t("agentsJoinBenefit1", locale)}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-teal-600">✓</span>
                {t("agentsJoinBenefit2", locale)}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-teal-600">✓</span>
                {t("agentsJoinBenefit3", locale)}
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <AgentInterestForm />
          </div>
        </div>
      </section>

      <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-white">
        <h2 className="text-xl font-bold">
          {nonTh ? "How our agent team works" : "ขั้นตอนการทำงานของทีมเอเจนต์"}
        </h2>
        <ol className="mt-6 space-y-4 text-slate-300">
          <li>
            <strong className="text-white">1.</strong>{" "}
            {nonTh ? "Receive your brief — budget, area, bedrooms, or use AI search" : "รับ brief จากลูกค้า — งบ ทำเล จำนวนห้องนอน หรือใช้ AI ค้นหา"}
          </li>
          <li>
            <strong className="text-white">2.</strong>{" "}
            {nonTh ? "Shortlist properties from site listings and owner-direct posts" : "คัดเลือกทรัพย์จากประกาศบนเว็บและทรัพย์จากเจ้าของโดยตรง"}
          </li>
          <li>
            <strong className="text-white">3.</strong>{" "}
            {nonTh ? "Schedule physical viewings — multiple projects in one day" : "นัดชมทรัพย์จริง — พาไปดูหลายโครงการในวันเดียว"}
          </li>
          <li>
            <strong className="text-white">4.</strong>{" "}
            {nonTh ? "Negotiate and close — contract review through completion" : "เจรจาและปิดดีล — ช่วยต่อรอง ตรวจสอบสัญญา ดูแลจนเสร็จสิ้น"}
          </li>
        </ol>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-xl bg-teal-500 px-6 py-3 font-medium text-white hover:bg-teal-400"
        >
          {nonTh ? "Talk to an agent →" : "นัดคุยกับเอเจนต์ →"}
        </Link>
      </div>
    </div>
  );
}
