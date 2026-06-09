import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
        ไม่พบประกาศที่ตรงเงื่อนไข ลองใช้{" "}
        <a href="/ai-search" className="font-medium text-teal-700 underline">
          ค้นหาด้วย AI
        </a>{" "}
        หรือติดต่อทีมเอเจนต์
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
