"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsActionState } from "@/app/admin/settings/actions";
import type { SiteSettings } from "@/lib/site-settings";
import { removeBrowserFiles, uploadBrowserFile } from "@/lib/client-upload";
import { useState } from "react";

const initialState: SettingsActionState = { error: "", success: false };

function Field({ label, name, value, textarea = false, type = "text" }: { label: string; name: string; value: string | null; textarea?: boolean; type?: string }) {
  const className = "mt-2 block w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-3 font-normal outline-none transition focus:border-[var(--dark)]";
  return <label className="block text-sm font-semibold">{label}{textarea ? <textarea name={name} rows={4} defaultValue={value ?? ""} className={`${className} resize-y`} /> : <input name={name} type={type} defaultValue={value ?? ""} className={className} />}</label>;
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setUploading(true); setError("");
    let path = "";
    try {
      const data = new FormData(event.currentTarget);
      const file = data.get("cv_file");
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadBrowserFile(file, "cv", { onProgress: () => undefined });
        path = uploaded.path; data.set("uploaded_cv_url", uploaded.url); data.delete("cv_file");
      }
      formAction(data);
    } catch (uploadError) {
      if (path) await removeBrowserFiles([path]);
      setError(uploadError instanceof Error ? uploadError.message : "CV upload failed.");
    } finally { setUploading(false); }
  }
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-10">
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">Profil</h2><div className="grid gap-5 sm:grid-cols-2"><Field label="Name situs" name="site_name" value={settings.site_name} /><Field label="Role" name="role_title" value={settings.role_title} /><Field label="Location" name="location" value={settings.location} /></div><Field label="Teks footer" name="footer_text" value={settings.footer_text} textarea /></section>
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">Hero</h2><Field label="Heading" name="hero_heading" value={settings.hero_heading} textarea /><Field label="Subheading" name="hero_subheading" value={settings.hero_subheading} textarea /></section>
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">About</h2><Field label="Label" name="about_label" value={settings.about_label} /><Field label="Heading" name="about_heading" value={settings.about_heading} textarea /><Field label="Body" name="about_body" value={settings.about_body} textarea /></section>
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">Contact & Sosial Media</h2><Field label="Email" name="email" value={settings.email} type="email" /><div className="grid gap-5 sm:grid-cols-2"><Field label="LinkedIn URL" name="linkedin_url" value={settings.linkedin_url} /><Field label="Instagram URL" name="instagram_url" value={settings.instagram_url} /><Field label="GitHub URL" name="github_url" value={settings.github_url} /><Field label="WhatsApp" name="whatsapp" value={settings.whatsapp} /></div></section>
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">CV</h2><Field label="CV URL" name="cv_url" value={settings.cv_url} /><label className="block text-sm font-semibold">Upload PDF<input name="cv_file" type="file" accept="application/pdf" className="mt-2 block w-full cursor-pointer rounded-lg border border-[var(--line)] px-3 py-3 text-sm font-normal" /><span className="mt-2 block text-xs font-normal text-[var(--muted)]">PDF, maximum 50MB.</span></label></section>
      <section className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"><h2 className="display-font text-3xl font-bold">Availability</h2><div className="grid gap-5 sm:grid-cols-3"><label className="block text-sm font-semibold">Status<select name="availability_status" defaultValue={settings.availability_status} className="mt-2 block w-full rounded-lg border border-[var(--line)] bg-white px-3 py-3 font-normal outline-none focus:border-[var(--dark)]"><option value="open">Open to work</option><option value="busy">Limited</option><option value="closed">Closed</option></select></label><Field label="Available from" name="available_from" value={settings.available_from} type="date" /><Field label="Preferensi locations" name="location_preference" value={settings.location_preference} /></div></section>
      {(state.error || error) && <p role="alert" className="text-sm text-red-700">{state.error || error}</p>}
      {state.success && <p role="status" className="text-sm text-[#627a34]">Settings saved successfully.</p>}
      <button disabled={pending || uploading} type="submit" className="rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{uploading ? "Uploading..." : pending ? "Saving..." : "Save settings"}</button>
    </form>
  );
}
