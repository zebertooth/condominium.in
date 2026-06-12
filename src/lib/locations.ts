export type StationCategory = "bts" | "mrt" | "train" | "airport";

export interface NearbyStation {
  id: string;
  name: string;
  category: StationCategory;
  lat: number;
  lng: number;
  label: string;
}

function station(
  id: string,
  prefix: string,
  name: string,
  category: StationCategory,
  lat: number,
  lng: number,
): NearbyStation {
  return { id, name, category, lat, lng, label: `${prefix} ${name}` };
}

/** Bangkok BTS, MRT, mainline rail, and airport stations for listing location. */
export const NEARBY_STATIONS: NearbyStation[] = [
  station("bts-asok", "BTS", "อโศก", "bts", 13.7373, 100.5603),
  station("bts-ekkamai", "BTS", "เอกมัย", "bts", 13.7191, 100.5851),
  station("bts-thonglor", "BTS", "ทองหล่อ", "bts", 13.7242, 100.5781),
  station("bts-phromphong", "BTS", "พร้อมพงษ์", "bts", 13.7305, 100.5695),
  station("bts-nana", "BTS", "นานา", "bts", 13.7406, 100.5526),
  station("bts-chidlom", "BTS", "ชิดลม", "bts", 13.744, 100.543),
  station("bts-siam", "BTS", "สยาม", "bts", 13.7457, 100.534),
  station("bts-ari", "BTS", "อารีย์", "bts", 13.7797, 100.5447),
  station("bts-phayathai", "BTS", "พญาไท", "bts", 13.7569, 100.5341),
  station("bts-ratchathewi", "BTS", "ราชเทวี", "bts", 13.7519, 100.5312),
  station("bts-surasak", "BTS", "สุรศักดิ์", "bts", 13.7195, 100.5214),
  station("bts-onnut", "BTS", "อ่อนนุช", "bts", 13.7056, 100.601),
  station("bts-bangchak", "BTS", "บางจาก", "bts", 13.6967, 100.6053),
  station("bts-bearing", "BTS", "แบริ่ง", "bts", 13.6686, 100.6042),
  station("mrt-sukhumvit", "MRT", "สุขุมวิท", "mrt", 13.738, 100.5615),
  station("mrt-silom", "MRT", "สีลม", "mrt", 13.729, 100.534),
  station("mrt-lumphini", "MRT", "ลุมพินี", "mrt", 13.7255, 100.5415),
  station("mrt-khlongtoey", "MRT", "คลองเตย", "mrt", 13.722, 100.554),
  station("mrt-qsncc", "MRT", "ศูนย์การประชุม", "mrt", 13.723, 100.559),
  station("mrt-samyan", "MRT", "สามย่าน", "mrt", 13.7199, 100.53),
  station("mrt-hualamphong", "MRT", "หัวลำโพง", "mrt", 13.7375, 100.517),
  station("mrt-phra-khanong", "MRT", "พระโขนง", "mrt", 13.696, 100.601),
  station("mrt-bangna", "MRT", "บางนา", "mrt", 13.646, 100.599),
  station("mrt-bang-sue", "MRT", "บางซื่อ", "mrt", 13.803, 100.539),
  station("mrt-chatuchak", "MRT", "จตุจักร", "mrt", 13.8028, 100.5534),
  station("mrt-thailand-culture", "MRT", "วัฒนธรรมไทย", "mrt", 13.7799, 100.5704),
  station("mrt-tao-poon", "MRT", "เตาปูน", "mrt", 13.806, 100.5307),
  station("mrt-tha-phra", "MRT", "ท่าพระ", "mrt", 13.693, 100.485),
  station("train-hualamphong", "รถไฟ", "หัวลำโพง", "train", 13.7378, 100.5164),
  station("train-bangsue", "รถไฟ", "บางซื่อ", "train", 13.812, 100.537),
  station("train-donmuang", "รถไฟ", "ดอนเมือง", "train", 13.9126, 100.6067),
  station("airport-suv", "สนามบิน", "สุวรรณภูมิ", "airport", 13.698, 100.752),
  station("airport-dmk", "สนามบิน", "ดอนเมือง", "airport", 13.9126, 100.6067),
  station("airport-makkasan", "Airport Rail Link", "มักกะสัน", "airport", 13.745, 100.562),
];

/** @deprecated use NEARBY_STATIONS */
export const BTS_LOCATIONS: Record<string, { lat: number; lng: number; label: string }> =
  Object.fromEntries(
    NEARBY_STATIONS.filter((s) => s.category === "bts").map((s) => [
      s.name,
      { lat: s.lat, lng: s.lng, label: s.label },
    ]),
  );

export const STATION_CATEGORY_ORDER: StationCategory[] = ["bts", "mrt", "train", "airport"];

export function stationsByCategory(category: StationCategory): NearbyStation[] {
  return NEARBY_STATIONS.filter((s) => s.category === category);
}

export function getStationById(id: string): NearbyStation | undefined {
  return NEARBY_STATIONS.find((s) => s.id === id);
}

export function findStationId(value?: string | null): string {
  if (!value) return "";
  const exact = NEARBY_STATIONS.find(
    (s) => s.id === value || s.label === value || s.name === value,
  );
  if (exact) return exact.id;
  const legacy = NEARBY_STATIONS.find((s) => s.name === value);
  return legacy?.id ?? "";
}

export function getStationCoords(
  stationIdOrLabel: string,
): { lat: number; lng: number } | null {
  const match = getStationById(stationIdOrLabel);
  if (match) return { lat: match.lat, lng: match.lng };
  const byLabel = NEARBY_STATIONS.find(
    (s) => s.label === stationIdOrLabel || s.name === stationIdOrLabel,
  );
  if (byLabel) return { lat: byLabel.lat, lng: byLabel.lng };
  const legacy = BTS_LOCATIONS[stationIdOrLabel];
  return legacy ? { lat: legacy.lat, lng: legacy.lng } : null;
}

/** Display label for property cards — supports legacy values stored as Thai name only. */
export function formatNearbyStation(station?: string | null): string {
  if (!station) return "";
  if (/^(BTS|MRT|รถไฟ|สนามบิน|Airport Rail Link)/i.test(station)) return station;
  const match = NEARBY_STATIONS.find((s) => s.name === station);
  return match?.label ?? `BTS ${station}`;
}

export function getOsmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export const DEFAULT_MAP_CENTER = { lat: 13.7563, lng: 100.5018 };
