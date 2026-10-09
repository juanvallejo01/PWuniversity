import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";

// Con un Blob store público conectado al proyecto (Vercel crea BLOB_READ_WRITE_TOKEN o BLOB_STORE_ID) las
// imágenes se suben a Vercel Blob, porque en Vercel el disco es de solo lectura. Sin el token
// (desarrollo local) se guardan en /public/uploads. Todos los formularios llaman solo a
// `saveUploadedImage`.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo permitido (8MB).");
  }

  const ext = extensionFor(file.type);
  const filename = `${crypto.randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const blob = await put(`uploads/${filename}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

function extensionFor(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}
