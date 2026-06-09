export type Locale = "th" | "zh" | "ja" | "ar";

export const defaultLocale: Locale = "th";

export const locales: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "th", label: "ไทย", dir: "ltr" },
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "ja", label: "日本語", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

const translations = {
  siteName: "Condominium.in.th",
  tagline: "ตลาดคอนโดและบ้าน ซื้อ-เช่า ใกล้ BTS กรุงเทพฯ",
  buy: "ซื้อ",
  rent: "เช่า",
  aiSearch: "ค้นหาด้วย AI",
  listProperty: "ลงประกาศฟรี",
  agents: "ทีมเอเจนต์",
  areas: "ย่านใกล้ BTS",
  blog: "บทความ",
  contact: "ติดต่อเรา",
  searchPlaceholder: "เช่น คอนโด 2 ห้องนอน ใกล้ BTS อโศก งบ 25,000",
  featuredListings: "ประกาศแนะนำ",
  nearBts: "ใกล้รถไฟฟ้า BTS",
  viewAll: "ดูทั้งหมด",
  bedrooms: "ห้องนอน",
  bathrooms: "ห้องน้ำ",
  sqm: "ตร.ม.",
  perMonth: "/เดือน",
  million: "ล้าน",
  scheduleViewing: "นัดชมทรัพย์",
  contactAgent: "ติดต่อเอเจนต์",
  ownerTitle: "เจ้าของทรัพย์? ลงประกาศกับเรา",
  ownerDesc: "ทีมงานของเราจะช่วยถ่ายรูป จัดทำรายละเอียด และหาผู้เช่า/ผู้ซื้อให้คุณ",
  agentTitle: "ทีมเอเจนต์มืออาชีพ",
  agentDesc: "พาไปชมทรัพย์จริง ให้คำปรึกษา และดูแลจนปิดดีล",
  aiTitle: "AI ช่วยหาคอนโดที่ใช่",
  aiDesc: "บอกความต้องการเป็นภาษาพูด AI จะวิเคราะห์ข้อมูลทุกประกาศและแนะนำทรัพย์ที่ตรงใจ",
  footerAbout:
    "Condominium.in.th คือแพลตฟอร์มซื้อ-เช่าคอนโดและบ้านในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อมทีมเอเจนต์และ AI ค้นหาอัจฉริยะ",
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey): string {
  return translations[key];
}

export function formatPrice(price: number, unit: string): string {
  if (unit === "THB/month") {
    return `฿${price.toLocaleString("th-TH")}${translations.perMonth}`;
  }
  if (price >= 1_000_000) {
    return `฿${(price / 1_000_000).toFixed(2)} ${translations.million}`;
  }
  return `฿${price.toLocaleString("th-TH")}`;
}
