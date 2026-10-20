import { createClient } from "@/lib/supabase/server";

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
  footer_text: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("id,site_name,role_title,location,hero_heading,hero_subheading,about_label,about_heading,about_body,email,linkedin_url,instagram_url,github_url,whatsapp,cv_url,footer_text")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(`Gagal memuat pengaturan situs: ${error.message}`);
  }

  return data as SiteSettings;
}
