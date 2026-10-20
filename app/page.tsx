import Link from "next/link";
import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { mapSupabaseProject, type SupabaseProject } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { SocialLinks } from "@/components/social-links";
import { HeroSlider } from "@/components/hero-slider";
import { getActiveSlides } from "@/lib/slides";

export const instant = false;

export default async function Home() {
  const settings = await getSiteSettings();
  await connection();
  const slides = await getActiveSlides();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("title,slug,description,tech_stack,image_url,demo_url,repo_url,doc_url,doc_name,featured,created_at,role,duration,study_area,domain,data_type,methods,software,objective,workflow,result,conclusion")
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
          <p className="eyebrow">{settings.role_title} · {settings.location}</p>
          <h1 className="display-font mt-6 max-w-5xl whitespace-pre-line text-6xl font-bold leading-[0.88] sm:text-8xl lg:text-[9.5rem]">{settings.hero_heading}</h1>
          <div className="mt-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-sm text-base leading-7 text-[var(--muted)]">{settings.hero_subheading}</p>
            <Link href="/projects" className="group flex w-fit items-center gap-3 text-sm font-bold">Explore my work <span className="link-arrow text-xl">↓</span></Link>
          </div>
        </div>
      </section>

      {slides.length > 0 && <HeroSlider slides={slides} />}

      <section id="about" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <p className="eyebrow">{settings.about_label}</p>
        <div>
          <h2 className="display-font max-w-3xl whitespace-pre-line text-4xl font-bold leading-tight sm:text-6xl">{settings.about_heading}</h2>
          <p className="mt-8 max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{settings.about_body}</p>
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
        <div><p className="eyebrow">Get in touch</p><h2 className="display-font mt-4 text-5xl font-bold leading-none sm:text-7xl">{settings.role_title}</h2><div className="mt-10 space-y-3 text-sm text-[var(--muted)]"><p><a href={`mailto:${settings.email}`} target="_blank" rel="noopener noreferrer">{settings.email}</a></p><p>{settings.location}</p></div><div className="mt-7"><SocialLinks settings={settings} /></div></div>
        <ContactForm />
      </section>
    </>
  );
}
