import type { Locale } from "@/lib/i18n";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

const privacyTh: LegalSection[] = [
  {
    id: "intro",
    title: "บทนำ",
    paragraphs: [
      "Condominium.in.th (“เรา”) ให้บริการแพลตฟอร์มซื้อ-เช่าคอนโดและบ้านในกรุงเทพฯ นโยบายความเป็นส่วนตัวนี้อธิบายว่าเราเก็บ ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)",
    ],
  },
  {
    id: "data-collected",
    title: "ข้อมูลที่เราเก็บ",
    paragraphs: [
      "ข้อมูลบัญชี: ชื่อ-นามสกุล เบอร์โทร อีเมล รหัสผ่าน (เข้ารหัส) สถานะการยืนยันตัวตน (อีเมล/LINE/โทรศัพท์)",
      "ข้อมูลประกาศ: รายละเอียดทรัพย์ รูปภาพ ที่อยู่ และข้อมูลที่คุณกรอกเมื่อลงประกาศ",
      "ข้อมูลการติดต่อ: ข้อความจากฟอร์มติดต่อ ลีดจากหน้าประกาศ หรือ AI ค้นหา",
      "ข้อมูลการใช้งาน: คำค้นหา การดูประกาศ ภาษาที่เลือก และเหตุการณ์ analytics (เมื่อคุณยินยอมคุกกี้ analytics)",
    ],
  },
  {
    id: "purpose",
    title: "วัตถุประสงค์การใช้ข้อมูล",
    paragraphs: [
      "ให้บริการบัญชีผู้ใช้ การลงประกาศ การจับคู่ผู้ซื้อ/ผู้เช่ากับเจ้าของหรือทีมเอเจนต์",
      "ส่ง OTP และอีเมลยืนยัน รวมถึงลิงก์รีเซ็ตรหัสผ่าน (ทางอีเมลเท่านั้น)",
      "ปรับปรุงเว็บไซต์ วิเคราะห์การใช้งาน และความปลอดภัยของระบบ",
      "ปฏิบัติตามกฎหมายที่เกี่ยวข้อง",
    ],
  },
  {
    id: "cookies",
    title: "คุกกี้",
    paragraphs: [
      "คุกกี้ที่จำเป็น (ไม่ต้องขอความยินยอม): condo_session (เข้าสู่ระบบ), condo_locale (ภาษา), condo_cookie_consent (การเลือกความยินยอมคุกกี้), line_oauth_state (ความปลอดภัย LINE Login ชั่วคราว)",
      "คุกกี้ analytics (ต้องขอความยินยอม): Google Analytics 4 เมื่อคุณกด “ยอมรับทั้งหมด” — ใช้วัดการเข้าชมและปรับปรุงบริการ",
      "คุณสามารถเลือก “จำเป็นเท่านั้น” เพื่อปิด analytics ได้ตลอดเวลา",
    ],
  },
  {
    id: "sharing",
    title: "การเปิดเผยข้อมูล",
    paragraphs: [
      "เราไม่ขายข้อมูลส่วนบุคคล เราอาจใช้ผู้ให้บริการภายนอก (โฮสติ้ง อีเมล SMS ที่จำเป็น เก็บรูป ชำระเงิน) เพื่อให้บริการตามสัญญาและมาตรฐานความปลอดภัย",
      "ข้อมูลติดต่อจากลีดอาจส่งถึงเจ้าของทรัพย์หรือเอเจนต์ที่เกี่ยวข้องกับประกาศนั้น",
    ],
  },
  {
    id: "rights",
    title: "สิทธิของเจ้าของข้อมูล",
    paragraphs: [
      "คุณมีสิทธิขอเข้าถึง แก้ไข ลบ หรือจำกัดการใช้ข้อมูล รวมถึงถอนความยินยอม โดยติดต่อ hello@condominium.in.th",
      "เราจะตอบคำขอภายในระยะเวลาที่กฎหมายกำหนด",
    ],
  },
  {
    id: "contact",
    title: "ติดต่อ",
    paragraphs: ["อีเมล: hello@condominium.in.th", "เว็บไซต์: https://www.condominium.in.th/contact"],
  },
];

const privacyEn: LegalSection[] = [
  {
    id: "intro",
    title: "Introduction",
    paragraphs: [
      "Condominium.in.th (“we”) operates a Bangkok property marketplace. This Privacy Policy explains how we collect, use, and protect personal data under Thailand’s PDPA.",
    ],
  },
  {
    id: "data-collected",
    title: "Data we collect",
    paragraphs: [
      "Account data: name, phone, email, password (hashed), verification status (email/LINE/phone).",
      "Listing data: property details, photos, address, and fields you submit when posting.",
      "Contact data: messages from contact forms, listing inquiries, or AI search leads.",
      "Usage data: search queries, listing views, language preference, and analytics events (only if you accept analytics cookies).",
    ],
  },
  {
    id: "purpose",
    title: "How we use data",
    paragraphs: [
      "Provide accounts, listings, and matching buyers/tenants with owners or agents.",
      "Send OTP and verification email, including password reset links (email only — no SMS reset).",
      "Improve the site, analyze usage, and maintain security.",
      "Comply with applicable law.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "Essential cookies (no consent required): condo_session (login), condo_locale (language), condo_cookie_consent (your choice), line_oauth_state (temporary LINE OAuth security).",
      "Analytics cookies (consent required): Google Analytics 4 when you click “Accept all” — used to measure traffic and improve the service.",
      "You may choose “Essential only” to disable analytics at any time.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    paragraphs: [
      "We do not sell personal data. We use processors (hosting, email, SMS when needed, image storage, payments) under contractual safeguards.",
      "Lead contact details may be shared with the listing owner or assigned agent for that property.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paragraphs: [
      "You may request access, correction, deletion, or restriction, and withdraw consent by emailing hello@condominium.in.th.",
      "We respond within timelines required by law.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: ["Email: hello@condominium.in.th", "Web: https://www.condominium.in.th/contact"],
  },
];

const termsTh: LegalSection[] = [
  {
    id: "acceptance",
    title: "การยอมรับข้อกำหนด",
    paragraphs: [
      "การใช้งาน Condominium.in.th หมายความว่าคุณยอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัว หากไม่ยอมรับ กรุณาหยุดใช้บริการ",
    ],
  },
  {
    id: "accounts",
    title: "บัญชีผู้ใช้",
    paragraphs: [
      "คุณต้องให้ข้อมูลที่ถูกต้องและรักษาความลับรหัสผ่าน การรีเซ็ตรหัสผ่านทำได้ทางอีเมลเท่านั้น สำหรับบัญชี user, agent และ admin",
      "เราอาจระงับบัญชีที่ละเมิดข้อกำหนดหรือกฎหมาย",
    ],
  },
  {
    id: "listings",
    title: "ประกาศทรัพย์",
    paragraphs: [
      "เจ้าของและเอเจนต์ต้องโพสต์ข้อมูลที่ถูกต้อง ไม่หลอกลวง และมีสิทธิ์ลงประกาศ เราอาจตรวจสอบ แก้ไข หรือถอนประกาศที่ไม่เหมาะสม",
      "แพ็กเกจเสริมและสปอนเซอร์เป็นไปตามเงื่อนไขที่แสดงบนหน้าชำระเงิน",
    ],
  },
  {
    id: "conduct",
    title: "พฤติกรรมที่ห้าม",
    paragraphs: [
      "ห้ามโพสต์เนื้อหาผิดกฎหมาย ละเมิดลิขสิทธิ์ สแปม หรือพยายามเจาะระบบ",
      "ห้ามใช้ข้อมูลติดต่อจากเว็บไซต์เพื่อส่งข้อความรบกวนหรือขายต่อโดยไม่ได้รับอนุญาต",
    ],
  },
  {
    id: "liability",
    title: "ข้อจำกัดความรับผิด",
    paragraphs: [
      "เราเป็นตัวกลางแพลตฟอร์ม ไม่รับประกันความสำเร็จของการซื้อ-เช่า การตัดสินใจเป็นของผู้ใช้และคู่สัญญา",
      "บริการให้ “ตามสภาพ” เราไม่รับผิดต่อความเสียหายทางอ้อมที่เกิดจากการใช้งานในขอบเขตที่กฎหมายอนุญาต",
    ],
  },
  {
    id: "changes",
    title: "การเปลี่ยนแปลง",
    paragraphs: [
      "เราอาจปรับข้อกำหนดนี้ การใช้งานต่อหลังประกาศถือว่ายอมรับ วันที่มีผลจะระบุบนหน้านี้",
    ],
  },
];

const termsEn: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance",
    paragraphs: [
      "By using Condominium.in.th you agree to these Terms and our Privacy Policy. If you do not agree, please stop using the service.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    paragraphs: [
      "Provide accurate information and keep your password secure. Password reset is email-only for all roles (user, agent, admin).",
      "We may suspend accounts that violate these terms or applicable law.",
    ],
  },
  {
    id: "listings",
    title: "Listings",
    paragraphs: [
      "Owners and agents must post accurate, non-misleading listings they are authorized to advertise. We may review, edit, or remove inappropriate listings.",
      "Paid packages and sponsorship follow the conditions shown at checkout.",
    ],
  },
  {
    id: "conduct",
    title: "Prohibited conduct",
    paragraphs: [
      "Do not post illegal content, infringe rights, spam, or attempt to compromise the platform.",
      "Do not misuse contact data obtained through the site for unsolicited marketing.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "We operate a marketplace platform and do not guarantee transaction outcomes. Decisions are between users and counterparties.",
      "The service is provided “as is” to the extent permitted by law.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: [
      "We may update these terms. Continued use after notice constitutes acceptance. The effective date is shown on this page.",
    ],
  },
];

export function privacySections(locale: Locale): LegalSection[] {
  return locale === "th" ? privacyTh : privacyEn;
}

export function termsSections(locale: Locale): LegalSection[] {
  return locale === "th" ? termsTh : termsEn;
}

export function legalUpdatedLabel(locale: Locale): string {
  return locale === "th" ? "อัปเดตล่าสุด" : "Last updated";
}

export const legalUpdatedDate = "10 June 2026";
