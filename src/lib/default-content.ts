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

/** Phase 11 — second project review (Life Asoke Hype). */
export const SECOND_PROJECT_REVIEW: BlogPost = {
  slug: "review-life-asoke-hype",
  title: "รีวิว Life Asoke Hype — คอนโดใหม่ใกล้ BTS อโศก",
  titleEn: "Life Asoke Hype Review — New Condo Steps from BTS Asoke",
  excerpt:
    "ทำเลอโศก-เพชรบุรี โครงการ AP ใกล้ BTS อโศกและ MRT เหมาะกับคนทำงาน CBD และนักลงทุนปล่อยเช่า",
  excerptEn:
    "Asoke-Phetchaburi location, AP developer, steps from BTS Asoke and MRT — ideal for CBD workers and rental investors.",
  content: `## สรุปโครงการ

Life Asoke Hype ตั้งอยู่ย่านอโศก ใกล้ BTS อโศกและ MRT เพชบุรี เหมาะกับผู้ทำงานใน CBD และนักลงทุนปล่อยเช่าระยะสั้น-กลาง

## ทำเลและการเดินทาง

เชื่อมต่อ BTS สายสุขุมวิท, MRT สายสีน้ำเงิน และ Airport Rail Link ที่สถานีอโศก มีห้าง Terminal 21 และ Emporium ในรัศมีเดิน

## จุดเด่นของโครงการ

- แบรนด์ Life by AP ที่คุ้นเคยในตลาดคอนโดกลาง-บน
- สิ่งอำนวยความสะดวกครบ: สระว่ายน้ำ infinity, co-working, fitness
- ห้อง Studio–2BR เหมาะปล่อยเช่าให้ expat และคนทำงาน

## เหมาะกับใคร

- ผู้ซื้อเพื่ออยู่เองที่ทำงานใกล้ Asoke–Silom
- นักลงทุนปล่อยเช่าระยะกลาง
- ชาวต่างชาติที่ต้องการ hub เชื่อมต่อทุกสาย

## ประกาศที่เกี่ยวข้อง

ดูประกาศขายและเช่าใกล้ BTS อโศก หรือดู [แนวโน้มราคาย่านอโศก](/market) บน Condominium.in.th`,
  contentEn: `## Project summary

Life Asoke Hype sits in the Asoke district, steps from BTS Asoke and MRT Phetchaburi — ideal for CBD workers and rental investors.

## Location

Connect to Sukhumvit BTS, Blue Line MRT, and Airport Rail Link at Asoke. Terminal 21 and Emporium within walking distance.

## Highlights

- Established Life by AP brand
- Infinity pool, co-working, fitness
- Studio–2BR layouts suited to expat rental demand

## Who is it for?

- Owner-occupiers working in Asoke-Silom
- Buy-to-let investors
- Expats wanting a multi-line transit hub

## Related listings

Browse sale and rent listings near BTS Asoke or see [Asoke market trends](/market) on Condominium.in.th.`,
  category: "รีวิวโครงการ",
  categoryEn: "Project Review",
  imageUrl: COVER.review,
  publishedAt: "2026-06-10",
  readTime: 9,
  seoTitle: "รีวิว Life Asoke Hype อโศก | Condominium.in.th",
  seoTitleEn: "Life Asoke Hype Review Asoke | Condominium.in.th",
  seoDescription:
    "รีวิวโครงการ Life Asoke Hype อโศก ทำเล BTS จุดเด่น ห้องตัวอย่าง และประกาศขาย-เช่า",
  seoDescriptionEn:
    "Life Asoke Hype project review — Asoke location, highlights, and live sale/rent listings.",
  articleType: "project_review",
  projectSlug: "life-asoke-hype",
  projectName: "Life Asoke Hype",
  authorName: "ทีม Condominium.in.th",
  authorTitle: "Editorial",
  reviewNumber: 2,
  facts: {
    developer: "AP (Thailand)",
    totalUnits: "1,200+ ยูนิต",
    pricePerSqm: "฿200,000–260,000/ตร.ม. (ขาย)",
    btsDistance: "350 ม. ถึง BTS อโศก",
    completion: "2021",
    parking: "1 ที่จอด/ยูนิต (บางแบบ)",
    facilities: "Infinity pool, co-working, fitness, รปภ. 24 ชม.",
    suitableFor: "อยู่เอง CBD, ปล่อยเช่า expat, นักลงทุน",
  },
  sections: [
    { id: "summary", title: "สรุปโครงการ" },
    { id: "location", title: "ทำเลและการเดินทาง" },
    { id: "highlights", title: "จุดเด่นของโครงการ" },
    { id: "audience", title: "เหมาะกับใคร" },
    { id: "listings", title: "ประกาศที่เกี่ยวข้อง" },
  ],
  galleryUrls: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  ],
  relatedSlugs: [],
};

/** Phase 11 — Sukhumvit BTS area roundup. */
export const SUKHUMVIT_AREA_ROUNDUP: BlogPost = {
  slug: "sukhumvit-bts-area-guide-2026",
  title: "รวมย่าน BTS สุขุมวิท 2026 — อโศก ทองหล่อ เอกมัย เปรียบเทียบทำเล",
  titleEn: "Sukhumvit BTS Areas 2026 — Asoke, Thonglor, Ekkamai Compared",
  excerpt:
    "เปรียบเทียบย่าน BTS สุขุมวิท ยอดนิยม ราคาเช่า-ขาย จุดเด่น และลิงก์ไปหน้าย่าน + แนวโน้มตลาด",
  excerptEn:
    "Compare popular Sukhumvit BTS areas — rent/sale prices, highlights, area pages, and market trends.",
  content: `## ทำไม Sukhumvit ยังเป็นที่นิยม

สาย BTS สุขุมวิท เชื่อมต่อ CBD, สุวรรณภูมิ และย่านช้อปปิ้ง ทำให้เป็นทำเลอันดับ 1 ของ expat และคนทำงานกรุงเทพฯ

## อโศก (Asoke)

Hub การเชื่อมต่อ BTS + MRT + Airport Rail Link ราคาเช่าเฉลี่ยสูง แต่สภาพคล่องตลาดดี — ดู [คู่มือย่านอโศก](/areas/asoke-bts) และ [แนวโน้มตลาด](/market)

## ทองหล่อ (Thonglor)

ย่านไลฟ์สไตล์และร้านอาหาร ราคาเช่าสูงกว่าเอกมัยเล็กน้อย — ดู [คู่มือย่านทองหล่อ](/areas/thonglor-bts)

## เอกมัย (Ekkamai)

สมดุลระหว่างราคาและไลฟ์สไตล์ ใกล้ Gateway Ekkamai — ดู [คู่มือย่านเอกมัย](/areas/ekkamai-bts)

## สรุปการเลือกย่าน

| ย่าน | เหมาะกับ | ราคาเช่าโดยประมาณ |
|------|----------|-------------------|
| อโศก | ทำงาน CBD, transit hub | ฿25,000–45,000/เดือน |
| ทองหล่อ | ไลฟ์สไตล์, dining | ฿28,000–50,000/เดือน |
| เอกมัย | สมดุลราคา-ทำเล | ฿22,000–40,000/เดือน |

ใช้ [AI ค้นหา](/ai-search) หรือ [แผนที่ประกาศ](/map) เพื่อเปรียบเทียบทรัพย์จริง`,
  contentEn: `## Why Sukhumvit stays popular

The Sukhumvit BTS line connects the CBD, airport link, and shopping — the top choice for expats and Bangkok workers.

## Asoke

Multi-line transit hub. Higher rents but strong liquidity — see [Asoke area guide](/areas/asoke-bts) and [market trends](/market).

## Thonglor

Lifestyle and dining hub — see [Thonglor area guide](/areas/thonglor-bts).

## Ekkamai

Balanced price and lifestyle — see [Ekkamai area guide](/areas/ekkamai-bts).

Use [AI search](/ai-search) or the [listings map](/map) to compare live inventory.`,
  category: "บทความเกี่ยวกับบ้าน",
  categoryEn: "Home articles",
  imageUrl: COVER.areas,
  publishedAt: "2026-06-12",
  readTime: 10,
  seoTitle: "รวมย่าน BTS สุขุมวิท 2026 | Condominium.in.th",
  seoTitleEn: "Sukhumvit BTS Areas Guide 2026 | Condominium.in.th",
  seoDescription: "เปรียบเทียบย่าน BTS อโศก ทองหล่อ เอกมัย ราคาเช่า-ขาย และลิงก์คู่มือย่าน",
  seoDescriptionEn: "Compare Asoke, Thonglor, Ekkamai BTS areas — prices, guides, and market trends.",
  articleType: "area_review",
  authorName: "ทีม Condominium.in.th",
  authorTitle: "Editorial",
  sections: [
    { id: "why", title: "ทำไม Sukhumvit ยังเป็นที่นิยม" },
    { id: "asoke", title: "อโศก" },
    { id: "thonglor", title: "ทองหล่อ" },
    { id: "ekkamai", title: "เอกมัย" },
    { id: "summary", title: "สรุปการเลือกย่าน" },
  ],
  relatedSlugs: [],
};

/** Syndicated summaries from art4d.com — full credit in SourceCredit footer. */
export const ART4D_ARTICLES: BlogPost[] = [
  {
    slug: "central-park-bangkok-dusit-central-park",
    title: "Central Park Bangkok — ศูนย์การค้าใจกลาง Dusit Central Park ย่านสีลม-สาทร",
    titleEn: "Central Park Bangkok — Retail Heart of Dusit Central Park, Silom–Sathorn",
    excerpt:
      "สรุปคอนเซ็ปต์ Here for all of you ศูนย์การค้าใหม่บนพระราม 4 เชื่อม BTS ศาลาแดง / MRT สีลม และ Roof Park 11,200 ตร.ม.",
    excerptEn:
      "Summary of Central Park Bangkok at Dusit Central Park — BTS Sala Daeng / MRT Silom access and 11,200 sqm Roof Park.",
    content: `## โครงการและทำเล

Central Park Bangkok เป็นศูนย์การค้าส่วนหนึ่งของ **Dusit Central Park** มิกซ์ยูสบนถนนพระราม 4 ใกล้ BTS ศาลาแดง และ MRT สีลม เชื่อมต่อย่านสีลม–สาทรและสวนลุมพินี

## แนวคิดการออกแบบ

โครงการใช้กรอบ **Heritage · Integration · Greenery** สะท้อนมรดกโรงแรมดุสิตธานีในมุมมองร่วมสมัย ลวดลายเรขาคณิตและแนวคิด Repetitive but Evolving เชื่อมโรงแรมกับรีเทล

## From City to Nature

ประสบการณ์ผู้ใช้ไล่จากความคึกคักชั้นล่าง (Parkside Market, Food Hall) ไปยัง Roof Park ชั้น 4–6 ผ่านแฟชั่นและไลฟ์สไตล์ จบที่ Dusit Arun และสวนลอยฟ้า 11,200 ตร.ม.

## ที่พักอาศัยและการค้นหาทรัพย์

Dusit Central Park รวมโรงแรม ออฟฟิศ รีเทล และ **Dusit Residences** — ดูประกาศขาย-เช่าใกล้ BTS ศาลาแดง / สีลม บน Condominium.in.th หรือ [แนวโน้มตลาด](/market)`,
    contentEn: `## Project & location

Central Park Bangkok is the retail anchor of **Dusit Central Park** on Rama IV, steps from BTS Sala Daeng and MRT Silom, linking Silom–Sathorn with Lumphini Park.

## Design framework

The development follows **Heritage · Integration · Greenery**, translating Dusit Thani heritage into contemporary geometry and a Repetitive but Evolving retail experience.

## From City to Nature

Visitors move from busy lower floors (Parkside Market, Food Hall) through fashion zones to the 11,200 sqm Roof Park on levels 4–6.

## Homes & listings

Dusit Central Park combines hotel, office, retail and **Dusit Residences** — browse sale/rent listings near BTS Sala Daeng on Condominium.in.th or see [market trends](/market).`,
    category: "บทความเกี่ยวกับบ้าน",
    categoryEn: "Home articles",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    publishedAt: "2026-06-01",
    readTime: 7,
    seoTitle: "Central Park Bangkok Dusit Central Park | Condominium.in.th",
    seoTitleEn: "Central Park Bangkok at Dusit Central Park | Condominium.in.th",
    seoDescription: "สรุป Central Park Bangkok ศูนย์การค้า Dusit Central Park ย่านสีลม-สาทร ใกล้ BTS",
    seoDescriptionEn: "Summary of Central Park Bangkok retail at Dusit Central Park near BTS Silom",
    articleType: "area_review",
    projectSlug: "dusit-central-park",
    authorName: "Condominium.in.th",
    authorTitle: "Editorial",
    sections: [
      { id: "location", title: "โครงการและทำเล" },
      { id: "design", title: "แนวคิดการออกแบบ" },
      { id: "experience", title: "From City to Nature" },
      { id: "listings", title: "ที่พักอาศัยและการค้นหาทรัพย์" },
    ],
    sourceName: "art4d",
    sourceUrl: "https://art4d.com/2026/06/central-park-bangkok",
    sourceTitle: "Central Park Bangkok: ศูนย์การค้าของทุกคนในคอนเซ็ปต์ ‘Here for all of you’",
  },
  {
    slug: "dusit-residences-interior-art4d",
    title: "Dusit Residences — การออกแบบภายใน 2 คอนเซ็ปต์ที่พักอาศัย",
    titleEn: "Dusit Residences — Two Interior Living Concepts",
    excerpt:
      "สรุปจาก art4d: Dusit Residences 117–700 ตร.ม. และ Dusit Parkside 55–115 ตร.ม. โดย OMA, A49, P49 และทีมออกแบบชั้นนำ",
    excerptEn:
      "art4d summary: Dusit Residences (117–700 sqm) vs Dusit Parkside (55–115 sqm) by OMA, A49, P49 and leading designers.",
    content: `## บริบทโครงการ

**Dusit Central Park** บนที่เดิมโรงแรมDusit Thani รวมโรงแรม ที่พักอาศัย ออฟฟิศ และ Central Park โดยDusit Thani × เซ็นทรัลพัฒนา

## สองคอนเซ็ปต์ที่พักอาศัย

- **Dusit Residences** — 160 ยูนิต 117–700 ตร.ม. โทน formal/elegant
- **Dusit Parkside** — 246 ยูนิต 55–115 ตร.ม. โทน lifestyle สำหรับคนรุ่นใหม่

## ทีมออกแบบ

OMA, Architects 49, P49 Deesign & Associates, GRID&CO, P Landscape และ Landscape Collaboration ถ่ายทอดเอกลักษณ์Dusit Thaniสู่การอยู่อาศัยระดับพรีเมียม

## ค้นหาทรัพย์ใกล้โครงการ

ดูประกาศคอนโดย่านสีลม–สาทร หรือ [คู่มือย่านสาทร](/areas/sathorn-bts) บน Condominium.in.th`,
    contentEn: `## Project context

**Dusit Central Park** on the former Dusit Thani site combines hotel, residences, offices and Central Park by Dusit Thani × Central Pattana.

## Two residential concepts

- **Dusit Residences** — 160 units, 117–700 sqm, formal/elegant tone
- **Dusit Parkside** — 246 units, 55–115 sqm, lifestyle-oriented layouts

## Design team

OMA, Architects 49, P49, GRID&CO, P Landscape and Landscape Collaboration translate Dusit heritage into premium homes.

## Find nearby listings

Browse Silom–Sathorn condos or our [Sathorn area guide](/areas/sathorn-bts) on Condominium.in.th.`,
    category: "รีวิวโครงการ",
    categoryEn: "Project Review",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    publishedAt: "2022-02-15",
    readTime: 8,
    seoTitle: "Dusit Residences การออกแบบภายใน | Condominium.in.th",
    seoTitleEn: "Dusit Residences Interior Design | Condominium.in.th",
    seoDescription: "สรุป Dusit Residences และ Dusit Parkside จาก art4d — 2 คอนเซ็ปตที่พักอาศัย",
    seoDescriptionEn: "Dusit Residences & Parkside interior concepts — summary via art4d",
    articleType: "project_review",
    projectSlug: "dusit-central-park",
    reviewNumber: 1,
    authorName: "Condominium.in.th",
    authorTitle: "Editorial",
    facts: {
      developer: "Dusit Thani × Central Pattana",
      totalUnits: "406 ยูนิต (Residences + Parkside)",
      pricePerSqm: "พรีเมียม ย่านสีลม-สาทร",
      btsDistance: "BTS ศาลาแดง / MRT สีลม",
      suitableFor: "ผู้บริหาร, ครอบครัว, นักลงทุน",
    },
    sections: [
      { id: "context", title: "บริบทโครงการ" },
      { id: "concepts", title: "สองคอนเซ็ปตที่พักอาศัย" },
      { id: "team", title: "ทีมออกแบบ" },
      { id: "listings", title: "ค้นหาทรัพย์ใกล้โครงการ" },
    ],
    sourceName: "art4d",
    sourceUrl: "https://art4d.com/2022/02/dusit-residences-part1-interior-design",
    sourceTitle: "DUSIT RESIDENCES / PART1: INTERIOR DESIGN",
  },
  {
    slug: "dusit-residences-architecture-art4d",
    title: "Dusit Residences — สถาปัตยกรรม 69 ชั้น 4 โซนแนวตั้ง",
    titleEn: "Dusit Residences — 69-Storey Tower in Four Vertical Zones",
    excerpt:
      "สรุปจาก art4d: อาคาร 69 ชั้น แบ่ง 4 โซน Private lift lobby ชั้นบน และ Dusit Parkside ชั้นล่าง วิวสวนลุมพินี",
    excerptEn:
      "art4d summary: 69-storey tower in four zones — private lift lobbies upstairs, Dusit Parkside below, Lumphini views.",
    content: `## ภาพรวมสถาปัตยกรรม

อาคารที่พักอาศัย **69 ชั้น** แบ่งเป็น **4 โซนแนวตั้ง** โดย OMA และ Architects 49 ภายใต้ Master Plan Dusit Central Park

## Private lift lobby

โซนบนสองชั้นใช้คอนเซ็ปต์ **Dusit Residences** — ลิฟต์ส่วนตัวต่อยูนิต ความเป็นส่วนตัวสูง

## Dusit Parkside

โซนล่าง **4 ยูนิตต่อลิฟต์** เหมาะไลฟ์สไตล์ urban สระ ฟิตเนส และ lounge อยู่ระหว่างโซน

## Roof Park และสวนลุมพินี

Roof Park บนหลังคาศูนย์การค้าออกแบบ terraced landscape เปิดวิวสวนลุมพินี — จุดเด่นของย่านสีลม–พระราม 4

## ประกาศที่เกี่ยวข้อง

ค้นหาคอนโดใกล้ BTS สาทร บน [Condominium.in.th](/buy/bts/sathorn) หรือ [คู่มือย่านสาทร](/areas/sathorn-bts)`,
    contentEn: `## Architectural overview

The **69-storey** residential tower splits into **four vertical zones** by OMA and Architects 49 within Dusit Central Park.

## Private lift lobby

Upper zones follow **Dusit Residences** — dedicated lift lobbies per unit for maximum privacy.

## Dusit Parkside

Lower zones share lifts among four units; pools, gym and lounges sit between zones.

## Roof Park & Lumphini

The terraced Roof Park frames Lumphini Park views — a signature of Silom–Rama IV.

## Related listings

Search condos near BTS Sathorn on [Condominium.in.th](/buy/bts/sathorn) or our [Sathorn area guide](/areas/sathorn-bts).`,
    category: "รีวิวโครงการ",
    categoryEn: "Project Review",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    publishedAt: "2022-06-15",
    readTime: 8,
    seoTitle: "Dusit Residences สถาปัตยกรรม 69 ชั้น | Condominium.in.th",
    seoTitleEn: "Dusit Residences Architecture | Condominium.in.th",
    seoDescription: "สรุปสถาปัตยกรรม Dusit Residences จาก art4d — 4 โซน วิวลุมพินี",
    seoDescriptionEn: "Dusit Residences architecture summary via art4d — four zones, park views",
    articleType: "project_review",
    projectSlug: "dusit-central-park",
    reviewNumber: 2,
    authorName: "Condominium.in.th",
    authorTitle: "Editorial",
    facts: {
      developer: "Dusit Thani × Central Pattana",
      totalUnits: "69 ชั้น · 4 โซน",
      btsDistance: "250 m+ ถึง BTS/MRT สีลม",
      facilities: "สระ, Fitness, lounge, Roof Park",
      suitableFor: "ผู้บริหาร, ครอบครัว, นักลงทุน",
    },
    sections: [
      { id: "overview", title: "ภาพรวมสถาปัตยกรรม" },
      { id: "residences", title: "Private lift lobby" },
      { id: "parkside", title: "Dusit Parkside" },
      { id: "greenery", title: "Roof Park และสวนลุมพินี" },
      { id: "listings", title: "ประกาศที่เกี่ยวข้อง" },
    ],
    sourceName: "art4d",
    sourceUrl: "https://art4d.com/2022/06/dusit-residences-part2-architecture",
    sourceTitle: "DUSIT RESIDENCES / PART2: ARCHITECTURE",
  },
];

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
