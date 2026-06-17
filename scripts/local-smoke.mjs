/**
 * Quick local smoke test — run while `npm run dev` is up on :3000
 * Usage: node scripts/local-smoke.mjs
 */
const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  { method: "GET", path: "/", expect: [200] },
  { method: "GET", path: "/buy", expect: [200] },
  { method: "GET", path: "/rent", expect: [200] },
  { method: "GET", path: "/compare", expect: [200] },
  { method: "GET", path: "/map", expect: [200] },
  { method: "GET", path: "/login", expect: [200] },
  { method: "GET", path: "/dashboard", expect: [200, 307, 308] },
  { method: "GET", path: "/admin", expect: [200, 307, 308] },
  { method: "GET", path: "/api/health", expect: [200] },
  { method: "GET", path: "/api/compare?slugs=rhythm-sathorn-rent,life-sathorn-silom-sale", expect: [200] },
  { method: "POST", path: "/api/packages/purchase", body: "{}", expect: [401, 403] },
];

let passed = 0;
let failed = 0;

for (const r of routes) {
  try {
    const res = await fetch(base + r.path, {
      method: r.method,
      headers: r.method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: r.body,
      redirect: "manual",
    });
    const ok = r.expect.includes(res.status);
    const tag = ok ? "PASS" : "FAIL";
    console.log(`${tag} ${r.method} ${r.path} -> ${res.status}`);
    if (ok) passed++;
    else failed++;
  } catch (err) {
    console.log(`FAIL ${r.method} ${r.path} -> ${err.message}`);
    failed++;
  }
}

if (failed === 0) {
  console.log(`\nAll ${passed} checks passed (${base})`);
  process.exit(0);
} else {
  console.log(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}
