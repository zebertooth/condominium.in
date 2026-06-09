import Link from "next/link";
import { redirect } from "next/navigation";
import { PostPropertyForm } from "@/components/dashboard/PostPropertyForm";
import { getCurrentUser } from "@/lib/auth";
import { getUserQuota } from "@/lib/quota";

export default async function PostPropertyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const quota = await getUserQuota(user.id);

  if (quota.postingBlocked) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">ยังไม่เปิดให้ลงประกาศ</h2>
        <p className="mt-2 text-sky-800">
          ขณะนี้บัญชีชาวต่างชาติยังไม่สามารถลงประกาศได้ จะเปิดให้บริการในเฟสถัดไป
          คุณยังสามารถค้นหาทรัพย์และติดต่อทีมเอเจนต์ได้ตามปกติ
        </p>
        <Link
          href="/ai-search"
          className="mt-4 inline-block rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          ค้นหาทรัพย์ด้วย AI →
        </Link>
      </div>
    );
  }

  if (quota.requiresVerification) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">กรุณายืนยันตัวตนก่อน</h2>
        <p className="mt-2 text-amber-800">
          ยืนยัน LINE และอีเมล เพื่อลงประกาศได้ {quota.freeLimit} รายการฟรี
        </p>
        <Link
          href="/dashboard/verify"
          className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          ไปยืนยันตัวตน →
        </Link>
      </div>
    );
  }

  if (!quota.canPost) {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="font-bold text-violet-900">โควตาประกาศเต็มแล้ว</h2>
        <p className="mt-2 text-violet-800">
          คุณใช้ {quota.used}/{quota.maxAllowed} ประกาศแล้ว{" "}
          {quota.canBuyPackages
            ? "ซื้อแพ็กเพิ่มเพื่อลงต่อ"
            : "ติดต่อแอดมินเพื่อเพิ่มโควตาประกาศ"}
        </p>
        {quota.canBuyPackages && (
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
          >
            ซื้อแพ็กเพิ่ม →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-slate-600">
        {quota.unlimited
          ? `ลงประกาศได้ไม่จำกัด (ใช้แล้ว ${quota.used})`
          : `เหลือโควตา ${quota.remaining} ประกาศ (ใช้แล้ว ${quota.used}/${quota.maxAllowed})`}
      </p>
      <PostPropertyForm />
    </div>
  );
}
