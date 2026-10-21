export const PROJECT_DOMAINS = ["Oil & Gas", "Geothermal", "Mining", "Hydrogeology", "Engineering Geophysics", "Other"] as const;
export const DATA_TYPES = ["field", "synthetic", "public dataset"] as const;

export type ProjectDomain = (typeof PROJECT_DOMAINS)[number];
export type ProjectDataType = (typeof DATA_TYPES)[number];

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  image_path: string;
  caption: string | null;
  sort_order: number;
};
