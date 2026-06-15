export interface CsvProjectRow {
  name: string;
  nameEn?: string;
  developer: string;
  location: string;
  district?: string;
  btsStation?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  amenities?: string;
  totalUnits?: number;
  completionDate?: string;
  published?: boolean;
  slug?: string;
}

export interface ProjectImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

export function validateAndParseProjectRow(
  headers: string[],
  values: string[],
  rowNum: number,
): { data?: CsvProjectRow; error?: string } {
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    obj[h] = values[i] || "";
  });

  const name = obj.name?.trim();
  if (!name) return { error: `Row ${rowNum}: Missing name` };

  const developer = obj.developer?.trim();
  if (!developer) return { error: `Row ${rowNum}: Missing developer` };

  const location = obj.location?.trim();
  if (!location) return { error: `Row ${rowNum}: Missing location` };

  const totalUnitsRaw = obj.totalunits?.trim();
  const totalUnits = totalUnitsRaw ? parseInt(totalUnitsRaw, 10) : undefined;
  if (totalUnitsRaw && (isNaN(totalUnits!) || totalUnits! <= 0)) {
    return { error: `Row ${rowNum}: Invalid totalUnits "${totalUnitsRaw}"` };
  }

  const publishedRaw = obj.published?.trim().toLowerCase();
  let published: boolean | undefined;
  if (publishedRaw) {
    if (["true", "1", "yes", "y"].includes(publishedRaw)) published = true;
    else if (["false", "0", "no", "n"].includes(publishedRaw)) published = false;
    else return { error: `Row ${rowNum}: Invalid published "${obj.published}" (use true/false)` };
  }

  const completionDate = obj.completiondate?.trim();
  if (completionDate && !/^\d{4}-\d{2}-\d{2}$/.test(completionDate)) {
    return { error: `Row ${rowNum}: completionDate must be YYYY-MM-DD` };
  }

  return {
    data: {
      name,
      nameEn: obj.nameen?.trim() || undefined,
      developer,
      location,
      district: obj.district?.trim() || undefined,
      btsStation: obj.btsstation?.trim() || undefined,
      description: obj.description?.trim() || undefined,
      descriptionEn: obj.descriptionen?.trim() || undefined,
      imageUrl: obj.imageurl?.trim() || undefined,
      amenities: obj.amenities?.trim() || undefined,
      totalUnits,
      completionDate: completionDate || undefined,
      published,
      slug: obj.slug?.trim() || undefined,
    },
  };
}

export function generateSampleProjectCsv(): string {
  const headers = [
    "name",
    "nameEn",
    "developer",
    "location",
    "district",
    "btsStation",
    "description",
    "descriptionEn",
    "imageUrl",
    "amenities",
    "totalUnits",
    "completionDate",
    "published",
    "slug",
  ];

  const sampleRow = [
    "Life Sathorn-Silom",
    "Life Sathorn-Silom",
    "AP Thailand",
    "สาทร กรุงเทพฯ",
    "สาทร",
    "สุรศักดิ์",
    "คอนโดหรูใจกลางสาทร ใกล้ BTS สุรศักดิ์",
    "Luxury condo in Sathorn near BTS Surasak",
    "https://images.unsplash.com/photo-1545324418-cc403a4ad993?w=800&q=80",
    "สระว่ายน้ำ,ฟิตเนส,Sky Lounge",
    "800",
    "2018-06-01",
    "true",
    "life-sathorn-silom",
  ];

  return `${headers.join(",")}\n${sampleRow.join(",")}`;
}
