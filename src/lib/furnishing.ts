import type { Property } from "@/types/property";

const FURNISHED_PATTERN = /เฟอร์|furnish|fully furnished|ครบ/i;

export function isPropertyFurnished(property: Property): boolean {
  return property.features.some((feature) => FURNISHED_PATTERN.test(feature));
}
