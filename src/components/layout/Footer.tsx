import Link from "next/link";
import { t } from "@/lib/i18n";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white">{t("siteName")}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed">{t("footerAbout")}</p>
        </div>

        <div>
          <h3 className="font-semibold text-white">เมนูหลัก</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/buy" className="hover:text-white">ซื้อคอนโด</Link></li>
            <li><Link href="/rent" className="hover:text-white">เช่าคอนโด</Link></li>
            <li><Link href="/areas" className="hover:text-white">ย่านใกล้ BTS</Link></li>
            <li><Link href="/ai-search" className="hover:text-white">ค้นหาด้วย AI</Link></li>
            <li><Link href="/list-property" className="hover:text-white">ลงประกาศฟรี</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">บริการ</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/agents" className="hover:text-white">ทีมเอเจนต์</Link></li>
            <li><Link href="/blog" className="hover:text-white">บทความ SEO</Link></li>
            <li><Link href="/contact" className="hover:text-white">ติดต่อเรา</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}. สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
}
