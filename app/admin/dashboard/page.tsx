import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProject } from "@/app/admin/actions";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata = { title: "Admin Dashboard" };

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured: boolean;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("id,title,slug,description,featured").order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat project: ${error.message}`);
  const projects = (data ?? []) as ProjectRow[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-col justify-between gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end">
        <div><p className="eyebrow">Admin workspace</p><h1 className="display-font mt-3 text-5xl font-bold">Projects.</h1></div>
        <div className="flex items-center gap-5"><Link href="/admin/settings" className="text-sm font-semibold hover:underline">Pengaturan</Link><LogoutButton /><Link href="/admin/dashboard/new" className="rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-semibold text-white">Add project <span className="ml-1">+</span></Link></div>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        {projects.length === 0 ? <p className="p-8 text-sm text-[var(--muted)]">Belum ada project. Tambahkan project pertama.</p> : projects.map((project) => (
          <div key={project.id} className="flex flex-col justify-between gap-4 border-b border-[var(--line)] p-5 last:border-0 sm:flex-row sm:items-center">
            <div><div className="flex items-center gap-3"><h2 className="font-semibold">{project.title}</h2>{project.featured && <span className="rounded-full bg-[#eff9d7] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#627a34]">Featured</span>}</div><p className="mt-1 text-sm text-[var(--muted)]">/{project.slug}</p></div>
            <div className="flex items-center gap-4 text-sm"><Link href={`/admin/dashboard/${project.id}`} className="font-semibold hover:underline">Edit</Link><form action={deleteProject}><input type="hidden" name="id" value={project.id} /><button type="submit" className="text-red-700 hover:underline">Delete</button></form></div>
          </div>
        ))}
      </div>
    </div>
  );
}
