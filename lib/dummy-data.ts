export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  stack: string[];
  accent: "green" | "blue" | "warm";
  result: string;
  role: string;
  imageLabel: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
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
  featured: boolean;
  created_at: string;
};

export function mapSupabaseProject(project: SupabaseProject): Project {
  return {
    slug: project.slug,
    title: project.title,
    category: "Digital experience",
    year: project.created_at.slice(0, 4),
    description: project.description,
    longDescription: project.description,
    stack: project.tech_stack ?? [],
    accent: "green",
    result: "—",
    role: "Design & Development",
    imageLabel: project.title.toUpperCase(),
    demoUrl: project.demo_url ?? "#",
    repoUrl: project.repo_url ?? "#",
    featured: project.featured,
  };
}

export const projects: Project[] = [
  {
    slug: "kora-finance",
    title: "Kora Finance",
    category: "Fintech · Product Design",
    year: "2024",
    description: "Membuat pengalaman mengatur uang terasa lebih sederhana untuk generasi baru.",
    longDescription:
      "Kora adalah konsep aplikasi keuangan personal yang membantu pengguna memahami kebiasaan finansialnya tanpa jargon yang rumit. Saya merancang fondasi visual, alur onboarding, dan sistem insight yang terasa personal.",
    stack: ["Figma", "Next.js", "TypeScript", "Supabase"],
    accent: "green",
    result: "72%",
    role: "Product Designer & Developer",
    imageLabel: "KORA / 01",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
  {
    slug: "ruang-kota",
    title: "Ruang Kota",
    category: "Community · Web Experience",
    year: "2023",
    description: "Platform digital untuk menemukan acara, ruang, dan komunitas di sekitar kota.",
    longDescription:
      "Ruang Kota menghubungkan orang-orang dengan kegiatan lokal yang relevan. Tantangannya adalah menyajikan banyak informasi tanpa membuat pengguna kehilangan konteks. Solusinya adalah sistem discovery yang ringan dan terkurasi.",
    stack: ["Research", "Figma", "React", "Framer Motion"],
    accent: "blue",
    result: "3.1x",
    role: "Lead Designer",
    imageLabel: "RUANG / 02",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
  {
    slug: "sora-studio",
    title: "Sora Studio",
    category: "Branding · Portfolio",
    year: "2023",
    description: "Identitas dan website untuk studio kreatif yang bekerja lintas medium.",
    longDescription:
      "Sora Studio membutuhkan identitas yang cukup tenang untuk menunjukkan kualitas karya, namun tetap punya karakter yang mudah diingat. Saya menerjemahkan karakter tersebut ke dalam sistem brand dan website editorial.",
    stack: ["Art Direction", "Web Design", "Next.js", "Content"],
    accent: "warm",
    result: "18k",
    role: "Designer & Developer",
    imageLabel: "SORA / 03",
    demoUrl: "#",
    repoUrl: "#",
    featured: true,
  },
];

export const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];
