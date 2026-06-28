/** Build a minimal iCalendar (.ics) file for property viewing requests. */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Parse YYYY-MM-DD and optional HH:mm (or Thai-ish time strings). */
function parseViewingParts(date: string, time?: string): { y: number; m: number; d: number; hh: number; mm: number } {
  const [y, m, d] = date.split("-").map((x) => parseInt(x, 10));
  let hh = 10;
  let mm = 0;
  if (time?.trim()) {
    const match = time.match(/(\d{1,2})[:.](\d{2})/);
    if (match) {
      hh = parseInt(match[1], 10);
      mm = parseInt(match[2], 10);
    }
  }
  return { y, m, d, hh, mm };
}

export function buildViewingIcs(opts: {
  uid: string;
  title: string;
  date: string;
  time?: string;
  durationMinutes?: number;
  description?: string;
  location?: string;
  organizerEmail?: string;
}): string {
  const { y, m, d, hh, mm } = parseViewingParts(opts.date, opts.time);
  const duration = opts.durationMinutes ?? 60;

  const startLocal = new Date(y, m - 1, d, hh, mm, 0);
  const endLocal = new Date(startLocal.getTime() + duration * 60_000);

  const fmt = (dt: Date) =>
    `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}T${pad2(dt.getHours())}${pad2(dt.getMinutes())}00`;

  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Condominium.in.th//Viewing//TH",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Bangkok:${fmt(startLocal)}`,
    `DTEND;TZID=Asia/Bangkok:${fmt(endLocal)}`,
    `SUMMARY:${escapeIcs(opts.title)}`,
  ];

  if (opts.description) lines.push(`DESCRIPTION:${escapeIcs(opts.description)}`);
  if (opts.location) lines.push(`LOCATION:${escapeIcs(opts.location)}`);
  if (opts.organizerEmail) {
    lines.push(`ORGANIZER;CN=Condominium.in.th:mailto:${opts.organizerEmail}`);
  }

  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

function googleCalendarDate(dt: Date): string {
  return `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}T${pad2(dt.getHours())}${pad2(dt.getMinutes())}00`;
}

/** Google Calendar "add event" URL for a property viewing. */
export function buildGoogleCalendarViewUrl(opts: {
  title: string;
  date: string;
  time?: string;
  durationMinutes?: number;
  description?: string;
  location?: string;
}): string {
  const { y, m, d, hh, mm } = parseViewingParts(opts.date, opts.time);
  const duration = opts.durationMinutes ?? 60;
  const startLocal = new Date(y, m - 1, d, hh, mm, 0);
  const endLocal = new Date(startLocal.getTime() + duration * 60_000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${googleCalendarDate(startLocal)}/${googleCalendarDate(endLocal)}`,
    ctz: "Asia/Bangkok",
  });
  if (opts.description) params.set("details", opts.description);
  if (opts.location) params.set("location", opts.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
