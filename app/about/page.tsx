import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="eyebrow">About me</p>
      <h1 className="display-font mt-5 max-w-4xl text-6xl font-bold leading-[0.9] sm:text-8xl">Designing with <span className="text-[#829e52]">curiosity</span> and care.</h1>
      <div className="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-[0.7fr_1.3fr]">
        <p className="eyebrow">The short version</p>
        <div className="max-w-2xl space-y-6 text-lg leading-8 text-[var(--muted)]"><p>Saya Raka, seorang product designer dan developer yang suka berada di antara strategi, desain, dan teknologi.</p><p>Saya percaya solusi yang baik tidak harus rumit. Proses saya selalu dimulai dengan mendengarkan, merapikan masalah, lalu membangun sesuatu yang terasa jelas sejak interaksi pertama.</p><p>Saat tidak sedang bekerja, biasanya saya mencari kedai kopi baru atau memotret hal-hal kecil di sekitar kota.</p></div>
      </div>
      <div className="mt-20 grid gap-8 border-t border-[var(--line)] pt-10 sm:grid-cols-3"><div><p className="display-font text-5xl font-bold">6+</p><p className="mt-2 text-sm text-[var(--muted)]">Years of experience</p></div><div><p className="display-font text-5xl font-bold">24</p><p className="mt-2 text-sm text-[var(--muted)]">Projects shipped</p></div><div><p className="display-font text-5xl font-bold">08</p><p className="mt-2 text-sm text-[var(--muted)]">Happy collaborators</p></div></div>
      <Link href="/contact" className="mt-16 inline-block rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white">Let&apos;s work together ↗</Link>
    </div>
  );
}
