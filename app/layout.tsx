import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: `${settings.site_name} | ${settings.role_title}`, template: `%s | ${settings.site_name}` },
    description: `${settings.site_name}, ${settings.role_title} based in ${settings.location}.`,
    openGraph: {
      siteName: settings.site_name,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: settings.site_name }],
    },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">
        <SiteHeader settings={settings} />
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
