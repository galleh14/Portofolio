import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/testimonial-types";

const TESTIMONIAL_SELECT = "id,quote,name,position,organization,photo_url,photo_path,sort_order,is_visible";

export async function getVisibleTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_SELECT)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Gagal memuat testimonial: ${error.message}`);
  return (data ?? []) as Testimonial[];
}

export async function getAllTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Gagal memuat testimonial: ${error.message}`);
  return (data ?? []) as Testimonial[];
}
