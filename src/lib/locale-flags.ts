/** ISO 3166-1 alpha-2 codes for flagcdn.com */
export const localeFlagCodes: Record<string, string> = {
  th: "th",
  en: "gb",
  zh: "cn",
  ja: "jp",
  ar: "sa",
};

export function flagImageUrl(locale: string): string {
  const code = localeFlagCodes[locale] ?? "un";
  return `https://flagcdn.com/24x18/${code}.png`;
}
