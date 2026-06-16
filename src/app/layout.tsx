import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { AdSlot } from "@/components/ads/AdSlot";
import { AnalyticsLoader, CookieConsent } from "@/components/layout/CookieConsent";
import { FloatingFeedbackWidget } from "@/components/layout/FloatingFeedbackWidget";
import { TurnstileScript } from "@/components/security/TurnstileScript";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { CompareBar } from "@/components/property/CompareBar";
import { CompareProvider } from "@/components/property/CompareProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { adsenseClientId } from "@/lib/adsense";
import { getLocale } from "@/lib/locale";
import { htmlLang, isRtlLocale } from "@/lib/locale-content";
import { createRootMetadata, siteConfig } from "@/lib/seo";
import { getSiteSettings, resolveHomeMeta } from "@/lib/site-settings";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  return createRootMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, settings] = await Promise.all([getLocale(), getSiteSettings()]);
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const homeMeta = resolveHomeMeta(settings, locale);
  const adsenseClient = adsenseClientId();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: homeMeta.description,
    areaServed: {
      "@type": "City",
      name: "Bangkok",
    },
    availableLanguage: ["Thai", "English", "Chinese", "Japanese", "Arabic"],
  };

  return (
    <html lang={htmlLang(locale)} dir={dir} className={`${notoSansThai.variable} h-full antialiased`}>
      <head>
        {adsenseClient ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <LocaleProvider locale={locale}>
          <CompareProvider>
          <JsonLd data={organizationJsonLd} />
          <AnalyticsLoader />
          <TurnstileScript />
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <AdSlot position="footer" format="auto" className="mb-4" />
          </div>
          <Footer locale={locale} />
          <FloatingFeedbackWidget />
          <CookieConsent />
          <CompareBar />
          </CompareProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
