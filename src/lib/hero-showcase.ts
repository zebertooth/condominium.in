import type { Locale } from "@/lib/i18n";

export interface HeroShowcaseListing {
  title: string;
  meta: string;
  price: string;
  image: string;
}

export interface HeroShowcaseDemo {
  query: string;
  response: string;
  listings: HeroShowcaseListing[];
}

const thDemos: HeroShowcaseDemo[] = [
  {
    query: "คอนโด 2 ห้องนอน ใกล้ BTS อโศก งบ 25,000–45,000",
    response: "พบ 3 ทรัพย์ที่ตรงเงื่อนไข — ใกล้ BTS อโศกและทองหล่อ",
    listings: [
      {
        title: "เดอะ ลอฟท์ อโศก 2 ห้องนอน",
        meta: "วัฒนา · BTS อโศก · 68 ตร.ม.",
        price: "฿45,000/เดือน",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
      },
      {
        title: "ริทึ่ม สาทร 2 ห้องนอน",
        meta: "สาทร · BTS สุรศักดิ์ · 58 ตร.ม.",
        price: "฿32,000/เดือน",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
      },
    ],
  },
  {
    query: "ขายคอนโด 1 ห้องนอน ใกล้ BTS เอกมัย ไม่เกิน 3 ล้าน",
    response: "แนะนำ 2 โครงการ — เดิน BTS ได้ ราคาคุ้มค่า",
    listings: [
      {
        title: "ไอดีโอ โมบิ สุขุมวิท 1 ห้องนอน",
        meta: "วัฒนา · BTS เอกมัย · 32 ตร.ม.",
        price: "฿18,000/เดือน",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
      },
      {
        title: "ไลฟ์ สาทร-สีลม 2 ห้องนอน ขาย",
        meta: "บางรัก · BTS สุรศักดิ์ · 55 ตร.ม.",
        price: "฿8.50 ล้าน",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
      },
    ],
  },
];

const enDemos: HeroShowcaseDemo[] = [
  {
    query: "2-bedroom condo near BTS Asoke, budget 25,000–45,000 THB",
    response: "Found 3 matches — near BTS Asoke & Thong Lo",
    listings: [
      {
        title: "The Loft Asoke 2BR",
        meta: "Watthana · BTS Asoke · 68 sqm",
        price: "฿45,000/mo",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
      },
      {
        title: "Rhythm Sathorn 2BR",
        meta: "Sathorn · BTS Surasak · 58 sqm",
        price: "฿32,000/mo",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
      },
    ],
  },
  {
    query: "Buy 1BR near BTS Ekkamai under 3M THB",
    response: "2 projects match — walkable to BTS, good value",
    listings: [
      {
        title: "Ideo Mobi Sukhumvit 1BR",
        meta: "Watthana · BTS Ekkamai · 32 sqm",
        price: "฿18,000/mo",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
      },
      {
        title: "Life Sathorn-Silom 2BR sale",
        meta: "Bang Rak · BTS Surasak · 55 sqm",
        price: "฿8.50M",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
      },
    ],
  },
];

export function getHeroDemos(locale: Locale): HeroShowcaseDemo[] {
  return locale === "th" ? thDemos : enDemos;
}
