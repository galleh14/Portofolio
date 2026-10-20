import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid-overlay flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow">404 · Halaman tidak ditemukan</p>
        <h1 className="display-font mt-6 max-w-3xl text-6xl font-bold leading-[0.9] sm:text-8xl">Halaman ini tidak ada.</h1>
        <p className="mt-8 max-w-md leading-7 text-[var(--muted)]">Mungkin alamatnya salah atau halaman yang kamu cari sudah dipindahkan.</p>
        <Link href="/" className="mt-10 inline-flex rounded-full bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#35443a]">Kembali ke Home <span className="ml-1">↗</span></Link>
      </div>
    </main>
  );
}
