import type { PropertyType, ListingType } from "@/types/property";

export interface CsvPropertyRow {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  highlights?: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  priceUnit: "THB" | "THB/month";
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  landSqWah?: number;
  floor?: number;
  district: string;
  districtEn?: string;
  btsStation?: string;
  btsLine?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  npaBank?: string;
  npaReferenceUrl?: string;
  projectSlug?: string;
  furnishing?: string;
  features?: string;
  images?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

const PROPERTY_TYPES = ["condo", "apartment", "house", "townhouse", "land", "commercial", "npa"];
const LISTING_TYPES = ["sale", "rent"];

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsv(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ""));
  const rows = lines.slice(1).map(parseCsvLine);

  return { headers, rows };
}

export function validateAndParseRow(
  headers: string[],
  values: string[],
  rowNum: number,
): { data?: CsvPropertyRow; error?: string } {
  if (values.length !== headers.length) {
    return {
      error: `Row ${rowNum}: Expected ${headers.length} columns, found ${values.length}. Quote fields that contain commas (especially features).`,
    };
  }

  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    obj[h] = values[i] || "";
  });

  const title = obj.title?.trim();
  if (!title) return { error: `Row ${rowNum}: Missing title` };

  const description = obj.description?.trim();
  if (!description) return { error: `Row ${rowNum}: Missing description` };

  const listingType = obj.listingtype?.toLowerCase() as ListingType;
  if (!LISTING_TYPES.includes(listingType)) {
    return { error: `Row ${rowNum}: Invalid listingType "${obj.listingtype}" (must be sale or rent)` };
  }

  const propertyType = obj.propertytype?.toLowerCase() as PropertyType;
  if (!PROPERTY_TYPES.includes(propertyType)) {
    return { error: `Row ${rowNum}: Invalid propertyType "${obj.propertytype}"` };
  }

  const price = parseInt(obj.price, 10);
  if (isNaN(price) || price <= 0) {
    return { error: `Row ${rowNum}: Invalid price "${obj.price}"` };
  }

  const priceUnit = listingType === "rent" ? "THB/month" : "THB";

  const bedrooms = parseInt(obj.bedrooms || "0", 10);
  const bathrooms = parseInt(obj.bathrooms || "1", 10);
  const areaSqm = parseFloat(obj.areasqm || "0");

  if (areaSqm <= 0 && propertyType !== "land") {
    return { error: `Row ${rowNum}: Invalid areaSqm "${obj.areasqm}"` };
  }

  const district = obj.district?.trim();
  if (!district) return { error: `Row ${rowNum}: Missing district` };

  const address = obj.address?.trim() || district;

  const data: CsvPropertyRow = {
    title,
    titleEn: obj.titleen?.trim() || undefined,
    description,
    descriptionEn: obj.descriptionen?.trim() || undefined,
    highlights: obj.highlights?.trim() || undefined,
    listingType,
    propertyType,
    price,
    priceUnit,
    bedrooms,
    bathrooms,
    areaSqm,
    landSqWah: obj.landsqwah ? parseFloat(obj.landsqwah) : undefined,
    floor: obj.floor ? parseInt(obj.floor, 10) : undefined,
    district,
    districtEn: obj.districten?.trim() || undefined,
    btsStation: obj.btsstation?.trim() || undefined,
    btsLine: obj.btsline?.trim() || undefined,
    address,
    latitude: obj.latitude ? parseFloat(obj.latitude) : undefined,
    longitude: obj.longitude ? parseFloat(obj.longitude) : undefined,
    npaBank: obj.npabank?.trim() || undefined,
    npaReferenceUrl: obj.npareferenceurl?.trim() || undefined,
    projectSlug: obj.projectslug?.trim() || undefined,
    furnishing: obj.furnishing?.trim() || undefined,
    features: obj.features?.trim() || undefined,
    images: obj.images?.trim() || undefined,
  };

  return { data };
}

export function generateSampleCsv(): string {
  const headers = [
    "title",
    "titleEn",
    "description",
    "descriptionEn",
    "highlights",
    "listingType",
    "propertyType",
    "price",
    "bedrooms",
    "bathrooms",
    "areaSqm",
    "landSqWah",
    "floor",
    "district",
    "districtEn",
    "btsStation",
    "btsLine",
    "address",
    "latitude",
    "longitude",
    "npaBank",
    "npaReferenceUrl",
    "projectSlug",
    "furnishing",
    "features",
    "images",
  ];

  const sampleRow = [
    "คอนโด 2 ห้องนอน อโศก",
    "2BR Condo Asoke",
    "คอนโดสวย ใกล้ BTS อโศก พร้อมเฟอร์นิเจอร์ครบ",
    "Beautiful condo near BTS Asoke, fully furnished",
    "ใกล้ BTS 100 เมตร, ใกล้ Emporium",
    "rent",
    "condo",
    "35000",
    "2",
    "2",
    "65",
    "",
    "25",
    "วัฒนา",
    "Watthana",
    "อโศก",
    "สุขุมวิท",
    "สุขุมวิท 21 วัฒนา กรุงเทพ",
    "13.7367",
    "100.5608",
    "",
    "",
    "life-sathorn-silom",
    "furnished",
    "สระว่ายน้ำ,ฟิตเนส,ที่จอดรถ",
    "https://example.com/img1.jpg,https://example.com/img2.jpg",
  ];

  return `${headers.join(",")}\n${sampleRow.join(",")}\n${[
    "คอนโด NPA กสิกร สาทร",
    "KBank NPA Condo Sathorn",
    "ทรัพย์ NPA ธนาคารกสิกรไทย ใกล้ BTS สุรศักดิ์",
    "KBank foreclosed condo near BTS Surasak",
    "ขายด่วน ราคาพิเศษ",
    "sale",
    "npa",
    "4200000",
    "1",
    "1",
    "42",
    "",
    "18",
    "สาทร",
    "Sathorn",
    "สุรศักดิ์",
    "สีลม",
    "สาทร กรุงเทพฯ",
    "13.7194",
    "100.5212",
    "กสิกรไทย",
    "https://example.com/npa-listing",
    "",
    "https://example.com/npa1.jpg",
  ].join(",")}`;
}
