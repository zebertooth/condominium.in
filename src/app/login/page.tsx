import { LoginForm } from "@/components/auth/LoginForm";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "เข้าสู่ระบบ | Condominium.in.th",
  description: "เข้าสู่ระบบเพื่อจัดการประกาศคอนโดของคุณ",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
