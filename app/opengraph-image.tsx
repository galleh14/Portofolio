import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/site-settings";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const settings = await getSiteSettings();
  return new ImageResponse(
    <div style={{ background: "#f4f5ef", color: "#18211b", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", width: "100%", height: "100%" }}>
      <div style={{ color: "#627a34", fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>{settings.site_name}</div>
      {settings.profile_image_url && <img src={settings.profile_image_url} alt="" style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 24, marginTop: 28 }} />}
      <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 24, maxWidth: 1000 }}>{settings.role_title}</div>
      <div style={{ color: "#68736b", fontSize: 32, marginTop: 28 }}>{settings.location}</div>
    </div>,
    size,
  );
}
