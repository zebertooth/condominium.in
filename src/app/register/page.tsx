import { RegisterForm } from "@/components/auth/RegisterForm";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "สมัครสมาชิก",
  description: "สมัครสมาชิกเพื่อลงประกาศคอนโด คนไทยยืนยัน LINE และอีเมล ลงได้สูงสุด 2 รายการฟรี",
  path: "/register",
  });
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">สมัครสมาชิก</h1>
      <p className="mt-2 text-sm text-slate-600">
        คนไทยยืนยัน LINE และอีเมล แล้วลงประกาศได้ฟรี 2 รายการ · ชาวต่างชาติยืนยันอีเมลเพื่อใช้งาน
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
