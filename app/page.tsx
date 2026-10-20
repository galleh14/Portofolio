import Link from "next/link";
import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { mapSupabaseProject, socialLinks, type SupabaseProject } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function Home() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("title,slug,description,tech_stack,image_url,demo_url,repo_url,featured,created_at")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(`Gagal memuat project: ${error.message}`);
  }

  const projects = (data as SupabaseProject[]).map(mapSupabaseProject);

  return (
    <>
      <section className="grid-overlay border-b border-[var(--line)] px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Independent designer & developer · Jakarta</p>
          <h1 className="display-font mt-6 max-w-5xl text-6xl font-bold leading-[0.88] sm:text-8xl lg:text-[9.5rem]">
            Digital work<br /><span className="text-[#829e52]">with a point of view.</span>
          </h1>
          <div className="mt-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-sm text-base leading-7 text-[var(--muted)]">Saya membantu brand dan produk bertumbuh lewat desain yang jernih, detail, dan terasa manusiawi.</p>
            <Link href="/projects" className="group flex w-fit items-center gap-3 text-sm font-bold">Explore my work <span className="link-arrow text-xl">↓</span></Link>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <p className="eyebrow">A little about me</p>
        <div>
          <h2 className="display-font max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">I turn complex problems into <span className="text-[#829e52]">clear experiences.</span></h2>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">Selama 6 tahun terakhir, saya bekerja dengan founder dan tim kecil untuk membangun produk digital yang tidak hanya terlihat baik, tapi juga bekerja dengan baik.</p>
          <Link href="/about" className="mt-8 inline-flex items-center gap-2 border-b border-[var(--foreground)] pb-1 text-sm font-bold">More about me <span className="link-arrow">↗</span></Link>
        </div>
      </section>

      {projects.length > 0 && <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4"><div><p className="eyebrow">Selected work</p><h2 className="display-font mt-3 text-4xl font-bold sm:text-5xl">A few things I&apos;ve made.</h2></div><Link href="/projects" className="hidden text-sm font-bold sm:block">View all <span className="link-arrow ml-1">↗</span></Link></div>
          <div className="grid gap-10 md:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} project={project} featured />)}</div>
          <Link href="/projects" className="mt-10 block text-sm font-bold sm:hidden">View all projects <span className="ml-1">↗</span></Link>
        </div>
      </section>}

      <section id="contact" className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <div><p className="eyebrow">Get in touch</p><h2 className="display-font mt-4 text-5xl font-bold leading-none sm:text-7xl">Have a project in mind?</h2><div className="mt-10 space-y-3 text-sm text-[var(--muted)]"><p>hello@rakaaditya.com</p><p>Jakarta, Indonesia · GMT+7</p></div><div className="mt-7 flex gap-5 text-sm font-semibold">{socialLinks.map((social) => <a key={social.label} href={social.href} className="hover:text-[#829e52]">{social.label}</a>)}</div></div>
        <ContactForm />
      </section>
    </>
  );
}
