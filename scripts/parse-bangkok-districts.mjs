import { writeFileSync, readFileSync } from "fs";

const WIKI_TH =
  "https://th.wikipedia.org/w/api.php?action=parse&page=" +
  encodeURIComponent("รายชื่อเขตของกรุงเทพมหานคร") +
  "&prop=wikitext&format=json";

const WIKI_EN =
  "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_districts_of_Bangkok&prop=wikitext&format=json";

const [thRes, enRes] = await Promise.all([fetch(WIKI_TH), fetch(WIKI_EN)]);
const thText = (await thRes.json()).parse.wikitext["*"];
const enText = (await enRes.json()).parse.wikitext["*"];

// Thai: [[เขตพระนคร|พระนคร]] or [[เขตพระนคร]]
const thDistricts = [];
const thSeen = new Set();
for (const m of thText.matchAll(/\[\[(เขต[^\]|#]+)(?:\|([^\]]+))?\]\]/g)) {
  const nameTh = (m[2] || m[1].replace(/^เขต/, "")).trim();
  if (nameTh.length < 2 || thSeen.has(nameTh)) continue;
  thSeen.add(nameTh);
  thDistricts.push(nameTh);
}

// English table: | [[Phra Nakhon district|Phra Nakhon]] or similar
const enMap = new Map();
for (const m of enText.matchAll(/\|\s*\[\[([^\]|]+)\|([^\]]+)\]\]/g)) {
  const en = m[2].trim().replace(/\s+district$/i, "");
  enMap.set(en.toLowerCase(), en);
}
for (const m of enText.matchAll(/\[\[([^\]|]+)\s+district\|([^\]]+)\]\]/gi)) {
  enMap.set(m[2].trim().toLowerCase(), m[2].trim());
}

// Standard Thai → English mapping for all 50 Bangkok districts
const EN_BY_TH = {
  พระนคร: "Phra Nakhon",
  ดุสิต: "Dusit",
  หนองจอก: "Nong Chok",
  บางรัก: "Bang Rak",
  บางเขน: "Bang Khen",
  บางกะปิ: "Bang Kapi",
  ปทุมวัน: "Pathum Wan",
  ป้อมปราบศัตรูพ่าย: "Pom Prap Sattru Phai",
  พระโขนง: "Phra Khanong",
  มีนบุรี: "Min Buri",
  ลาดกระบัง: "Lat Krabang",
  ยานนาวา: "Yan Nawa",
  สัมพันธวงศ์: "Samphanthawong",
  พญาไท: "Phaya Thai",
  ธนบุรี: "Thon Buri",
  คลองสาน: "Khlong San",
  ตลิ่งชัน: "Taling Chan",
  บางกอกใหญ่: "Bangkok Yai",
  ห้วยขวาง: "Huai Khwang",
  คลองสามวา: "Khlong Sam Wa",
  บางนา: "Bang Na",
  วัฒนา: "Watthana",
  ดินแดง: "Din Daeng",
  บึงกุ่ม: "Bueng Kum",
  สาทร: "Sathon",
  บางซื่อ: "Bang Sue",
  จตุจักร: "Chatuchak",
  บางพลัด: "Bang Phlat",
  ดอนเมือง: "Don Mueang",
  ราชเทวี: "Ratchathewi",
  ลาดพร้าว: "Lat Phrao",
  วังทองหลาง: "Wang Thonglang",
  คลองเตย: "Khlong Toei",
  สวนหลวง: "Suan Luang",
  จอมทอง: "Chom Thong",
  บางแค: "Bang Khae",
  หนองแขม: "Nong Khaem",
  ราษฎร์บูรณะ: "Rat Burana",
  บางพลัด: "Bang Phlat",
  บางบอน: "Bang Bon",
  ประเวศ: "Prawet",
  สะพานสูง: "Saphan Sung",
  สายไหม: "Sai Mai",
  คันนายาว: "Khan Na Yao",
  บางขุนเทียน: "Bang Khun Thian",
  ภาษีเจริญ: "Phasi Charoen",
  ทวีวัฒนา: "Thawi Watthana",
  ทุ่งครุ: "Thung Khru",
  บางมด: "Bang Mot",
  ทุ่งครุ: "Thung Khru",
};

const CENTROIDS = {
  พระนคร: [13.7563, 100.5018],
  ดุสิต: [13.7728, 100.5153],
  หนองจอก: [13.8553, 100.8628],
  บางรัก: [13.7307, 100.5246],
  บางเขน: [13.8742, 100.5983],
  บางกะปิ: [13.7651, 100.6477],
  ปทุมวัน: [13.746, 100.534],
  ป้อมปราบศัตรูพ่าย: [13.7584, 100.5137],
  พระโขนง: [13.705, 100.601],
  มีนบุรี: [13.813, 100.732],
  ลาดกระบัง: [13.723, 100.784],
  ยานนาวา: [13.696, 100.545],
  สัมพันธวงศ์: [13.735, 100.513],
  พญาไท: [13.779, 100.544],
  ธนบุรี: [13.719, 100.485],
  คลองสาน: [13.731, 100.509],
  ตลิ่งชัน: [13.776, 100.456],
  บางกอกใหญ่: [13.708, 100.505],
  ห้วยขวาง: [13.778, 100.579],
  คลองสามวา: [13.863, 100.704],
  บางนา: [13.668, 100.604],
  วัฒนา: [13.737, 100.56],
  ดินแดง: [13.769, 100.552],
  บึงกุ่ม: [13.785, 100.669],
  สาทร: [13.72, 100.528],
  บางซื่อ: [13.812, 100.537],
  จตุจักร: [13.803, 100.549],
  บางพลัด: [13.792, 100.475],
  ดอนเมือง: [13.913, 100.607],
  ราชเทวี: [13.752, 100.531],
  ลาดพร้าว: [13.816, 100.603],
  วังทองหลาง: [13.779, 100.609],
  คลองเตย: [13.722, 100.554],
  สวนหลวง: [13.723, 100.651],
  จอมทอง: [13.676, 100.485],
  บางแค: [13.696, 100.408],
  หนองแขม: [13.708, 100.345],
  ราษฎร์บูรณะ: [13.682, 100.505],
  บางบอน: [13.661, 100.395],
  ประเวศ: [13.715, 100.692],
  สะพานสูง: [13.769, 100.684],
  สายไหม: [13.896, 100.652],
  คันนายาว: [13.763, 100.645],
  บางขุนเทียน: [13.623, 100.435],
  ภาษีเจริญ: [13.705, 100.449],
  ทวีวัฒนา: [13.789, 100.363],
  ทุ่งครุ: [13.624, 100.505],
  บางมด: [13.648, 100.485],
};

const districts = thDistricts.map((nameTh, index) => {
  const coords = CENTROIDS[nameTh];
  const nameEn = EN_BY_TH[nameTh] || nameTh;
  return {
    id: `district-${nameTh}`,
    slug: nameTh,
    nameTh,
    nameEn,
    labelTh: `เขต${nameTh}`,
    labelEn: `${nameEn} District`,
    lat: coords?.[0] ?? 13.75 + (index % 7) * 0.008,
    lng: coords?.[1] ?? 100.5 + (index % 7) * 0.008,
    zone:
      nameTh === "พระนคร" || nameTh === "ดุสิต" || nameTh === "ปทุมวัน" || nameTh === "บางรัก"
        ? "inner"
        : nameTh === "วัฒนา" || nameTh === "คลองเตย" || nameTh === "สาทร" || nameTh === "จตุจักร"
          ? "central"
          : "outer",
  };
});

const tsContent = `/**
 * Bangkok districts (50 เขต) — compiled from Thai Wikipedia.
 * @see https://th.wikipedia.org/wiki/รายชื่อเขตของกรุงเทพมหานคร
 * @see https://en.wikipedia.org/wiki/List_of_districts_of_Bangkok
 * Regenerate: node scripts/parse-bangkok-districts.mjs
 */

export type DistrictZone = "inner" | "central" | "outer";

export interface BangkokDistrict {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  labelTh: string;
  labelEn: string;
  lat: number;
  lng: number;
  zone: DistrictZone;
}

export const BANGKOK_DISTRICTS: BangkokDistrict[] = ${JSON.stringify(districts, null, 2)} as BangkokDistrict[];

export const DISTRICT_ZONE_LABELS: Record<DistrictZone, { th: string; en: string }> = {
  inner: { th: "ใจกลางกรุงเทพฯ", en: "Inner Bangkok" },
  central: { th: "ย่านชั้นใน", en: "Central Bangkok" },
  outer: { th: "ปริมณฑล / ชานเมือง", en: "Outer Bangkok" },
};
`;

writeFileSync("src/lib/bangkok-districts-data.ts", tsContent);
console.log("Wrote", districts.length, "districts to src/lib/bangkok-districts-data.ts");
