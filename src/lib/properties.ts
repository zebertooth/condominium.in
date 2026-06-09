import type { Property, SearchFilters } from "@/types/property";

export const properties: Property[] = [
  {
    id: "1",
    slug: "the-loft-asoke-2br-rent",
    title: "เดอะ ลอฟท์ อโศก 2 ห้องนอน วิวเมือง",
    titleEn: "The Loft Asoke 2BR City View",
    description:
      "คอนโดหรูใจกลางอโศก ห่าง BTS อโศก 350 เมตร ตกแต่งครบ พร้อมเข้าอยู่ เหมาะสำหรับชาวต่างชาติและผู้บริหาร",
    listingType: "rent",
    propertyType: "condo",
    price: 45000,
    priceUnit: "THB/month",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 68,
    floor: 28,
    district: "วัฒนา",
    districtEn: "Watthana",
    btsStation: "อโศก",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 350,
    address: "สุขุมวิท 21 วัฒนา กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "ฟิตเนส", "ที่จอดรถ", "รปภ. 24 ชม.", "ใกล้ BTS"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    featured: true,
    publishedAt: "2026-05-01",
  },
  {
    id: "2",
    slug: "ideo-mobi-sukhumvit-1br-rent",
    title: "ไอดีโอ โมบิ สุขุมวิท 1 ห้องนอน ใกล้ BTS เอกมัย",
    titleEn: "Ideo Mobi Sukhumvit 1BR near Ekkamai BTS",
    description:
      "คอนโดใหม่ สไตล์โมเดิร์น ใกล้ BTS เอกมัย เดินทางสะดวก ราคาเช่าเหมาะสมสำหรับคนทำงาน",
    listingType: "rent",
    propertyType: "condo",
    price: 18000,
    priceUnit: "THB/month",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 32,
    floor: 15,
    district: "วัฒนา",
    districtEn: "Watthana",
    btsStation: "เอกมัย",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 200,
    address: "สุขุมวิท 63 วัฒนา กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "Co-working", "ใกล้ BTS", "เฟอร์นิเจอร์ครบ"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    featured: true,
    publishedAt: "2026-05-10",
  },
  {
    id: "3",
    slug: "life-sathorn-silom-sale",
    title: "ไลฟ์ สาทร-สีลม 2 ห้องนอน ขาย",
    titleEn: "Life Sathorn-Silom 2BR for Sale",
    description:
      "คอนโดทำเลทอง ใกล้ BTS สุรศักดิ์ และ MRT ลุมพินี มูลค่าเพิ่มดี เหมาะลงทุน",
    listingType: "sale",
    propertyType: "condo",
    price: 8500000,
    priceUnit: "THB",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 55,
    floor: 22,
    district: "บางรัก",
    districtEn: "Bang Rak",
    btsStation: "สุรศักดิ์",
    btsLine: "สีลม",
    distanceToBtsMeters: 400,
    address: "สาทรใต้ บางรัก กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "Sky Lounge", "ใกล้ BTS/MRT", "วิวแม่น้ำเจ้าพระยา"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    ],
    featured: true,
    publishedAt: "2026-04-20",
  },
  {
    id: "4",
    slug: "the-line-ratchathewi-rent",
    title: "เดอะ ไลน์ ราชเทวี สตูดิโอ ใกล้ BTS ราชเทวี",
    titleEn: "The Line Ratchathewi Studio near BTS",
    description: "สตูดิโอขนาดกะทัดรัด ติด BTS ราชเทวี เหมาะนักศึกษาและคนทำงาน",
    listingType: "rent",
    propertyType: "condo",
    price: 14000,
    priceUnit: "THB/month",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 28,
    floor: 8,
    district: "ราชเทวี",
    districtEn: "Ratchathewi",
    btsStation: "ราชเทวี",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 150,
    address: "พญาไท ราชเทวี กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "ใกล้ BTS", "เครื่องใช้ไฟฟ้าครบ"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    ],
    featured: false,
    publishedAt: "2026-05-15",
  },
  {
    id: "5",
    slug: "noble-reform-phayathai-sale",
    title: "โนเบิล รีฟอร์ม พญาไท 1 ห้องนอน ขาย",
    titleEn: "Noble Reform Phayathai 1BR Sale",
    description: "คอนโดใหม่ใกล้ BTS พญาไท ราคาต่อตร.ม.ดี เหมาะอยู่อาศัยและปล่อยเช่า",
    listingType: "sale",
    propertyType: "condo",
    price: 4200000,
    priceUnit: "THB",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 35,
    floor: 12,
    district: "ราชเทวี",
    districtEn: "Ratchathewi",
    btsStation: "พญาไท",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 300,
    address: "พญาไท ราชเทวี กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "ฟิตเนส", "ใกล้ BTS", "ใกล้ Airport Rail Link"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    featured: false,
    publishedAt: "2026-03-01",
  },
  {
    id: "6",
    slug: "rhythm-sathorn-rent",
    title: "ริทึ่ม สาทร 2 ห้องนอน เช่า",
    titleEn: "Rhythm Sathorn 2BR Rent",
    description: "คอนโดสาทร วิวสวย ใกล้ BTS สุรศักดิ์ ตกแต่งสวย พร้อมเข้าอยู่",
    listingType: "rent",
    propertyType: "condo",
    price: 32000,
    priceUnit: "THB/month",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 58,
    floor: 18,
    district: "สาทร",
    districtEn: "Sathorn",
    btsStation: "สุรศักดิ์",
    btsLine: "สีลม",
    distanceToBtsMeters: 500,
    address: "สาทร สาทร กรุงเทพฯ",
    features: ["สระว่ายน้ำ", "Sauna", "ใกล้ BTS", "เฟอร์นิเจอร์ครบ"],
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
    ],
    featured: true,
    publishedAt: "2026-05-20",
  },
  {
    id: "7",
    slug: "the-room-phrom-phong-2br-sale",
    title: "เดอะ รูม พร้อมพงษ์ 2 ห้องนอน ขาย ติด EmQuartier",
    titleEn: "The Room Phrom Phong 2BR Sale near EmQuartier",
    description:
      "คอนโดเกรดพรีเมียม ใกล้ BTS พร้อมพงษ์ เดินถึง EmQuartier และ Emporium ตกแต่งสวย เหมาะอยู่อาศัยและลงทุนปล่อยเช่า",
    listingType: "sale",
    propertyType: "condo",
    price: 11500000,
    priceUnit: "THB",
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 62,
    floor: 20,
    district: "วัฒนา",
    districtEn: "Watthana",
    btsStation: "พร้อมพงษ์",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 280,
    address: "สุขุมวิท 24 วัฒนา กรุงเทพฯ",
    latitude: 13.7305,
    longitude: 100.5695,
    features: ["สระว่ายน้ำ", "ฟิตเนส", "ใกล้ BTS", "ติดห้างสรรพสินค้า"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    featured: true,
    publishedAt: "2026-05-22",
  },
  {
    id: "8",
    slug: "noble-ploenchit-chidlom-1br-rent",
    title: "โนเบิล เพลินจิต ใกล้ BTS ชิดลม 1 ห้องนอน เช่า",
    titleEn: "Noble Ploenchit 1BR Rent near Chidlom BTS",
    description:
      "คอนโดใจกลางเมือง ใกล้ BTS ชิดลม และ Central Chidlom เดินทางสะดวก วิวเมืองสวย พร้อมเฟอร์นิเจอร์ครบ",
    listingType: "rent",
    propertyType: "condo",
    price: 34000,
    priceUnit: "THB/month",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 45,
    floor: 25,
    district: "ปทุมวัน",
    districtEn: "Pathum Wan",
    btsStation: "ชิดลม",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 250,
    address: "เพลินจิต ปทุมวัน กรุงเทพฯ",
    latitude: 13.744,
    longitude: 100.543,
    features: ["สระว่ายน้ำ", "ฟิตเนส", "ใกล้ BTS", "วิวเมือง", "เฟอร์นิเจอร์ครบ"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    featured: false,
    publishedAt: "2026-05-25",
  },
  {
    id: "9",
    slug: "the-line-ari-studio-rent",
    title: "เดอะ ไลน์ อารีย์ สตูดิโอ เช่า ย่านคาเฟ่",
    titleEn: "The Line Ari Studio Rent",
    description:
      "สตูดิโอสไตล์โมเดิร์น ใกล้ BTS อารีย์ ย่านคาเฟ่และร้านอาหารฮิป บรรยากาศร่มรื่น เหมาะกับคนรุ่นใหม่",
    listingType: "rent",
    propertyType: "condo",
    price: 16000,
    priceUnit: "THB/month",
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 30,
    floor: 10,
    district: "พญาไท",
    districtEn: "Phaya Thai",
    btsStation: "อารีย์",
    btsLine: "สุขุมวิท",
    distanceToBtsMeters: 350,
    address: "พหลโยธิน อารีย์ กรุงเทพฯ",
    latitude: 13.7797,
    longitude: 100.5447,
    features: ["สระว่ายน้ำ", "Co-working", "ใกล้ BTS", "ย่านคาเฟ่"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    ],
    featured: false,
    publishedAt: "2026-05-28",
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function filterProperties(filters: SearchFilters): Property[] {
  return properties.filter((p) => {
    if (filters.listingType && p.listingType !== filters.listingType) return false;
    if (filters.district && p.district !== filters.district) return false;
    if (filters.btsStation && p.btsStation !== filters.btsStation) return false;
    if (filters.bedrooms && p.bedrooms < filters.bedrooms) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = [
        p.title,
        p.titleEn,
        p.description,
        p.district,
        p.btsStation ?? "",
        p.address,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}

export function getDistricts(): string[] {
  return [...new Set(properties.map((p) => p.district))];
}

export function getBtsStations(): string[] {
  return [...new Set(properties.map((p) => p.btsStation).filter(Boolean))] as string[];
}
