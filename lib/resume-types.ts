export const RESUME_CATEGORIES = [
  "experience",
  "education",
  "certification",
  "publication",
  "achievement",
  "organization",
  "skill",
] as const;

export type ResumeCategory = (typeof RESUME_CATEGORIES)[number];

export const RESUME_CATEGORY_LABELS: Record<ResumeCategory, string> = {
  experience: "Experience",
  education: "Education",
  certification: "Certifications",
  publication: "Publications",
  achievement: "Achievements",
  organization: "Organizations",
  skill: "Skills",
};

export type ResumeItem = {
  id: string;
  category: ResumeCategory;
  title: string;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  url: string | null;
  file_url: string | null;
  file_path: string | null;
  credential_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

export function formatResumeDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function formatResumePeriod(item: ResumeItem) {
  const start = formatResumeDate(item.start_date);
  const end = item.is_current ? "Present" : formatResumeDate(item.end_date);
  if (!start && !end) return "";
  return `${start || "—"} - ${end || "Present"}`;
}

export function groupResumeItems(items: ResumeItem[]) {
  return RESUME_CATEGORIES.reduce<Record<ResumeCategory, ResumeItem[]>>((groups, category) => {
    groups[category] = items.filter((item) => item.category === category);
    return groups;
  }, {
    experience: [],
    education: [],
    certification: [],
    publication: [],
    achievement: [],
    organization: [],
    skill: [],
  });
}
