export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  stack: string[];
  accent: "green" | "blue" | "warm";
  result: string | null;
  role: string | null;
  imageLabel: string;
  demoUrl: string;
  repoUrl: string;
  docUrl: string | null;
  docName: string | null;
  featured: boolean;
  duration: string | null;
  studyArea: string | null;
  domain: string | null;
  dataType: string | null;
  methods: string[];
  software: string[];
  objective: string | null;
  workflow: string | null;
  conclusion: string | null;
  notebookUrl?: string | null;
  datasetUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  galleryImages?: string[];
};

export type SupabaseProject = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[] | null;
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  doc_url: string | null;
  doc_name: string | null;
  featured: boolean;
  role: string | null;
  duration: string | null;
  study_area: string | null;
  domain: string | null;
  data_type: string | null;
  methods: string[] | null;
  software: string[] | null;
  objective: string | null;
  workflow: string | null;
  result: string | null;
  conclusion: string | null;
  notebook_url: string | null;
  dataset_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  project_images?: { image_url: string; sort_order: number }[] | null;
};

export function mapSupabaseProject(project: SupabaseProject): Project {
  return {
    slug: project.slug,
    title: project.title,
    category: project.domain ?? "Other",
    year: project.created_at.slice(0, 4),
    description: project.description,
    longDescription: project.description,
    stack: project.tech_stack ?? [],
    accent: "green",
    result: project.result,
    imageLabel: project.title.toUpperCase(),
    demoUrl: project.demo_url ?? "#",
    repoUrl: project.repo_url ?? "#",
    docUrl: project.doc_url,
    docName: project.doc_name,
    featured: project.featured,
    role: project.role,
    duration: project.duration,
    studyArea: project.study_area,
    domain: project.domain,
    dataType: project.data_type,
    methods: project.methods ?? [],
    software: project.software ?? [],
    objective: project.objective,
    workflow: project.workflow,
    conclusion: project.conclusion,
    notebookUrl: project.notebook_url,
    datasetUrl: project.dataset_url,
    latitude: project.latitude,
    longitude: project.longitude,
    imageUrl: project.image_url,
    galleryImages: project.project_images?.sort((a, b) => a.sort_order - b.sort_order).map((image) => image.image_url) ?? [],
  };
}

export const projects: Project[] = [
  {
    slug: "kora-finance",
    title: "Kora Finance",
    category: "Fintech · Product Design",
    year: "2024",
    description: "Making money management feel simpler for a new generation.",
    longDescription:
      "Kora is a personal finance app concept that helps users understand their financial habits without complex jargon. I designed the visual foundation, onboarding flow, and a personal-feeling insight system.",
    stack: ["Figma", "Next.js", "TypeScript", "Supabase"],
    accent: "green",
    result: "72%",
    role: "Product Designer & Developer",
    imageLabel: "KORA / 01",
    demoUrl: "#",
    repoUrl: "#",
    docUrl: null,
    docName: null,
    featured: true,
    duration: null,
    studyArea: null,
    domain: null,
    dataType: null,
    methods: [],
    software: [],
    objective: null,
    workflow: null,
    conclusion: null,
  },
  {
    slug: "ruang-kota",
    title: "Ruang Kota",
    category: "Community · Web Experience",
    year: "2023",
    description: "A digital platform for discovering events, spaces, and communities around the city.",
    longDescription:
      "Ruang Kota connects people with relevant local activities. The challenge was presenting a lot of information without losing context. The solution was a lightweight, curated discovery system.",
    stack: ["Research", "Figma", "React", "Framer Motion"],
    accent: "blue",
    result: "3.1x",
    role: "Lead Designer",
    imageLabel: "RUANG / 02",
    demoUrl: "#",
    repoUrl: "#",
    docUrl: null,
    docName: null,
    featured: true,
    duration: null,
    studyArea: null,
    domain: null,
    dataType: null,
    methods: [],
    software: [],
    objective: null,
    workflow: null,
    conclusion: null,
  },
  {
    slug: "sora-studio",
    title: "Sora Studio",
    category: "Branding · Portfolio",
    year: "2023",
    description: "Brand identity and website for a creative studio working across mediums.",
    longDescription:
      "Sora Studio needed a calm identity that showcased the quality of its work while remaining memorable. I translated that character into a brand system and editorial website.",
    stack: ["Art Direction", "Web Design", "Next.js", "Content"],
    accent: "warm",
    result: "18k",
    role: "Designer & Developer",
    imageLabel: "SORA / 03",
    demoUrl: "#",
    repoUrl: "#",
    docUrl: null,
    docName: null,
    featured: true,
    duration: null,
    studyArea: null,
    domain: null,
    dataType: null,
    methods: [],
    software: [],
    objective: null,
    workflow: null,
    conclusion: null,
  },
];

export const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];
