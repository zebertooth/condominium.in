import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Provider-agnostic image storage.
 *
 * Uses Cloudinary (signed upload) when CLOUDINARY_* env vars are set; otherwise
 * falls back to writing into `public/uploads` for local development.
 *
 * NOTE: the local-disk fallback is for dev only. Serverless hosts (e.g. Vercel)
 * have an ephemeral / read-only filesystem — configure Cloudinary in production.
 */

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local";
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

async function uploadToCloudinary(buffer: Buffer, mime: string): Promise<UploadResult> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME as string;
  const apiKey = process.env.CLOUDINARY_API_KEY as string;
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;
  const folder = process.env.CLOUDINARY_FOLDER || "condominium";
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature: sha1 of sorted params + api_secret.
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mime }));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    console.error(`[storage:cloudinary] failed ${res.status}`);
    throw new Error("CLOUDINARY_UPLOAD_FAILED");
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("CLOUDINARY_NO_URL");

  return { url: data.secure_url, provider: "cloudinary" };
}

async function uploadToLocal(buffer: Buffer, ext: string): Promise<UploadResult> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/${name}`, provider: "local" };
}

function isServerlessHost(): boolean {
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

export async function uploadImage(buffer: Buffer, mime: string): Promise<UploadResult> {
  const ext = ALLOWED_IMAGE_TYPES[mime];
  if (!ext) throw new Error("UNSUPPORTED_TYPE");

  if (cloudinaryConfigured()) {
    return uploadToCloudinary(buffer, mime);
  }

  if (isServerlessHost()) {
    throw new Error("CLOUDINARY_REQUIRED");
  }

  return uploadToLocal(buffer, ext);
}
