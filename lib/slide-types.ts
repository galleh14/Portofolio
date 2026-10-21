export type HeroSlide = {
  id: string;
  image_url: string;
  image_path: string;
  caption: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};
