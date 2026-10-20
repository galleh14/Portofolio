export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  position: string | null;
  organization: string | null;
  photo_url: string | null;
  photo_path: string | null;
  sort_order: number;
  is_visible: boolean;
};
