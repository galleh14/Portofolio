import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/site-settings";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export function createPageMetadata(settings: SiteSettings, title: string, description: string, image?: string | null): Metadata {
  const imageUrl = image ? getAbsoluteUrl(image) : getAbsoluteUrl("/opengraph-image");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl("/"),
      siteName: settings.site_name,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
