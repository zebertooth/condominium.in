export const BTS_LOCATIONS: Record<string, { lat: number; lng: number; label: string }> = {
  อโศก: { lat: 13.7373, lng: 100.5603, label: "BTS อโศก" },
  เอกมัย: { lat: 13.7191, lng: 100.5851, label: "BTS เอกมัย" },
  ทองหล่อ: { lat: 13.7242, lng: 100.5781, label: "BTS ทองหล่อ" },
  สุรศักดิ์: { lat: 13.7195, lng: 100.5214, label: "BTS สุรศักดิ์" },
  พญาไท: { lat: 13.7569, lng: 100.5341, label: "BTS พญาไท" },
  ราชเทวี: { lat: 13.7519, lng: 100.5312, label: "BTS ราชเทวี" },
  พร้อมพงษ์: { lat: 13.7305, lng: 100.5695, label: "BTS พร้อมพงษ์" },
  นานา: { lat: 13.7406, lng: 100.5526, label: "BTS นานา" },
  ชิดลม: { lat: 13.7440, lng: 100.5430, label: "BTS ชิดลม" },
  อารีย์: { lat: 13.7797, lng: 100.5447, label: "BTS อารีย์" },
  สยาม: { lat: 13.7457, lng: 100.5340, label: "BTS สยาม" },
};

export function getOsmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
