/**
 * Phase 15 local smoke — run while `npm run dev` is on :3000
 */
const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  { method: "GET", path: "/api/health", expect: [200], bodyIncludes: ["ok", "status"] },
  { method: "GET", path: "/districts", expect: [200], bodyIncludes: ["50 เขต", "ประกาศ", "แผนที่"] },
  { method: "GET", path: "/stations", expect: [200], bodyIncludes: ["สถานี", "แผนที่", "ประกาศ"] },
  { method: "GET", path: "/rent/district/วัฒนา", expect: [200], bodyIncludes: ["วัฒนา"] },
  { method: "GET", path: "/buy/district/สาทร", expect: [200], bodyIncludes: ["สาทร"] },
  { method: "GET", path: "/map?district=วัฒนา&type=rent", expect: [200], bodyIncludes: ["แผนที่", "วัฒนา"] },
  { method: "GET", path: "/map?bts=อโศก&type=rent", expect: [200], bodyIncludes: ["แผนที่"] },
  { method: "GET", path: "/areas/asoke-bts", expect: [200], bodyIncludes: ["สถานีทั้งหมด", "ค้นหาตามเขต", "แผนที่"] },
  { method: "GET", path: "/areas", expect: [200], bodyIncludes: ["50 เขต", "สถานีรถไฟฟ้า"] },
  { method: "GET", path: "/", expect: [200], bodyIncludes: ["ค้นหาตามพื้นที่", "50 เขตกรุงเทพ"] },
  { method: "GET", path: "/buy", expect: [200], bodyIncludes: ["ตัวกรองขั้นสูง", "ซื้อคอนโด"] },
  { method: "GET", path: "/rent?district=ปทุมวัน", expect: [200], bodyIncludes: ["ปทุมวัน"] },
];

const aiQueries = [
  { query: "คอนโดเช่า 2 ห้องนอน ใกล้ BTS อโศก งบ 30000", label: "station rules" },
  { query: "ซื้อคอนโดเขตวัฒนา งบ 5 ล้าน", label: "district rules" },
];

let passed = 0;
let failed = 0;

async function checkRoute(r) {
  try {
    const res = await fetch(base + r.path, { redirect: "manual" });
    const okStatus = r.expect.includes(res.status);
    const text = okStatus ? await res.text() : "";
    const okBody =
      !r.bodyIncludes || r.bodyIncludes.every((s) => text.includes(s));
    const ok = okStatus && okBody;
    const missing = r.bodyIncludes?.filter((s) => !text.includes(s)) ?? [];
    console.log(
      `${ok ? "PASS" : "FAIL"} ${r.method} ${r.path} -> ${res.status}${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`,
    );
    if (ok) passed++;
    else failed++;
  } catch (e) {
    console.log(`FAIL ${r.method} ${r.path} -> ${e.message}`);
    failed++;
  }
}

for (const r of routes) {
  await checkRoute(r);
}

for (const q of aiQueries) {
  try {
    const res = await fetch(base + "/api/ai-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q.query, listingType: "rent" }),
    });
    const data = await res.json();
    const ok =
      res.status === 200 &&
      typeof data.summary === "string" &&
      Array.isArray(data.properties) &&
      (data.engine === "ai" || data.engine === "rules");
    console.log(
      `${ok ? "PASS" : "FAIL"} POST /api/ai-search [${q.label}] -> ${res.status} engine=${data.engine ?? "?"}`,
    );
    if (ok) passed++;
    else failed++;
  } catch (e) {
    console.log(`FAIL POST /api/ai-search [${q.label}] -> ${e.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
