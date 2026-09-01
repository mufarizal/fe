import { useLayoutEffect, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePortofolio } from "../../context/PortofolioContext";
import { getStorageUrl } from "../../utils/formatUrl";
import { formatDate } from "../../utils/formatDate";
import Sidebar from "../../components/guest/Sidebar";

export default function Home() {
  const { data, loading, error } = usePortofolio();

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("guest-scroll-y");
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem("guest-scroll-y");
    }
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("guest-scroll-y", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-white/60">Memuat...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-white/60">{error || "Data tidak ditemukan."}</p>
      </div>
    );
  }

  const {
    profile,
    projects = [],
    skills = [],
    karirs = [],
    pendidikans = [],
    sertifikats = [],
  } = data;

  return (
    <div className="bg-black text-white min-h-screen animate-[fadeIn_0.25s_ease-out]">
      <Sidebar profile={profile} />

      <main className="sm:ml-80 px-6 sm:px-12 pt-28 sm:pt-20">
        {/* HOME */}
        <section
          id="home"
          className="snap-section min-h-[80vh] max-w-4xl mx-auto flex flex-col justify-center scroll-mt-20"
        >
          <p className="text-white/60 text-lg mb-3">Halo, saya</p>
          <h1 className="text-5xl sm:text-7xl font-semibold mb-4">
            {profile?.nama}
          </h1>
          <h2 className="text-2xl sm:text-3xl text-white/70 mb-8">
            {profile?.profesi}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-10 whitespace-pre-line">
            {profile?.deskripsi}
          </p>

          <div className="flex gap-4">
            <a
              href="#projects"
              className="px-7 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors text-base"
            >
              Lihat Project
            </a>
            {profile?.cv && (
              <a
                href={getStorageUrl(profile.cv)}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors text-base"
              >
                Download CV
              </a>
            )}
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="snap-section min-h-screen flex flex-col justify-center py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-10 max-w-4xl mx-auto w-full">
            Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-white/40 text-base max-w-4xl mx-auto w-full">
              Belum ada project.
            </p>
          ) : (
            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-4">
              {projects.map((p) => {
                const thumbnail = p.gambars?.[0]?.gambar;
                return (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    className="shrink-0 w-96 snap-start overflow-hidden group"
                  >
                    <div className="w-full h-64 bg-white/5 flex items-center justify-center text-white/20 text-sm overflow-hidden">
                      {thumbnail ? (
                        <img
                          src={getStorageUrl(thumbnail)}
                          alt={p.nama}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        />
                      ) : (
                        "Gambar Project"
                      )}
                    </div>
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-xl">{p.nama}</h3>
                        <span className="text-xs text-white/40 uppercase">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 line-clamp-2 whitespace-pre-line">
                        {p.deskripsi}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="snap-section min-h-screen flex flex-col justify-center py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-10 max-w-4xl mx-auto w-full">
            Skills
          </h2>
          {skills.length === 0 ? (
            <p className="text-white/40 text-base max-w-4xl mx-auto w-full">
              Belum ada skill.
            </p>
          ) : (
            <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-4">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="shrink-0 snap-start text-xl text-white/70 hover:text-white transition-colors whitespace-nowrap"
                >
                  {s.nama}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* KARIR */}
        <section
          id="karir"
          className="snap-section min-h-screen flex flex-col justify-center py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-10 max-w-4xl mx-auto w-full">
            Jenjang Karir
          </h2>
          {karirs.length === 0 ? (
            <p className="text-white/40 text-base max-w-4xl mx-auto w-full">
              Belum ada riwayat karir.
            </p>
          ) : (
            <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-4">
              {karirs.map((k) => (
                <div key={k.id} className="shrink-0 w-80 snap-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-white mb-3" />
                  <p className="text-sm text-white/40 mb-1">
                    {formatDate(k.tanggal_mulai)} —{" "}
                    {k.tanggal_selesai
                      ? formatDate(k.tanggal_selesai)
                      : "sekarang"}
                  </p>
                  <h3 className="font-medium text-xl">{k.jabatan}</h3>
                  <p className="text-base text-white/60">{k.perusahaan}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PENDIDIKAN */}
        <section
          id="pendidikan"
          className="snap-section min-h-screen flex flex-col justify-center py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-10 max-w-4xl mx-auto w-full">
            Pendidikan
          </h2>
          {pendidikans.length === 0 ? (
            <p className="text-white/40 text-base max-w-4xl mx-auto w-full">
              Belum ada riwayat pendidikan.
            </p>
          ) : (
            <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-4">
              {pendidikans.map((p) => (
                <div key={p.id} className="shrink-0 w-80 snap-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-white mb-3" />
                  <p className="text-sm text-white/40 mb-1">
                    {formatDate(p.tanggal_mulai)} —{" "}
                    {p.tanggal_selesai
                      ? formatDate(p.tanggal_selesai)
                      : "sekarang"}
                  </p>
                  <h3 className="font-medium text-xl">{p.nama}</h3>
                  <p className="text-base text-white/60">
                    {p.jurusan} · {p.jenjang}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SERTIFIKAT */}
        <section
          id="sertifikat"
          className="snap-section min-h-screen flex flex-col justify-center py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-10 max-w-4xl mx-auto w-full">
            Sertifikat
          </h2>
          {sertifikats.length === 0 ? (
            <p className="text-white/40 text-base max-w-4xl mx-auto w-full">
              Belum ada sertifikat.
            </p>
          ) : (
            <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-4">
              {sertifikats.map((s) => (
                <a
                  key={s.id}
                  href={getStorageUrl(s.file_sertifikat)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 w-80 snap-start block hover:opacity-70 transition-opacity"
                >
                  <h3 className="font-medium mb-2 text-lg">
                    {s.nama_sertifikat}
                  </h3>
                  <p className="text-sm text-white/60 mb-3">
                    {s.lembaga_penerbit}
                  </p>
                  <p className="text-xs text-white/40 mb-3">
                    Terbit {formatDate(s.tanggal_terbit)} · s/d{" "}
                    {formatDate(s.tanggal_kadaluarsa)}
                  </p>
                  <span className="text-sm text-white/50 underline">
                    Lihat dokumen
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="snap-section min-h-screen flex flex-col justify-center max-w-4xl mx-auto py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-4xl font-semibold mb-8">Contact</h2>
          <p className="text-white/60 text-lg mb-8">
            Tertarik kolaborasi atau sekadar say hi? Hubungi saya lewat:
          </p>
          <div className="flex flex-wrap gap-5 text-base">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-6 py-3 border border-white/20 hover:border-white transition-colors"
              >
                Email
              </a>
            )}
            {profile?.github && (
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-white/20 hover:border-white transition-colors"
              >
                GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-white/20 hover:border-white transition-colors"
              >
                LinkedIn
              </a>
            )}
            {profile?.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-white/20 hover:border-white transition-colors"
              >
                Instagram
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="sm:ml-80 text-center text-white/30 text-sm py-10 border-t border-white/10">
        © {new Date().getFullYear()} {profile?.nama}
      </footer>
    </div>
  );
}
