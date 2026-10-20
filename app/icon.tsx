import { ImageResponse } from "next/og";
import { getInitials } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSiteSettings();
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#18211b", borderRadius: 16, color: "#d8ff62", display: "flex", fontSize: 28, fontWeight: 800, height: "100%", justifyContent: "center", width: "100%" }}>
      {getInitials(settings.site_name)}
    </div>,
    size,
  );
}
