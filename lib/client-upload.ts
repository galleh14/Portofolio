"use client";

import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const DOCUMENT_TYPES = ["application/pdf"] as const;

export type UploadedFile = { path: string; url: string; name: string };

export async function uploadBrowserFile(
  file: File,
  folder: string,
  options: { compressImage?: boolean; preserveQuality?: boolean; onProgress?: (progress: number) => void } = {},
): Promise<UploadedFile> {
  if (file.size > MAX_UPLOAD_SIZE) throw new Error(`${file.name}: ukuran maksimal 50MB.`);
  const isImage = IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number]);
  if (!isImage && !DOCUMENT_TYPES.includes(file.type as (typeof DOCUMENT_TYPES)[number])) {
    throw new Error(`${file.name}: format tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.`);
  }

  let uploadFile = file;
  if (isImage && options.compressImage && !options.preserveQuality) {
    uploadFile = await imageCompression(file, {
      maxSizeMB: 3,
      maxWidthOrHeight: 2560,
      useWebWorker: true,
      fileType: file.type,
    });
  }

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = createClient();
  options.onProgress?.(15);
  const { error } = await supabase.storage.from("portfolio").upload(path, uploadFile, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Upload ${file.name} gagal: ${error.message}`);
  options.onProgress?.(100);
  return { path, url: supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl, name: file.name };
}

export async function removeBrowserFiles(paths: string[]) {
  if (paths.length === 0) return;
  await createClient().storage.from("portfolio").remove(paths);
}
