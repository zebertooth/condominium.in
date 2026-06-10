import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocale } from "@/lib/locale";
import { htmlLang, isRtlLocale } from "@/lib/locale-content";
import { createMetadata, siteConfig } from "@/lib/seo";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} | ซื้อ-เช่าคอนโดใกล้ BTS กรุงเทพฯ`,
  description: siteConfig.description,
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  areaServed: {
    "@type": "City",
    name: "Bangkok",
  },
  availableLanguage: ["Thai", "English", "Chinese", "Japanese", "Arabic"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html lang={htmlLang(locale)} dir={dir} className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <LocaleProvider locale={locale}>
          <JsonLd data={organizationJsonLd} />
          <Analytics />
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
