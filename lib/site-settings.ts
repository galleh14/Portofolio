import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

export type SiteSettings = {
  id: number;
  site_name: string;
  role_title: string;
  location: string;
  hero_heading: string;
  hero_subheading: string;
  about_label: string;
  about_heading: string;
  about_body: string;
  email: string;
  linkedin_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  whatsapp: string | null;
  cv_url: string | null;
  profile_image_url: string | null;
  profile_image_path: string | null;
  footer_text: string;
  availability_status: "open" | "busy" | "closed";
  available_from: string | null;
  location_preference: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("site-settings");
  cacheLife("hours");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase
    .from("site_settings")
    .select("id,site_name,role_title,location,hero_heading,hero_subheading,about_label,about_heading,about_body,email,linkedin_url,instagram_url,github_url,whatsapp,cv_url,profile_image_url,profile_image_path,footer_text,availability_status,available_from,location_preference")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(`Failed to load site settings: ${error.message}`);
  }

  return data as SiteSettings;
}
