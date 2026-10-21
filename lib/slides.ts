import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/lib/slide-types";

const SLIDE_SELECT = "id,image_url,image_path,caption,link_url,sort_order,is_active,created_at";

export async function getActiveSlides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select(SLIDE_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load hero slides: ${error.message}`);
  return (data ?? []) as HeroSlide[];
}

export async function getAllSlides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select(SLIDE_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load hero slides: ${error.message}`);
  return (data ?? []) as HeroSlide[];
}
