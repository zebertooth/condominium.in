/**
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

export const BANGKOK_DISTRICTS: BangkokDistrict[] = [
  {
    "id": "district-พระนคร",
    "slug": "พระนคร",
    "nameTh": "พระนคร",
    "nameEn": "Phra Nakhon",
    "labelTh": "เขตพระนคร",
    "labelEn": "Phra Nakhon District",
    "lat": 13.7563,
    "lng": 100.5018,
    "zone": "inner"
  },
  {
    "id": "district-ดุสิต",
    "slug": "ดุสิต",
    "nameTh": "ดุสิต",
    "nameEn": "Dusit",
    "labelTh": "เขตดุสิต",
    "labelEn": "Dusit District",
    "lat": 13.7728,
    "lng": 100.5153,
    "zone": "inner"
  },
  {
    "id": "district-หนองจอก",
    "slug": "หนองจอก",
    "nameTh": "หนองจอก",
    "nameEn": "Nong Chok",
    "labelTh": "เขตหนองจอก",
    "labelEn": "Nong Chok District",
    "lat": 13.8553,
    "lng": 100.8628,
    "zone": "outer"
  },
  {
    "id": "district-บางรัก",
    "slug": "บางรัก",
    "nameTh": "บางรัก",
    "nameEn": "Bang Rak",
    "labelTh": "เขตบางรัก",
    "labelEn": "Bang Rak District",
    "lat": 13.7307,
    "lng": 100.5246,
    "zone": "inner"
  },
  {
    "id": "district-บางเขน",
    "slug": "บางเขน",
    "nameTh": "บางเขน",
    "nameEn": "Bang Khen",
    "labelTh": "เขตบางเขน",
    "labelEn": "Bang Khen District",
    "lat": 13.8742,
    "lng": 100.5983,
    "zone": "outer"
  },
  {
    "id": "district-บางกะปิ",
    "slug": "บางกะปิ",
    "nameTh": "บางกะปิ",
    "nameEn": "Bang Kapi",
    "labelTh": "เขตบางกะปิ",
    "labelEn": "Bang Kapi District",
    "lat": 13.7651,
    "lng": 100.6477,
    "zone": "outer"
  },
  {
    "id": "district-ปทุมวัน",
    "slug": "ปทุมวัน",
    "nameTh": "ปทุมวัน",
    "nameEn": "Pathum Wan",
    "labelTh": "เขตปทุมวัน",
    "labelEn": "Pathum Wan District",
    "lat": 13.746,
    "lng": 100.534,
    "zone": "inner"
  },
  {
    "id": "district-ป้อมปราบศัตรูพ่าย",
    "slug": "ป้อมปราบศัตรูพ่าย",
    "nameTh": "ป้อมปราบศัตรูพ่าย",
    "nameEn": "Pom Prap Sattru Phai",
    "labelTh": "เขตป้อมปราบศัตรูพ่าย",
    "labelEn": "Pom Prap Sattru Phai District",
    "lat": 13.7584,
    "lng": 100.5137,
    "zone": "outer"
  },
  {
    "id": "district-พระโขนง",
    "slug": "พระโขนง",
    "nameTh": "พระโขนง",
    "nameEn": "Phra Khanong",
    "labelTh": "เขตพระโขนง",
    "labelEn": "Phra Khanong District",
    "lat": 13.705,
    "lng": 100.601,
    "zone": "outer"
  },
  {
    "id": "district-มีนบุรี",
    "slug": "มีนบุรี",
    "nameTh": "มีนบุรี",
    "nameEn": "Min Buri",
    "labelTh": "เขตมีนบุรี",
    "labelEn": "Min Buri District",
    "lat": 13.813,
    "lng": 100.732,
    "zone": "outer"
  },
  {
    "id": "district-ลาดกระบัง",
    "slug": "ลาดกระบัง",
    "nameTh": "ลาดกระบัง",
    "nameEn": "Lat Krabang",
    "labelTh": "เขตลาดกระบัง",
    "labelEn": "Lat Krabang District",
    "lat": 13.723,
    "lng": 100.784,
    "zone": "outer"
  },
  {
    "id": "district-ยานนาวา",
    "slug": "ยานนาวา",
    "nameTh": "ยานนาวา",
    "nameEn": "Yan Nawa",
    "labelTh": "เขตยานนาวา",
    "labelEn": "Yan Nawa District",
    "lat": 13.696,
    "lng": 100.545,
    "zone": "outer"
  },
  {
    "id": "district-สัมพันธวงศ์",
    "slug": "สัมพันธวงศ์",
    "nameTh": "สัมพันธวงศ์",
    "nameEn": "Samphanthawong",
    "labelTh": "เขตสัมพันธวงศ์",
    "labelEn": "Samphanthawong District",
    "lat": 13.735,
    "lng": 100.513,
    "zone": "outer"
  },
  {
    "id": "district-พญาไท",
    "slug": "พญาไท",
    "nameTh": "พญาไท",
    "nameEn": "Phaya Thai",
    "labelTh": "เขตพญาไท",
    "labelEn": "Phaya Thai District",
    "lat": 13.779,
    "lng": 100.544,
    "zone": "outer"
  },
  {
    "id": "district-ธนบุรี",
    "slug": "ธนบุรี",
    "nameTh": "ธนบุรี",
    "nameEn": "Thon Buri",
    "labelTh": "เขตธนบุรี",
    "labelEn": "Thon Buri District",
    "lat": 13.719,
    "lng": 100.485,
    "zone": "outer"
  },
  {
    "id": "district-บางกอกใหญ่",
    "slug": "บางกอกใหญ่",
    "nameTh": "บางกอกใหญ่",
    "nameEn": "Bangkok Yai",
    "labelTh": "เขตบางกอกใหญ่",
    "labelEn": "Bangkok Yai District",
    "lat": 13.708,
    "lng": 100.505,
    "zone": "outer"
  },
  {
    "id": "district-ห้วยขวาง",
    "slug": "ห้วยขวาง",
    "nameTh": "ห้วยขวาง",
    "nameEn": "Huai Khwang",
    "labelTh": "เขตห้วยขวาง",
    "labelEn": "Huai Khwang District",
    "lat": 13.778,
    "lng": 100.579,
    "zone": "outer"
  },
  {
    "id": "district-คลองสาน",
    "slug": "คลองสาน",
    "nameTh": "คลองสาน",
    "nameEn": "Khlong San",
    "labelTh": "เขตคลองสาน",
    "labelEn": "Khlong San District",
    "lat": 13.731,
    "lng": 100.509,
    "zone": "outer"
  },
  {
    "id": "district-ตลิ่งชัน",
    "slug": "ตลิ่งชัน",
    "nameTh": "ตลิ่งชัน",
    "nameEn": "Taling Chan",
    "labelTh": "เขตตลิ่งชัน",
    "labelEn": "Taling Chan District",
    "lat": 13.776,
    "lng": 100.456,
    "zone": "outer"
  },
  {
    "id": "district-บางกอกน้อย",
    "slug": "บางกอกน้อย",
    "nameTh": "บางกอกน้อย",
    "nameEn": "บางกอกน้อย",
    "labelTh": "เขตบางกอกน้อย",
    "labelEn": "บางกอกน้อย District",
    "lat": 13.79,
    "lng": 100.54,
    "zone": "outer"
  },
  {
    "id": "district-บางขุนเทียน",
    "slug": "บางขุนเทียน",
    "nameTh": "บางขุนเทียน",
    "nameEn": "Bang Khun Thian",
    "labelTh": "เขตบางขุนเทียน",
    "labelEn": "Bang Khun Thian District",
    "lat": 13.623,
    "lng": 100.435,
    "zone": "outer"
  },
  {
    "id": "district-ภาษีเจริญ",
    "slug": "ภาษีเจริญ",
    "nameTh": "ภาษีเจริญ",
    "nameEn": "Phasi Charoen",
    "labelTh": "เขตภาษีเจริญ",
    "labelEn": "Phasi Charoen District",
    "lat": 13.705,
    "lng": 100.449,
    "zone": "outer"
  },
  {
    "id": "district-หนองแขม",
    "slug": "หนองแขม",
    "nameTh": "หนองแขม",
    "nameEn": "Nong Khaem",
    "labelTh": "เขตหนองแขม",
    "labelEn": "Nong Khaem District",
    "lat": 13.708,
    "lng": 100.345,
    "zone": "outer"
  },
  {
    "id": "district-ราษฎร์บูรณะ",
    "slug": "ราษฎร์บูรณะ",
    "nameTh": "ราษฎร์บูรณะ",
    "nameEn": "Rat Burana",
    "labelTh": "เขตราษฎร์บูรณะ",
    "labelEn": "Rat Burana District",
    "lat": 13.682,
    "lng": 100.505,
    "zone": "outer"
  },
  {
    "id": "district-บางพลัด",
    "slug": "บางพลัด",
    "nameTh": "บางพลัด",
    "nameEn": "Bang Phlat",
    "labelTh": "เขตบางพลัด",
    "labelEn": "Bang Phlat District",
    "lat": 13.792,
    "lng": 100.475,
    "zone": "outer"
  },
  {
    "id": "district-ดินแดง",
    "slug": "ดินแดง",
    "nameTh": "ดินแดง",
    "nameEn": "Din Daeng",
    "labelTh": "เขตดินแดง",
    "labelEn": "Din Daeng District",
    "lat": 13.769,
    "lng": 100.552,
    "zone": "outer"
  },
  {
    "id": "district-บึงกุ่ม",
    "slug": "บึงกุ่ม",
    "nameTh": "บึงกุ่ม",
    "nameEn": "Bueng Kum",
    "labelTh": "เขตบึงกุ่ม",
    "labelEn": "Bueng Kum District",
    "lat": 13.785,
    "lng": 100.669,
    "zone": "outer"
  },
  {
    "id": "district-สาทร",
    "slug": "สาทร",
    "nameTh": "สาทร",
    "nameEn": "Sathon",
    "labelTh": "เขตสาทร",
    "labelEn": "Sathon District",
    "lat": 13.72,
    "lng": 100.528,
    "zone": "central"
  },
  {
    "id": "district-บางซื่อ",
    "slug": "บางซื่อ",
    "nameTh": "บางซื่อ",
    "nameEn": "Bang Sue",
    "labelTh": "เขตบางซื่อ",
    "labelEn": "Bang Sue District",
    "lat": 13.812,
    "lng": 100.537,
    "zone": "outer"
  },
  {
    "id": "district-จตุจักร",
    "slug": "จตุจักร",
    "nameTh": "จตุจักร",
    "nameEn": "Chatuchak",
    "labelTh": "เขตจตุจักร",
    "labelEn": "Chatuchak District",
    "lat": 13.803,
    "lng": 100.549,
    "zone": "central"
  },
  {
    "id": "district-บางคอแหลม",
    "slug": "บางคอแหลม",
    "nameTh": "บางคอแหลม",
    "nameEn": "บางคอแหลม",
    "labelTh": "เขตบางคอแหลม",
    "labelEn": "บางคอแหลม District",
    "lat": 13.766,
    "lng": 100.516,
    "zone": "outer"
  },
  {
    "id": "district-ประเวศ",
    "slug": "ประเวศ",
    "nameTh": "ประเวศ",
    "nameEn": "Prawet",
    "labelTh": "เขตประเวศ",
    "labelEn": "Prawet District",
    "lat": 13.715,
    "lng": 100.692,
    "zone": "outer"
  },
  {
    "id": "district-คลองเตย",
    "slug": "คลองเตย",
    "nameTh": "คลองเตย",
    "nameEn": "Khlong Toei",
    "labelTh": "เขตคลองเตย",
    "labelEn": "Khlong Toei District",
    "lat": 13.722,
    "lng": 100.554,
    "zone": "central"
  },
  {
    "id": "district-สวนหลวง",
    "slug": "สวนหลวง",
    "nameTh": "สวนหลวง",
    "nameEn": "Suan Luang",
    "labelTh": "เขตสวนหลวง",
    "labelEn": "Suan Luang District",
    "lat": 13.723,
    "lng": 100.651,
    "zone": "outer"
  },
  {
    "id": "district-จอมทอง",
    "slug": "จอมทอง",
    "nameTh": "จอมทอง",
    "nameEn": "Chom Thong",
    "labelTh": "เขตจอมทอง",
    "labelEn": "Chom Thong District",
    "lat": 13.676,
    "lng": 100.485,
    "zone": "outer"
  },
  {
    "id": "district-ดอนเมือง",
    "slug": "ดอนเมือง",
    "nameTh": "ดอนเมือง",
    "nameEn": "Don Mueang",
    "labelTh": "เขตดอนเมือง",
    "labelEn": "Don Mueang District",
    "lat": 13.913,
    "lng": 100.607,
    "zone": "outer"
  },
  {
    "id": "district-ราชเทวี",
    "slug": "ราชเทวี",
    "nameTh": "ราชเทวี",
    "nameEn": "Ratchathewi",
    "labelTh": "เขตราชเทวี",
    "labelEn": "Ratchathewi District",
    "lat": 13.752,
    "lng": 100.531,
    "zone": "outer"
  },
  {
    "id": "district-ลาดพร้าว",
    "slug": "ลาดพร้าว",
    "nameTh": "ลาดพร้าว",
    "nameEn": "Lat Phrao",
    "labelTh": "เขตลาดพร้าว",
    "labelEn": "Lat Phrao District",
    "lat": 13.816,
    "lng": 100.603,
    "zone": "outer"
  },
  {
    "id": "district-วัฒนา",
    "slug": "วัฒนา",
    "nameTh": "วัฒนา",
    "nameEn": "Watthana",
    "labelTh": "เขตวัฒนา",
    "labelEn": "Watthana District",
    "lat": 13.737,
    "lng": 100.56,
    "zone": "central"
  },
  {
    "id": "district-บางแค",
    "slug": "บางแค",
    "nameTh": "บางแค",
    "nameEn": "Bang Khae",
    "labelTh": "เขตบางแค",
    "labelEn": "Bang Khae District",
    "lat": 13.696,
    "lng": 100.408,
    "zone": "outer"
  },
  {
    "id": "district-หลักสี่",
    "slug": "หลักสี่",
    "nameTh": "หลักสี่",
    "nameEn": "หลักสี่",
    "labelTh": "เขตหลักสี่",
    "labelEn": "หลักสี่ District",
    "lat": 13.79,
    "lng": 100.54,
    "zone": "outer"
  },
  {
    "id": "district-สายไหม",
    "slug": "สายไหม",
    "nameTh": "สายไหม",
    "nameEn": "Sai Mai",
    "labelTh": "เขตสายไหม",
    "labelEn": "Sai Mai District",
    "lat": 13.896,
    "lng": 100.652,
    "zone": "outer"
  },
  {
    "id": "district-คันนายาว",
    "slug": "คันนายาว",
    "nameTh": "คันนายาว",
    "nameEn": "Khan Na Yao",
    "labelTh": "เขตคันนายาว",
    "labelEn": "Khan Na Yao District",
    "lat": 13.763,
    "lng": 100.645,
    "zone": "outer"
  },
  {
    "id": "district-สะพานสูง",
    "slug": "สะพานสูง",
    "nameTh": "สะพานสูง",
    "nameEn": "Saphan Sung",
    "labelTh": "เขตสะพานสูง",
    "labelEn": "Saphan Sung District",
    "lat": 13.769,
    "lng": 100.684,
    "zone": "outer"
  },
  {
    "id": "district-วังทองหลาง",
    "slug": "วังทองหลาง",
    "nameTh": "วังทองหลาง",
    "nameEn": "Wang Thonglang",
    "labelTh": "เขตวังทองหลาง",
    "labelEn": "Wang Thonglang District",
    "lat": 13.779,
    "lng": 100.609,
    "zone": "outer"
  },
  {
    "id": "district-คลองสามวา",
    "slug": "คลองสามวา",
    "nameTh": "คลองสามวา",
    "nameEn": "Khlong Sam Wa",
    "labelTh": "เขตคลองสามวา",
    "labelEn": "Khlong Sam Wa District",
    "lat": 13.863,
    "lng": 100.704,
    "zone": "outer"
  },
  {
    "id": "district-บางนา",
    "slug": "บางนา",
    "nameTh": "บางนา",
    "nameEn": "Bang Na",
    "labelTh": "เขตบางนา",
    "labelEn": "Bang Na District",
    "lat": 13.668,
    "lng": 100.604,
    "zone": "outer"
  },
  {
    "id": "district-ทวีวัฒนา",
    "slug": "ทวีวัฒนา",
    "nameTh": "ทวีวัฒนา",
    "nameEn": "Thawi Watthana",
    "labelTh": "เขตทวีวัฒนา",
    "labelEn": "Thawi Watthana District",
    "lat": 13.789,
    "lng": 100.363,
    "zone": "outer"
  },
  {
    "id": "district-ทุ่งครุ",
    "slug": "ทุ่งครุ",
    "nameTh": "ทุ่งครุ",
    "nameEn": "Thung Khru",
    "labelTh": "เขตทุ่งครุ",
    "labelEn": "Thung Khru District",
    "lat": 13.624,
    "lng": 100.505,
    "zone": "outer"
  },
  {
    "id": "district-บางบอน",
    "slug": "บางบอน",
    "nameTh": "บางบอน",
    "nameEn": "Bang Bon",
    "labelTh": "เขตบางบอน",
    "labelEn": "Bang Bon District",
    "lat": 13.661,
    "lng": 100.395,
    "zone": "outer"
  }
] as BangkokDistrict[];

export const DISTRICT_ZONE_LABELS: Record<DistrictZone, { th: string; en: string }> = {
  inner: { th: "ใจกลางกรุงเทพฯ", en: "Inner Bangkok" },
  central: { th: "ย่านชั้นใน", en: "Central Bangkok" },
  outer: { th: "ปริมณฑล / ชานเมือง", en: "Outer Bangkok" },
};
