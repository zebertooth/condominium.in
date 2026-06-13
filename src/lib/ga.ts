/** Google Analytics 4 measurement ID (public — safe to embed). */
export const GA_MEASUREMENT_ID = "G-9MRZ57SWS1";

/** Env override for staging; defaults to production ID above. */
export function getGaMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_ID?.trim() || GA_MEASUREMENT_ID;
}

export function isGaConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}
