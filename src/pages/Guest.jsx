import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";

// ==== DUMMY DATA ====
const dummy = {
  profile: {
    nama: "Ilham Ramadhan",
    profesi: "Fullstack Web Developer",
    deskripsi:
      "Membangun aplikasi web yang cepat, rapi, dan mudah dirawat menggunakan React, Laravel, dan Tailwind CSS.",
    foto: null,
    cv: null,
    email: "ilham@example.com",
    instagram: "ilhamdev",
    linkedin: "linkedin.com/in/ilhamdev",
    github: "github.com/ilhamdev",
  },
  projects: [
    {
      id: 1,
      nama: "Sistem Manajemen Inventaris",
      deskripsi:
        "Aplikasi web untuk kelola stok barang gudang secara real-time.",
      status: "selesai",
      gambars: [],
    },
    {
      id: 2,
      nama: "Platform E-Learning",
      deskripsi: "LMS sederhana dengan fitur quiz dan progress tracking.",
      status: "berjalan",
      gambars: [],
    },
    {
      id: 3,
      nama: "Portfolio Generator",
      deskripsi:
        "Tool untuk generate halaman portofolio otomatis dari data JSON.",
      status: "arsip",
      gambars: [],
    },
  ],
  skills: [
    { id: 1, nama: "React" },
    { id: 2, nama: "Laravel" },
    { id: 3, nama: "Tailwind CSS" },
    { id: 4, nama: "MySQL" },
    { id: 5, nama: "Node.js" },
    { id: 6, nama: "Docker" },
  ],
  karirs: [
    {
      id: 1,
      perusahaan: "PT Teknologi Nusantara",
      jabatan: "Fullstack Developer",
      tanggal_mulai: "2023-01-01",
      tanggal_selesai: null,
    },
    {
      id: 2,
      perusahaan: "CV Digital Kreasi",
      jabatan: "Frontend Developer",
      tanggal_mulai: "2021-06-01",
      tanggal_selesai: "2022-12-01",
    },
  ],
  pendidikans: [
    {
      id: 1,
      nama: "Universitas Indonesia",
      jurusan: "Teknik Informatika",
      jenjang: "S1",
      tanggal_mulai: "2018-08-01",
      tanggal_selesai: "2022-07-01",
    },
  ],
  sertifikats: [
    {
      id: 1,
      nama_sertifikat: "AWS Certified Developer",
      lembaga_penerbit: "Amazon Web Services",
      tanggal_terbit: "2024-03-01",
      tanggal_kadaluarsa: "2027-03-01",
      file_sertifikat: null,
    },
    {
      id: 2,
      nama_sertifikat: "Laravel Certified",
      lembaga_penerbit: "Laravel Indonesia",
      tanggal_terbit: "2023-09-01",
      tanggal_kadaluarsa: "2026-09-01",
      file_sertifikat: null,
    },
  ],
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "karir", label: "Karir" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "sertifikat", label: "Sertifikat" },
  { id: "contact", label: "Contact" },
];

export default function GuestPreview() {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRefs = useRef({});
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const { profile, projects, skills, karirs, pendidikans, sertifikats } = dummy;

  // Restore posisi scroll terakhir kalau balik dari halaman lain (misal ProjectDetail)
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("guest-scroll-y");
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10)); // instan, sebelum browser sempat paint
      sessionStorage.removeItem("guest-scroll-y");
    }
  }, []);

  // Simpan posisi scroll tiap kali user scroll, biar bisa direstore nanti
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("guest-scroll-y", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // scroll-spy — dimatikan sementara pas lagi scroll manual dari klik nav,
  // biar gak "rebutan" nentuin active section
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = navRefs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  // Klik nav: kontrol scroll manual, anti-macet walau diklik cepat berkali-kali
  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);

    const target = document.getElementById(id);
    if (!target) return;

    // batalkan "lock" sebelumnya kalau user klik lagi sebelum scroll selesai
    clearTimeout(scrollTimeout.current);
    isProgrammaticScroll.current = true;
    setActive(id); // langsung update indicator, gak nunggu observer

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // buka lagi observer setelah scroll diperkirakan selesai
    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  };

  return (
    <div className="bg-black text-white min-h-screen animate-[fadeIn_0.25s_ease-out]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold tracking-wide">{profile.nama}</span>

          <div className="relative hidden sm:flex gap-1">
            <span
              className="absolute top-0 h-full bg-white/10 rounded transition-all duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
            {navItems.map((item) => (
              <a
                key={item.id}
                ref={(el) => (navRefs.current[item.id] = el)}
                href={`#${item.id}`}
                onClick={handleNavClick(item.id)}
                className={`relative z-10 px-3 py-1.5 text-sm rounded transition-colors ${
                  active === item.id
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            className="sm:hidden text-white text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden border-t border-white/10 px-6 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavClick(item.id)}
                className={`text-sm py-1.5 ${active === item.id ? "text-white" : "text-white/50"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-24">
        {/* HOME */}
        <section
          id="home"
          className="min-h-[80vh] flex items-center scroll-mt-20"
        >
          <div className="flex flex-col-reverse sm:flex-row items-center gap-10 w-full">
            <div className="flex-1">
              <p className="text-white/60 mb-2">Halo, saya</p>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-3">
                {profile.nama}
              </h1>
              <h2 className="text-xl text-white/70 mb-6">{profile.profesi}</h2>
              <p className="text-white/60 max-w-lg leading-relaxed mb-8">
                {profile.deskripsi}
              </p>

              <div className="flex gap-3">
                <a
                  href="#projects"
                  className="px-5 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors text-sm"
                >
                  Lihat Project
                </a>
                <a
                  href={profile.cv || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors text-sm"
                >
                  Download CV
                </a>
              </div>
            </div>

            <div className="w-40 h-40 sm:w-56 sm:h-56 border border-white/20 flex items-center justify-center text-white/30 text-xs shrink-0">
              {profile.foto ? (
                <img
                  src={profile.foto}
                  alt={profile.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                "Foto Profile"
              )}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-8">Projects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => {
              const thumbnail = p.gambars?.[0]?.gambar;
              return (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="block border border-white/10 hover:border-white/30 transition-colors overflow-hidden"
                >
                  <div className="w-full h-36 bg-white/5 flex items-center justify-center text-white/20 text-xs">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={p.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "Gambar Project"
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{p.nama}</h3>
                      <span className="text-xs text-white/40 uppercase">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2">
                      {p.deskripsi}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-8">Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 border border-white/10 px-4 py-3 hover:border-white/30 transition-colors"
              >
                <div className="w-8 h-8 border border-white/20 flex items-center justify-center text-xs shrink-0">
                  {s.nama[0]}
                </div>
                <span className="text-sm text-white/80">{s.nama}</span>
              </div>
            ))}
          </div>
        </section>

        {/* KARIR */}
        <section
          id="karir"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-10">Jenjang Karir</h2>
          <div className="border-l border-white/20 flex flex-col gap-10">
            {karirs.map((k) => (
              <div key={k.id} className="relative pl-6">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white" />
                <span className="text-xs text-white/40">
                  {k.tanggal_mulai} — {k.tanggal_selesai || "sekarang"}
                </span>
                <h3 className="font-medium mt-1">{k.jabatan}</h3>
                <p className="text-sm text-white/60">{k.perusahaan}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PENDIDIKAN */}
        <section
          id="pendidikan"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-10">Pendidikan</h2>
          <div className="border-l border-white/20 flex flex-col gap-10">
            {pendidikans.map((p) => (
              <div key={p.id} className="relative pl-6">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white" />
                <span className="text-xs text-white/40">
                  {p.tanggal_mulai} — {p.tanggal_selesai || "sekarang"}
                </span>
                <h3 className="font-medium mt-1">{p.nama}</h3>
                <p className="text-sm text-white/60">
                  {p.jurusan} · {p.jenjang}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERTIFIKAT */}
        <section
          id="sertifikat"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-8">Sertifikat</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {sertifikats.map((s) => (
              <a
                key={s.id}
                href={s.file_sertifikat || "#"}
                target="_blank"
                rel="noreferrer"
                className="block border border-white/10 p-5 hover:border-white/30 transition-colors"
              >
                <h3 className="font-medium mb-1">{s.nama_sertifikat}</h3>
                <p className="text-sm text-white/60 mb-2">
                  {s.lembaga_penerbit}
                </p>
                <p className="text-xs text-white/40 mb-3">
                  Terbit {s.tanggal_terbit} · Berlaku s/d {s.tanggal_kadaluarsa}
                </p>
                <span className="text-xs text-white/50 underline">
                  Lihat dokumen
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-6">Contact</h2>
          <p className="text-white/60 mb-6">
            Tertarik kolaborasi atau sekadar say hi? Hubungi saya lewat:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
            >
              Email
            </a>
            <a
              href={`https://${profile.github}`}
              className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={`https://${profile.linkedin}`}
              className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://instagram.com/${profile.instagram}`}
              className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </section>
      </main>

      <footer className="text-center text-white/30 text-xs py-8 border-t border-white/10">
        © {new Date().getFullYear()} {profile.nama}
      </footer>
    </div>
  );
}
