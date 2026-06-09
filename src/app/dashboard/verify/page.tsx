import { redirect } from "next/navigation";
import { VerifyForm } from "@/components/dashboard/VerifyForm";
import { getCurrentUser } from "@/lib/auth";
import { lineConfigured } from "@/lib/line";

export default async function VerifyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900">ยืนยันตัวตน</h2>
      <p className="mb-8 text-slate-600">
        {user.isThai
          ? "คนไทยยืนยัน LINE และอีเมล เพื่อปลดล็อกการลงประกาศได้สูงสุด 2 รายการฟรี"
          : "ยืนยันอีเมลเพื่อใช้งานเว็บไซต์ (บัญชีชาวต่างชาติยังลงประกาศไม่ได้ในช่วงนี้)"}
      </p>
      <VerifyForm
        email={user.email}
        emailVerified={user.emailVerified}
        lineVerified={user.lineVerified}
        isThai={user.isThai}
        lineConfigured={lineConfigured()}
        phone={user.phone}
        phoneVerified={user.phoneVerified}
      />
    </div>
  );
}
