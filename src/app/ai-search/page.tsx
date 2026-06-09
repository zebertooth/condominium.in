import { Suspense } from "react";
import { AISearchClient } from "@/components/ai/AISearchClient";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "ค้นหาคอนโดด้วย AI | Condominium.in.th",
  description:
    "บอกความต้องการเป็นภาษาพูด AI วิเคราะห์ประกาศทั้งหมดและแนะนำคอนโดใกล้ BTS ที่ตรงใจในกรุงเทพฯ",
  path: "/ai-search",
  keywords: ["AI ค้นหาคอนโด", "คอนโดใกล้ BTS", "แนะนำคอนโด"],
});

export default function AISearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">ค้นหาคอนโดด้วย AI</h1>
      <p className="mt-2 text-slate-600">
        บอกความต้องการเป็นภาษาพูด เช่น ย่าน BTS จำนวนห้องนอน และงบประมาณ
        AI จะวิเคราะห์ข้อมูลทุกประกาศบนเว็บไซต์และแนะนำทรัพย์ที่เหมาะสม
      </p>

      <Suspense fallback={<div className="mt-8 text-slate-500">กำลังโหลด...</div>}>
        <div className="mt-8">
          <AISearchClient />
        </div>
      </Suspense>
    </div>
  );
}
