import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "ลงประกาศคอนโด | Condominium.in.th",
  description:
    "ลงประกาศขาย-เช่าคอนโดด้วยตัวเอง ฟรี 2 รายการ สำหรับคนไทยหลังยืนยัน LINE และอีเมล",
  path: "/list-property",
  keywords: ["ลงประกาศคอนโด", "ฝากขายคอนโด", "ฝากเช่าคอนโด"],
});

export default async function ListPropertyPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard/post");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">ลงประกาศด้วยตัวเอง</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        คนไทยสมัครสมาชิก ยืนยัน <strong>LINE</strong> และ <strong>อีเมล</strong> แล้วลงประกาศได้ฟรี{" "}
        <strong>2 รายการ</strong> · ชาวต่างชาติยืนยันอีเมลเพื่อใช้งานและติดต่อทีมเอเจนต์
      </p>

      <ul className="mt-6 space-y-3 text-slate-700">
        <li>✓ ยืนยันผ่าน LINE (สำหรับคนไทย)</li>
        <li>✓ ยืนยันอีเมลด้วย OTP</li>
        <li>✓ ลงประกาศฟรี 2 รายการ</li>
        <li>✓ ตรวจสอบและอนุมัติโดยแอดมินก่อนเผยแพร่</li>
      </ul>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/register"
          className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700"
        >
          สมัครสมาชิก
        </Link>
        <Link
          href="/login"
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-800 hover:bg-slate-50"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
