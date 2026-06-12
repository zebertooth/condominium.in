import { z } from "zod";

export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine(
    (v) => v === "" || /^(0[689]\d{8}|66[689]\d{8})$/.test(v),
    "เบอร์โทรไม่ถูกต้อง (ใช้รูปแบบ 08xxxxxxxx)",
  );

export const emailSchema = z
  .string()
  .email("อีเมลไม่ถูกต้อง")
  .transform((v) => v.toLowerCase().trim());

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("66")) return `0${digits.slice(2)}`;
  return digits;
}

export function validateThaiIdCard(id: string): boolean {
  const digits = id.replace(/\D/g, "");
  if (digits.length !== 13) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i], 10) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(digits[12], 10);
}

export const registerSchema = z
  .object({
    phone: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
    fullName: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
    isThai: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const phone = data.phone ? normalizePhone(data.phone) : "";
    const email = data.email?.trim() ?? "";

    if (!phone && !email) {
      ctx.addIssue({
        code: "custom",
        message: "กรุณากรอกเบอร์โทรหรืออีเมลอย่างน้อยหนึ่งอย่าง",
        path: ["phone"],
      });
      return;
    }

    if (phone && !/^(0[689]\d{8})$/.test(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "เบอร์โทรไม่ถูกต้อง",
        path: ["phone"],
      });
    }

    if (email && !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: "custom",
        message: "อีเมลไม่ถูกต้อง",
        path: ["email"],
      });
    }
  });

export const adminCreateUserSchema = registerSchema.extend({
  role: z.enum(["user", "agent", "admin"]).default("user"),
  phoneVerified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export const loginSchema = z.object({
  login: z.string().min(1, "กรุณากรอกเบอร์โทรหรืออีเมล"),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, "ลิงก์ไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
});

export const verifyIdSchema = z.object({
  idCardNumber: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 13, "เลขบัตรประชาชนต้อง 13 หลัก")
    .refine(validateThaiIdCard, "เลขบัตรประชาชนไม่ถูกต้อง"),
});

export const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  highlights: z.string().max(2000).optional().default(""),
  listingType: z.enum(["sale", "rent"]),
  propertyType: z.enum(["condo", "house", "townhouse", "apartment"]).default("condo"),
  price: z.number().int().positive(),
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().int().min(1).max(10),
  areaSqm: z.number().positive(),
  floor: z.number().int().optional(),
  district: z.string().min(2),
  btsStation: z.string().optional(),
  address: z.string().min(5),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  features: z.array(z.string()).default([]),
  images: z
    .array(
      z
        .string()
        .refine(
          (v) => /^https?:\/\//.test(v) || v.startsWith("/uploads/"),
          "รูปภาพต้องเป็น URL หรือไฟล์ที่อัปโหลด",
        ),
    )
    .min(1)
    .max(10),
  agentManaged: z.boolean().optional(),
});

export const leadSchema = z
  .object({
    name: z.string().min(2, "กรุณากรอกชื่อ"),
    phone: z.string().optional(),
    email: z.string().optional(),
    message: z.string().min(5, "กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร"),
    source: z.enum(["contact", "property", "ai-search"]).default("contact"),
    contactMode: z.enum(["agent_team", "owner_direct"]).optional(),
    propertySlug: z.string().optional(),
    propertyTitle: z.string().optional(),
    btsStation: z.string().optional(),
    ownerUserId: z.string().optional(),
    posterRole: z.string().optional(),
    viewingDate: z.string().optional(),
    viewingTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const phone = data.phone?.trim() ?? "";
    const email = data.email?.trim() ?? "";
    if (!phone && !email) {
      ctx.addIssue({
        code: "custom",
        message: "กรุณากรอกเบอร์โทรหรืออีเมลเพื่อให้เราติดต่อกลับ",
        path: ["phone"],
      });
    }
  });

export function parseLoginIdentifier(login: string): { phone?: string; email?: string } {
  const trimmed = login.trim();
  if (trimmed.includes("@")) {
    return { email: trimmed.toLowerCase() };
  }
  const phone = normalizePhone(trimmed);
  return phone ? { phone } : {};
}
