import type { BlogPost } from "@/types/property";

const COVER = {
  rent: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  areas: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  ai: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
  invest: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
  docs: "https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?w=1200&q=80",
  review: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
};

/** Default blog posts — seeded to DB and used as static fallback. */
export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-rent-condo-near-bts-bangkok",
    title: "วิธีเช่าคอนโดใกล้ BTS กรุงเทพฯ สำหรับมือใหม่",
    titleEn: "How to Rent a Condo near BTS Bangkok for Beginners",
    excerpt: "คู่มือเช่าคอนโดใกล้ BTS ตั้งแต่เลือกย่าน ตรวจสอบสัญญา ไปจนถึงนัดชมทรัพย์จริง",
    excerptEn: "Beginner's guide to renting a condo near BTS: from choosing areas, checking lease contracts, to actual viewing.",
    content: `การเช่าคอนโดใกล้ BTS ในกรุงเทพฯ เริ่มจากการกำหนดงบประมาณและย่านที่ต้องการ เช่น อโศก เอกมัย หรือพญาไท

**ขั้นตอนสำคัญ**
1. กำหนดงบเช่า (รวมค่าส่วนกลาง)
2. เลือกสถานี BTS ที่ใกล้ที่ทำงาน
3. ใช้ AI ค้นหาบน Condominium.in.th เพื่อกรองทรัพย์ที่ตรงใจ
4. นัดชมทรัพย์จริงกับทีมเอเจนต์
5. ตรวจสอบสัญญาเช่าและเงินประกัน`,
    contentEn: `Renting a condo near BTS in Bangkok starts with setting your budget and desired area, such as Asoke, Ekkamai, or Phayathai.

**Key Steps**
1. Define your budget (including common area fees)
2. Select BTS stations close to your workplace
3. Use AI Search on Condominium.in.th to filter listings
4. Arrange a physical viewing with our agent team
5. Check the lease contract and security deposit.`,
    category: "คู่มือเช่า",
    categoryEn: "Rent Guide",
    imageUrl: COVER.rent,
    publishedAt: "2026-05-01",
    readTime: 6,
    seoTitle: "วิธีเช่าคอนโดใกล้ BTS กรุงเทพฯ | Condominium.in.th",
    seoTitleEn: "How to Rent a Condo near BTS Bangkok | Condominium.in.th",
    seoDescription: "คู่มือเช่าคอนโดใกล้ BTS สำหรับมือใหม่ เลือกย่าน ตรวจสอบสัญญา และนัดชมทรัพย์จริง",
    seoDescriptionEn: "A complete beginner's guide to renting a condo near BTS: select areas, review lease contracts, and schedule viewings.",
  },
  {
    slug: "best-bts-areas-for-foreigners",
    title: "5 ย่าน BTS ยอดนิยมสำหรับชาวต่างชาติ",
    titleEn: "5 Popular BTS Areas for Foreigners and Expats",
    excerpt: "รวมย่านใกล้ BTS ที่ชาวต่างชาตินิยมเช่าและซื้อคอนโดในกรุงเทพฯ",
    excerptEn: "Top BTS stations where foreigners prefer to buy and rent condominiums in Bangkok.",
    content: `ชาวต่างชาติมักเลือกอยู่ใกล้ BTS เพราะเดินทางสะดวก โดยย่านยอดนิยม ได้แก่ อโศก ทองหล่อ เอกมัย พร้อมพงษ์ และพญาไท`,
    contentEn: `Foreigners and expats usually prefer living near BTS stations for ease of transit. Top popular areas include Asoke, Thonglor, Ekkamai, Phrom Phong, and Phayathai.`,
    category: "ย่านใกล้ BTS",
    categoryEn: "BTS Areas",
    imageUrl: COVER.areas,
    publishedAt: "2026-05-08",
    readTime: 5,
    seoTitle: "5 ย่าน BTS ยอดนิยมสำหรับชาวต่างชาติ | Condominium.in.th",
    seoTitleEn: "5 Popular BTS Areas for Expats in Bangkok | Condominium.in.th",
    seoDescription: "ย่านใกล้ BTS ที่ชาวต่างชาตินิยมเช่าคอนโดในกรุงเทพฯ",
    seoDescriptionEn: "Discover popular BTS stations where expats rent and buy condos in Bangkok.",
  },
  {
    slug: "ai-property-search-guide",
    title: "ค้นหาคอนโดด้วย AI: บอกความต้องการเป็นภาษาพูด",
    titleEn: "Find Condos with AI: Describe Your Dream Home in Plain Words",
    excerpt: "ไม่ต้องกรอกฟอร์มยาวๆ แค่บอก AI ว่าต้องการอะไร ระบบจะแนะนำทรัพย์ที่ตรงใจ",
    excerptEn: "Skip long forms — simply tell the AI what you need and get matching property suggestions.",
    content: `Condominium.in.th มีระบบ AI ค้นหาที่ช่วยวิเคราะห์ประกาศทั้งหมดบนเว็บไซต์`,
    contentEn: `Condominium.in.th features an AI Search engine that analyzes all active listings on the website.`,
    category: "AI ค้นหา",
    categoryEn: "AI Search",
    imageUrl: COVER.ai,
    publishedAt: "2026-05-15",
    readTime: 4,
    seoTitle: "ค้นหาคอนโดด้วย AI บน Condominium.in.th",
    seoTitleEn: "Find Bangkok Condos with AI | Condominium.in.th",
    seoDescription: "ใช้ AI ค้นหาคอนโดในกรุงเทพฯ บอกความต้องการเป็นภาษาพูด",
    seoDescriptionEn: "Use AI to find condos in Bangkok. Describe what you need in plain words.",
  },
  {
    slug: "condo-investment-guide-bangkok-2026",
    title: "ลงทุนคอนโดปล่อยเช่าในกรุงเทพฯ ปี 2026 คุ้มไหม?",
    titleEn: "Is Buying a Rental Condo near BTS Bangkok Worth It in 2026?",
    excerpt: "วิเคราะห์ผลตอบแทนการลงทุนคอนโดปล่อยเช่าใกล้ BTS",
    excerptEn: "Analysis of rental investment yields near BTS: best locations and risks.",
    content: `การลงทุนคอนโดปล่อยเช่าใกล้ BTS ยังเป็นทางเลือกยอดนิยมของนักลงทุน`,
    contentEn: `Investing in buy-to-let condos near BTS remains a popular choice for Thai and foreign investors.`,
    category: "ลงทุน",
    categoryEn: "Investment",
    imageUrl: COVER.invest,
    publishedAt: "2026-05-22",
    readTime: 7,
    seoTitle: "ลงทุนคอนโดปล่อยเช่าในกรุงเทพฯ 2026 | Condominium.in.th",
    seoTitleEn: "Bangkok Buy-to-Let Condo Investment 2026 | Condominium.in.th",
    seoDescription: "วิเคราะห์ผลตอบแทนลงทุนคอนโดปล่อยเช่าใกล้ BTS ปี 2026",
    seoDescriptionEn: "Analyze rental yields for condos near BTS in Bangkok in 2026.",
  },
  {
    slug: "documents-for-renting-condo-bangkok",
    title: "เอกสารที่ต้องเตรียมเมื่อเช่าคอนโดในกรุงเทพฯ",
    titleEn: "Required Documents for Renting a Condo in Bangkok",
    excerpt: "เช็กลิสต์เอกสารสำหรับผู้เช่าและเจ้าของ",
    excerptEn: "Checklist of essential documents for tenants and owners.",
    content: `ก่อนเซ็นสัญญาเช่าคอนโด ทั้งผู้เช่าและเจ้าของควรเตรียมเอกสารให้ครบ`,
    contentEn: `Before signing a lease contract, both tenants and landlords should prepare the necessary documents.`,
    category: "คู่มือเช่า",
    categoryEn: "Rent Guide",
    imageUrl: COVER.docs,
    publishedAt: "2026-05-29",
    readTime: 5,
    seoTitle: "เอกสารเช่าคอนโดในกรุงเทพฯ | Condominium.in.th",
    seoTitleEn: "Bangkok Condo Rental Required Documents | Condominium.in.th",
    seoDescription: "เช็กลิสต์เอกสารเช่าคอนโดสำหรับผู้เช่าและเจ้าของ",
    seoDescriptionEn: "Checklist of essential documents to rent a condo in Bangkok.",
  },
];

/** Phase 9C — pilot project review (Noble Reform Phayathai). */
export const PILOT_PROJECT_REVIEW: BlogPost = {
  slug: "review-noble-reform-phayathai",
  title: "รีวิว Noble Reform พญาไท — คอนโดใหม่ใกล้ BTS 250 เมตร",
  titleEn: "Noble Reform Phayathai Review — New Condo 250m from BTS",
  excerpt:
    "ทำเลพญาไท-ราชเทวี โครงการ Noble ใกล้ BTS พญาไท ห้องตัวอย่างและทรัพย์ขาย-เช่าบน Condominium.in.th",
  excerptEn:
    "Phayathai-Ratchathewi location, Noble developer, 250m to BTS — sample units and live listings on Condominium.in.th.",
  content: `## สรุปโครงการ

Noble Reform ตั้งอยู่ย่านพญาไท ใกล้ BTS พญาไทและ Airport Rail Link เหมาะกับผู้ทำงานในราชเทวี-สยาม และนักลงทุนปล่อยเช่า

## ทำเลและการเดินทาง

เดินถึง BTS พญาไทประมาณ 250 เมตร มีร้านอาหารและห้างสรรพสินค้าในพื้นที่ สะดวกต่อการเดินทางไปสยามและอโศก

## จุดเด่นของโครงการ

- แบรนด์ Noble ที่คุ้นเคยในตลาดคอนโดกรุงเทพฯ
- สิ่งอำนวยความสะดวกครบ: สระว่ายน้ำ ฟิตเนส ล็obby
- ห้องขนาดกะทัดรัด เหมาะปล่อยเช่าให้คนทำงาน

## เหมาะกับใคร

- ผู้ซื้อเพื่ออยู่เองที่ทำงานใกล้ BTS พญาไท-ราชเทวี
- นักลงทุนปล่อยเช่าระยะกลาง-ยาว
- ชาวต่างชาติที่ต้องการทำเลเชื่อมต่อสนามบิน

## ประกาศที่เกี่ยวข้อง

ดูประกาศขายและเช่า Noble Reform บน Condominium.in.th หรือใช้ AI ค้นหาเพื่อเปรียบเทียบห้องในย่านพญาไท`,
  contentEn: `## Project summary

Noble Reform sits in Phayathai, about 250m from BTS Phayathai and the Airport Rail Link — ideal for CBD workers and rental investors.

## Location

Easy access to Siam and Asoke via BTS Sukhumvit line. Daily amenities and malls nearby.

## Highlights

- Established Noble brand
- Pool, fitness, lobby
- Compact layouts suited to rental demand

## Who is it for?

- Owner-occupiers working near the Sukhumvit BTS corridor
- Buy-to-let investors
- Expats wanting airport-linked transit

## Related listings

Browse Noble Reform sale and rent listings on Condominium.in.th or use AI search to compare Phayathai units.`,
  category: "รีวิวโครงการ",
  categoryEn: "Project Review",
  imageUrl: COVER.review,
  publishedAt: "2026-06-01",
  readTime: 8,
  seoTitle: "รีวิว Noble Reform พญาไท | Condominium.in.th",
  seoTitleEn: "Noble Reform Phayathai Review | Condominium.in.th",
  seoDescription:
    "รีวิวโครงการ Noble Reform พญาไท ทำเล BTS 250m จุดเด่น ห้องตัวอย่าง และประกาศขาย-เช่า",
  seoDescriptionEn:
    "Noble Reform Phayathai project review — BTS location, highlights, and live sale/rent listings.",
  articleType: "project_review",
  projectSlug: "noble-reform",
  projectName: "Noble Reform",
  authorName: "ทีม Condominium.in.th",
  authorTitle: "Editorial",
  reviewNumber: 1,
  facts: {
    developer: "Noble Development",
    totalUnits: "800+ ยูนิต",
    pricePerSqm: "฿180,000–220,000/ตร.ม. (ขาย)",
    btsDistance: "250 ม. ถึง BTS พญาไท",
    completion: "2019",
    parking: "1 ที่จอด/ยูนิต (บางแบบ)",
    facilities: "สระว่ายน้ำ, ฟิตเนส, ล็obby, รปภ. 24 ชม.",
    suitableFor: "อยู่เองใกล้ BTS, ปล่อยเช่า, ชาวต่างชาติ",
  },
  sections: [
    { id: "summary", title: "สรุปโครงการ" },
    { id: "location", title: "ทำเลและการเดินทาง" },
    { id: "highlights", title: "จุดเด่นของโครงการ" },
    { id: "audience", title: "เหมาะกับใคร" },
    { id: "listings", title: "ประกาศที่เกี่ยวข้อง" },
  ],
  galleryUrls: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  ],
  relatedSlugs: ["noble-reform-phayathai-sale"],
};

export const DEFAULT_TEAM_AGENTS = [
  {
    name: "คุณสมชาย วัฒนา",
    role: "Senior Property Agent",
    roleEn: "Senior Property Agent",
    areas: ["อโศก", "ทองหล่อ", "เอกมัย"],
    languages: ["ไทย", "English"],
    deals: 120,
    imageUrl: "",
    sortOrder: 0,
  },
  {
    name: "คุณพิมพ์ใจ สาทร",
    role: "Rental Specialist",
    roleEn: "Rental Specialist",
    areas: ["สาทร", "สีลม", "บางรัก"],
    languages: ["ไทย", "日本語"],
    deals: 95,
    imageUrl: "",
    sortOrder: 1,
  },
  {
    name: "คุณอรุณ ราชเทวี",
    role: "Investment Advisor",
    roleEn: "Investment Advisor",
    areas: ["พญาไท", "ราชเทวี", "จตุจักร"],
    languages: ["ไทย", "中文"],
    deals: 78,
    imageUrl: "",
    sortOrder: 2,
  },
];
