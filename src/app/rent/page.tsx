import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertySearch } from "@/components/property/PropertySearch";
import { createMetadata } from "@/lib/seo";
import { filterListings } from "@/lib/listings";

export const metadata = createMetadata({
  title: "เช่าคอนโดกรุงเทพ ใกล้ BTS | Condominium.in.th",
  description:
    "รวมประกาศเช่าคอนโดในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI หาทรัพย์ที่ตรงงบ นัดชมจริงกับทีมเอเจนต์",
  path: "/rent",
  keywords: ["เช่าคอนโด", "เช่าคอนโดกรุงเทพ", "คอนโดใกล้ BTS"],
});

export default async function RentPage() {
  const listings = await filterListings({ listingType: "rent" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">เช่าคอนโดและบ้าน</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        ประกาศเช่าคอนโดใกล้ BTS ในกรุงเทพฯ AI ช่วยจับคู่ทรัพย์ตามงบ จำนวนห้องนอน และสถานีรถไฟฟ้า
      </p>

      <div className="mt-8 max-w-3xl">
        <PropertySearch defaultType="rent" />
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          ประกาศเช่าทั้งหมด ({listings.length})
        </h2>
        <PropertyGrid properties={listings} />
      </div>
    </div>
  );
}
