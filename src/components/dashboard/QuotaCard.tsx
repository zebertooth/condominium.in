import type { UserQuota } from "@/lib/quota";

export function QuotaCard({ quota }: { quota: UserQuota }) {
  if (quota.unlimited) {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="font-bold text-violet-900">โควตาประกาศของคุณ</h2>
        <p className="mt-3 text-violet-800">
          บัญชีแอดมิน — ลงประกาศได้ <span className="font-bold">ไม่จำกัด</span> (ใช้แล้ว {quota.used} รายการ)
        </p>
      </div>
    );
  }

  if (quota.role === "agent") {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">โควตาประกาศของเอเจนต์</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-sky-800">{quota.used}</p>
            <p className="text-sm text-sky-700">ใช้แล้ว</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{quota.maxAllowed}</p>
            <p className="text-sm text-slate-600">สูงสุด</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-sky-800">{quota.remaining}</p>
            <p className="text-sm text-sky-700">เหลือ</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-sky-800">
          โควตาเอเจนต์กำหนดโดยแอดมิน — หากต้องการเพิ่ม กรุณาติดต่อแอดมิน
        </p>
      </div>
    );
  }

  if (quota.postingBlocked) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">โควตาประกาศ</h2>
        <p className="mt-3 text-sky-800">
          บัญชีชาวต่างชาติยังลงประกาศไม่ได้ในช่วงนี้ — ยืนยันอีเมลเพื่อใช้งานเว็บไซต์และติดต่อทีมเอเจนต์
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">โควตาประกาศของคุณ</h2>

      {!quota.fullyVerified ? (
        <p className="mt-3 text-amber-700">
          ยืนยัน LINE และอีเมลก่อน เพื่อลงประกาศได้ {quota.freeLimit} รายการฟรี
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-teal-50 p-4 text-center">
            <p className="text-2xl font-bold text-teal-800">{quota.used}</p>
            <p className="text-sm text-teal-700">ใช้แล้ว</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{quota.maxAllowed}</p>
            <p className="text-sm text-slate-600">สูงสุด</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-4 text-center">
            <p className="text-2xl font-bold text-violet-800">{quota.remaining}</p>
            <p className="text-sm text-violet-700">เหลือ</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-slate-600">
        <p>
          ฟรี: {quota.freeLimit} ประกาศ
          {quota.canBuyPackages && ` · แพ็กเพิ่ม: +${quota.extraSlots} ประกาศ`}
        </p>
        {quota.canBuyPackages && quota.activePackages.length > 0 && (
          <ul className="mt-2 space-y-1">
            {quota.activePackages.map((p) => (
              <li key={p.id}>
                แพ็ก {p.packageId} (+{p.extraSlots}) หมดอายุ{" "}
                {new Date(p.expiresAt).toLocaleDateString("th-TH")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
