/**
 * Bangkok metropolitan rail stations — compiled from
 * https://th.wikipedia.org/wiki/รายชื่อสถานีรถไฟฟ้าในกรุงเทพมหานครและปริมณฑล
 * (BTS, MRT, BRT, Airport Rail Link, SRT Red — Oct 2025 snapshot)
 *
 * Coordinates are approximate (OpenStreetMap / operator maps).
 */

export type TransitLineId =
  | "bts-sukhumvit"
  | "bts-silom"
  | "mrt-blue"
  | "mrt-purple"
  | "mrt-yellow"
  | "gold"
  | "brt"
  | "airport"
  | "srt-red";

export type StationCategory = "bts" | "mrt" | "brt" | "airport" | "train" | "gold";

export interface TransitLine {
  id: TransitLineId;
  category: StationCategory;
  prefix: string;
  nameTh: string;
  nameEn: string;
  color: string;
}

export const TRANSIT_LINES: TransitLine[] = [
  {
    id: "bts-sukhumvit",
    category: "bts",
    prefix: "BTS",
    nameTh: "สายสุขุมวิท",
    nameEn: "Sukhumvit Line",
    color: "#77B257",
  },
  {
    id: "bts-silom",
    category: "bts",
    prefix: "BTS",
    nameTh: "สายสีลม",
    nameEn: "Silom Line",
    color: "#1D7A4B",
  },
  {
    id: "mrt-blue",
    category: "mrt",
    prefix: "MRT",
    nameTh: "สายสีน้ำเงิน",
    nameEn: "Blue Line",
    color: "#1966B3",
  },
  {
    id: "mrt-purple",
    category: "mrt",
    prefix: "MRT",
    nameTh: "สายสีม่วง",
    nameEn: "Purple Line",
    color: "#8A3D9C",
  },
  {
    id: "mrt-yellow",
    category: "mrt",
    prefix: "MRT",
    nameTh: "สายสีเหลือง",
    nameEn: "Yellow Line",
    color: "#FFD400",
  },
  {
    id: "gold",
    category: "gold",
    prefix: "Gold Line",
    nameTh: "สายสีทอง",
    nameEn: "Gold Line",
    color: "#C9A227",
  },
  {
    id: "brt",
    category: "brt",
    prefix: "BRT",
    nameTh: "รถโดยสารด่วนพิเศษ",
    nameEn: "BRT Sathorn–Ratchaphruek",
    color: "#E67E22",
  },
  {
    id: "airport",
    category: "airport",
    prefix: "Airport Rail Link",
    nameTh: "แอร์พอร์ต เรล ลิงก์",
    nameEn: "Airport Rail Link",
    color: "#761F21",
  },
  {
    id: "srt-red",
    category: "train",
    prefix: "SRT",
    nameTh: "สายสีแดง",
    nameEn: "SRT Red Line",
    color: "#E4002B",
  },
];

/** [id, lineId, nameTh, nameEn, lat, lng] */
export const STATION_TUPLES: readonly [string, TransitLineId, string, string, number, number][] = [
  // BTS Sukhumvit (north → south)
  ["bts-mo-chit", "bts-sukhumvit", "หมอชิต", "Mo Chit", 13.8028, 100.5534],
  ["bts-saphan-khwai", "bts-sukhumvit", "สะพานควาย", "Saphan Khwai", 13.7936, 100.5495],
  ["bts-ari", "bts-sukhumvit", "อารีย์", "Ari", 13.7797, 100.5447],
  ["bts-sanam-pao", "bts-sukhumvit", "สนามเปโม", "Sanam Pao", 13.7726, 100.5421],
  ["bts-victory-monument", "bts-sukhumvit", "อนุสาวรีย์ชัยสมรภูมิ", "Victory Monument", 13.7649, 100.5383],
  ["bts-phayathai", "bts-sukhumvit", "พญาไท", "Phaya Thai", 13.7569, 100.5341],
  ["bts-ratchathewi", "bts-sukhumvit", "ราชเทวี", "Ratchathewi", 13.7519, 100.5312],
  ["bts-siam", "bts-sukhumvit", "สยาม", "Siam", 13.7457, 100.534],
  ["bts-chidlom", "bts-sukhumvit", "ชิดลม", "Chit Lom", 13.744, 100.543],
  ["bts-phloen-chit", "bts-sukhumvit", "เพลินจิต", "Phloen Chit", 13.743, 100.548],
  ["bts-nana", "bts-sukhumvit", "นานา", "Nana", 13.7406, 100.5526],
  ["bts-asok", "bts-sukhumvit", "อโศก", "Asok", 13.7373, 100.5603],
  ["bts-phromphong", "bts-sukhumvit", "พร้อมพงษ์", "Phrom Phong", 13.7305, 100.5695],
  ["bts-thonglor", "bts-sukhumvit", "ทองหล่อ", "Thong Lo", 13.7242, 100.5781],
  ["bts-ekkamai", "bts-sukhumvit", "เอกมัย", "Ekkamai", 13.7191, 100.5851],
  ["bts-phra-khanong", "bts-sukhumvit", "พระโขนง", "Phra Khanong", 13.715, 100.591],
  ["bts-onnut", "bts-sukhumvit", "อ่อนนุช", "On Nut", 13.7056, 100.601],
  ["bts-bangchak", "bts-sukhumvit", "บางจาก", "Bang Chak", 13.6967, 100.6053],
  ["bts-punnawithi", "bts-sukhumvit", "ปุณณวิถี", "Punnawithi", 13.689, 100.608],
  ["bts-udom-suk", "bts-sukhumvit", "อุดมสุข", "Udom Suk", 13.679, 100.609],
  ["bts-bangna", "bts-sukhumvit", "บางนา", "Bang Na", 13.668, 100.604],
  ["bts-bearing", "bts-sukhumvit", "แบริ่ง", "Bearing", 13.6686, 100.6042],
  ["bts-samrong", "bts-sukhumvit", "สำโรง", "Samrong", 13.646, 100.596],
  ["bts-pu-chao", "bts-sukhumvit", "ปู่เจ้า", "Pu Chao", 13.637, 100.592],
  ["bts-chang-erawan", "bts-sukhumvit", "ช้างเอราวัณ", "Chang Erawan", 13.621, 100.586],
  ["bts-royal-thai-naval", "bts-sukhumvit", "ราชนาวี", "Royal Thai Naval Academy", 13.608, 100.582],
  ["bts-pak-nam", "bts-sukhumvit", "ปากน้ำ", "Pak Nam", 13.592, 100.578],
  ["bts-srinagarindra", "bts-sukhumvit", "ศรีนครินทร์", "Srinagarindra", 13.576, 100.571],
  ["bts-phraek-sa", "bts-sukhumvit", "แพรกษา", "Phraek Sa", 13.564, 100.565],
  ["bts-sai-luat", "bts-sukhumvit", "สายลวด", "Sai Luad", 13.552, 100.561],
  ["bts-kheha", "bts-sukhumvit", "เคหะ", "Kheha", 13.542, 100.557],

  // BTS Silom
  ["bts-national-stadium", "bts-silom", "สนามกีฬาแห่งชาติ", "National Stadium", 13.746, 100.529],
  ["bts-ratchadamri", "bts-silom", "ราชดำริ", "Ratchadamri", 13.739, 100.534],
  ["bts-sala-daeng", "bts-silom", "ศาลาแดง", "Sala Daeng", 13.728, 100.534],
  ["bts-chong-nonsi", "bts-silom", "ช่องนนทรี", "Chong Nonsi", 13.723, 100.529],
  ["bts-surasak", "bts-silom", "สุรศักดิ์", "Surasak", 13.7195, 100.5214],
  ["bts-saphan-taksin", "bts-silom", "สะพานตากสิน", "Saphan Taksin", 13.718, 100.514],
  ["bts-krung-thon-buri", "bts-silom", "กรุงธนบุรี", "Krung Thon Buri", 13.721, 100.506],
  ["bts-wongwian-yai", "bts-silom", "วงเวียนใหญ่", "Wongwian Yai", 13.721, 100.495],
  ["bts-pho-nimit", "bts-silom", "โพธิ์นิมิต", "Pho Nimit", 13.719, 100.485],
  ["bts-talat-phlu", "bts-silom", "ตลาดพลู", "Talat Phlu", 13.714, 100.476],
  ["bts-wutthakat", "bts-silom", "วุฒากาศ", "Wutthakat", 13.713, 100.468],
  ["bts-bang-wa", "bts-silom", "บางหว้า", "Bang Wa", 13.711, 100.456],

  // MRT Blue Line (key interchange + CBD)
  ["mrt-tha-phra", "mrt-blue", "ท่าพระ", "Tha Phra", 13.693, 100.485],
  ["mrt-charan-13", "mrt-blue", "จรัญฯ 13", "Charan 13", 13.704, 100.478],
  ["mrt-fai-chai", "mrt-blue", "ไฟฉาย", "Fai Chai", 13.712, 100.472],
  ["mrt-bang-khun-non", "mrt-blue", "บางขุนนนท์", "Bang Khun Non", 13.72, 100.465],
  ["mrt-bang-yi-khan", "mrt-blue", "บางยี่ขัน", "Bang Yi Khan", 13.728, 100.458],
  ["mrt-sirindhorn", "mrt-blue", "สิรินธร", "Sirindhorn", 13.735, 100.452],
  ["mrt-bang-phlat", "mrt-blue", "บางพลัด", "Bang Phlat", 13.742, 100.446],
  ["mrt-bang-or", "mrt-blue", "บางอ้อ", "Bang O", 13.748, 100.441],
  ["mrt-bang-pho", "mrt-blue", "บางโพ", "Bang Pho", 13.756, 100.435],
  ["mrt-tao-poon", "mrt-blue", "เตาปูน", "Tao Poon", 13.806, 100.5307],
  ["mrt-bang-sue", "mrt-blue", "บางซื่อ", "Bang Sue", 13.803, 100.539],
  ["mrt-kamphaeng-phet", "mrt-blue", "กำแพงเพชร", "Kamphaeng Phet", 13.798, 100.548],
  ["mrt-chatuchak", "mrt-blue", "จตุจักร", "Chatuchak", 13.8028, 100.5534],
  ["mrt-phahon-yothin", "mrt-blue", "พหลโยธิน", "Phahon Yothin", 13.814, 100.561],
  ["mrt-lat-phrao", "mrt-blue", "ลาดพร้าว", "Lat Phrao", 13.823, 100.567],
  ["mrt-ratchadaphisek", "mrt-blue", "รัชดาภิเษก", "Ratchadaphisek", 13.831, 100.573],
  ["mrt-sutthisan", "mrt-blue", "สุทธิสาร", "Sutthisan", 13.838, 100.579],
  ["mrt-huai-khwang", "mrt-blue", "ห้วยขวาง", "Huai Khwang", 13.845, 100.585],
  ["mrt-thailand-culture", "mrt-blue", "วัฒนธรรมไทย", "Thailand Cultural Centre", 13.7799, 100.5704],
  ["mrt-phra-ram-9", "mrt-blue", "พระราม 9", "Phra Ram 9", 13.758, 100.565],
  ["mrt-phetchaburi", "mrt-blue", "เพชรบุรี", "Phetchaburi", 13.748, 100.563],
  ["mrt-sukhumvit", "mrt-blue", "สุขุมวิท", "Sukhumvit", 13.738, 100.5615],
  ["mrt-qsncc", "mrt-blue", "ศูนย์การประชุม", "Queen Sirikit National Convention Centre", 13.723, 100.559],
  ["mrt-khlongtoey", "mrt-blue", "คลองเตย", "Khlong Toei", 13.722, 100.554],
  ["mrt-lumphini", "mrt-blue", "ลุมพินี", "Lumphini", 13.7255, 100.5415],
  ["mrt-silom", "mrt-blue", "สีลม", "Silom", 13.729, 100.534],
  ["mrt-samyan", "mrt-blue", "สามย่าน", "Sam Yan", 13.7199, 100.53],
  ["mrt-hualamphong", "mrt-blue", "หัวลำโพง", "Hua Lamphong", 13.7375, 100.517],
  ["mrt-wat-mangkon", "mrt-blue", "วัดมังกร", "Wat Mangkon", 13.742, 100.51],
  ["mrt-sam-yot", "mrt-blue", "สามยอด", "Sam Yot", 13.746, 100.504],
  ["mrt-sanam-chai", "mrt-blue", "สนามไชย", "Sanam Chai", 13.744, 100.497],
  ["mrt-itsaraphap", "mrt-blue", "อิสรภาพ", "Itsaraphap", 13.738, 100.489],
  ["mrt-bang-phai", "mrt-blue", "บางไผ่", "Bang Phai", 13.732, 100.482],
  ["mrt-bang-wa-blue", "mrt-blue", "บางหว้า", "Bang Wa", 13.711, 100.456],
  ["mrt-phasi-charoen", "mrt-blue", "ภาษีเจริญ", "Phasi Charoen", 13.705, 100.449],
  ["mrt-lak-song", "mrt-blue", "หลักสอง", "Lak Song", 13.698, 100.442],

  // MRT Purple Line
  ["mrt-tao-poon-purple", "mrt-purple", "เตาปูน", "Tao Poon", 13.806, 100.5307],
  ["mrt-bang-sue-purple", "mrt-purple", "บางซื่อ", "Bang Sue", 13.803, 100.539],
  ["mrt-wong-sawang", "mrt-purple", "วงศ์สว่าง", "Wong Sawang", 13.829, 100.526],
  ["mrt-bang-krasor", "mrt-purple", "บางกระสอ", "Bang Krasor", 13.836, 100.518],
  ["mrt-nonthaburi-civic", "mrt-purple", "ศูนย์ราชการนนทบุรี", "Nonthaburi Civic Center", 13.843, 100.51],
  ["mrt-ministry-public-health", "mrt-purple", "กระทรวงสาธารณสุข", "Ministry of Public Health", 13.851, 100.502],
  ["mrt-yaek-fai-ubon", "mrt-purple", "แยกไฟฉาย", "Yaek Fai Ubon", 13.858, 100.494],
  ["mrt-bang-rak-noi", "mrt-purple", "บางรักน้อย", "Bang Rak Noi", 13.865, 100.486],
  ["mrt-bang-rak-yai", "mrt-purple", "บางรักใหญ่", "Bang Rak Yai", 13.872, 100.478],
  ["mrt-bang-phlat-purple", "mrt-purple", "บางพลัด", "Bang Phlat", 13.879, 100.47],
  ["mrt-isaraphap-purple", "mrt-purple", "อิสรภาพ", "Itsaraphap", 13.738, 100.489],
  ["mrt-fai-chai-purple", "mrt-purple", "ไฟฉาย", "Fai Chai", 13.712, 100.472],
  ["mrt-bang-khun-non-purple", "mrt-purple", "บางขุนนนท์", "Bang Khun Non", 13.72, 100.465],
  ["mrt-khlong-bang-phai", "mrt-purple", "คลองบางไผ่", "Khlong Bang Phai", 13.892, 100.462],
  ["mrt-talad-bang-yai", "mrt-purple", "ตลาดบางใหญ่", "Talad Bang Yai", 13.899, 100.454],
  ["mrt-bang-phlu", "mrt-purple", "บางปลู", "Bang Phlu", 13.906, 100.446],

  // MRT Yellow Line (selected)
  ["mrt-lat-phrao-yellow", "mrt-yellow", "ลาดพร้าว", "Lat Phrao", 13.823, 100.567],
  ["mrt-phawana", "mrt-yellow", "ภาวนา", "Phawana", 13.815, 100.575],
  ["mrt-chok-chai-4", "mrt-yellow", "โชคชัย 4", "Chok Chai 4", 13.807, 100.583],
  ["mrt-lat-phrao-intersection", "mrt-yellow", "ห้าแยกลาดพร้าว", "Lat Phrao Intersection", 13.799, 100.591],
  ["mrt-ratchayothin", "mrt-yellow", "รัชโยธิน", "Ratchayothin", 13.791, 100.599],
  ["mrt-sutthisan-yellow", "mrt-yellow", "สุทธิสาร", "Sutthisan", 13.838, 100.579],
  ["mrt-huai-khwang-yellow", "mrt-yellow", "ห้วยขวาง", "Huai Khwang", 13.845, 100.585],
  ["mrt-thailand-culture-yellow", "mrt-yellow", "วัฒนธรรมไทย", "Thailand Cultural Centre", 13.7799, 100.5704],
  ["mrt-phetchaburi-yellow", "mrt-yellow", "เพชรบุรี", "Phetchaburi", 13.748, 100.563],
  ["mrt-samrong-yellow", "mrt-yellow", "สำโรง", "Samrong", 13.646, 100.596],
  ["mrt-srinagarindra-yellow", "mrt-yellow", "ศรีนวล", "Srinagarindra", 13.576, 100.571],
  ["mrt-si-la-salle", "mrt-yellow", "ศรีลาซัลเล", "Si La Salle", 13.568, 100.568],
  ["mrt-si-iam", "mrt-yellow", "ศรีเอี่ยม", "Si Iam", 13.56, 100.565],
  ["mrt-si-usa", "mrt-yellow", "ศรีอุดม", "Si Usa", 13.552, 100.562],

  // Gold Line
  ["gold-krung-thon-buri", "gold", "กรุงธนบุรี", "Krung Thon Buri", 13.721, 100.506],
  ["gold-charoen-nakhon", "gold", "เจริญนคร", "Charoen Nakhon", 13.718, 100.501],
  ["gold-khlong-san", "gold", "คลองสาน", "Khlong San", 13.715, 100.496],

  // BRT Sathorn–Ratchaphruek
  ["brt-sathorn", "brt", "สาทร", "Sathorn", 13.72, 100.528],
  ["brt-chan", "brt", "จันทน์", "Chan", 13.715, 100.522],
  ["brt-narathiwat", "brt", "นราธิวาส", "Narathiwat", 13.71, 100.516],
  ["brt-rama-3", "brt", "พระราม 3", "Rama III", 13.705, 100.51],
  ["brt-rama-9-bridge", "brt", "สะพานพระราม 9", "Rama IX Bridge", 13.7, 100.504],
  ["brt-thanon-chan", "brt", "ถนนจันทน์", "Thanon Chan", 13.695, 100.498],
  ["brt-techno", "brt", "เทคโน", "Techno", 13.69, 100.492],
  ["brt-thanon-toei", "brt", "ถนนเทอดไท", "Thanon Toei", 13.685, 100.486],
  ["brt-nut", "brt", "นัท", "Nut", 13.68, 100.48],
  ["brt-wat-dan", "brt", "วัดด่าน", "Wat Dan", 13.675, 100.474],
  ["brt-ratchaphruek", "brt", "ราชพฤกษ์", "Ratchaphruek", 13.67, 100.468],

  // Airport Rail Link
  ["airport-phayathai", "airport", "พญาไท", "Phaya Thai", 13.7569, 100.5341],
  ["airport-makkasan", "airport", "มักกะสัน", "Makkasan", 13.745, 100.562],
  ["airport-ramkhamhaeng", "airport", "รามคำแหง", "Ramkhamhaeng", 13.732, 100.598],
  ["airport-hua-mak", "airport", "หัวหมาก", "Hua Mak", 13.718, 100.645],
  ["airport-ban-thap-chang", "airport", "บ้านทับช้าง", "Ban Thap Chang", 13.705, 100.692],
  ["airport-lat-krabang", "airport", "ลาดกระบัง", "Lat Krabang", 13.692, 100.738],
  ["airport-suv", "airport", "สุวรรณภูมิ", "Suvarnabhumi", 13.698, 100.752],
  ["airport-dmk", "airport", "ดอนเมือง", "Don Mueang", 13.9126, 100.6067],

  // SRT Red Line (Bang Sue hub)
  ["srt-bang-sue", "srt-red", "บางซื่อ", "Bang Sue", 13.812, 100.537],
  ["srt-chatuchak", "srt-red", "จตุจักร", "Chatuchak", 13.8028, 100.5534],
  ["srt-donmuang", "srt-red", "ดอนเมือง", "Don Mueang", 13.9126, 100.6067],
  ["srt-rangsit", "srt-red", "รังสิต", "Rangsit", 13.99, 100.601],
  ["srt-laksi", "srt-red", "ลาดกระบัง", "Lak Si", 13.878, 100.578],
  ["srt-taling-chan", "srt-red", "ตลิ่งชัน", "Taling Chan", 13.776, 100.456],
];
