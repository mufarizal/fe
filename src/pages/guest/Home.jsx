import { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { portofolioService } from "../../services/portofolioService";
import { getStorageUrl } from "../../utils/formatUrl";
import Navbar from "../../components/guest/Navbar";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

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

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await portofolioService.get();
      setData(res);
    } catch {
      setError("Gagal memuat data portofolio. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

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
      <Navbar nama={profile?.nama} />

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
                {profile?.nama}
              </h1>
              <h2 className="text-xl text-white/70 mb-6">{profile?.profesi}</h2>
              <p className="text-white/60 max-w-lg leading-relaxed mb-8">
                {profile?.deskripsi}
              </p>

              <div className="flex gap-3">
                <a
                  href="#projects"
                  className="px-5 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors text-sm"
                >
                  Lihat Project
                </a>
                {profile?.cv && (
                  <a
                    href={getStorageUrl(profile.cv)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors text-sm"
                  >
                    Download CV
                  </a>
                )}
              </div>
            </div>

            <div className="w-40 h-40 sm:w-56 sm:h-56 border border-white/20 flex items-center justify-center text-white/30 text-xs shrink-0 overflow-hidden">
              {profile?.foto ? (
                <img
                  src={getStorageUrl(profile.foto)}
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
          {projects.length === 0 ? (
            <p className="text-white/40 text-sm">Belum ada project.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => {
                const thumbnail = p.gambars?.[0]?.gambar;
                return (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    className="block border border-white/10 hover:border-white/30 transition-colors overflow-hidden"
                  >
                    <div className="w-full h-36 bg-white/5 flex items-center justify-center text-white/20 text-xs overflow-hidden">
                      {thumbnail ? (
                        <img
                          src={getStorageUrl(thumbnail)}
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
          )}
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-8">Skills</h2>
          {skills.length === 0 ? (
            <p className="text-white/40 text-sm">Belum ada skill.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 border border-white/10 px-4 py-3 hover:border-white/30 transition-colors"
                >
                  <div className="w-8 h-8 border border-white/20 flex items-center justify-center text-xs shrink-0 overflow-hidden">
                    {s.icon ? (
                      <img
                        src={getStorageUrl(s.icon)}
                        alt={s.nama}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      s.nama[0]
                    )}
                  </div>
                  <span className="text-sm text-white/80">{s.nama}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* KARIR */}
        <section
          id="karir"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-10">Jenjang Karir</h2>
          {karirs.length === 0 ? (
            <p className="text-white/40 text-sm">Belum ada riwayat karir.</p>
          ) : (
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
          )}
        </section>

        {/* PENDIDIKAN */}
        <section
          id="pendidikan"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-10">Pendidikan</h2>
          {pendidikans.length === 0 ? (
            <p className="text-white/40 text-sm">
              Belum ada riwayat pendidikan.
            </p>
          ) : (
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
          )}
        </section>

        {/* SERTIFIKAT */}
        <section
          id="sertifikat"
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-8">Sertifikat</h2>
          {sertifikats.length === 0 ? (
            <p className="text-white/40 text-sm">Belum ada sertifikat.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {sertifikats.map((s) => (
                <a
                  key={s.id}
                  href={getStorageUrl(s.file_sertifikat)}
                  target="_blank"
                  rel="noreferrer"
                  className="block border border-white/10 p-5 hover:border-white/30 transition-colors"
                >
                  <h3 className="font-medium mb-1">{s.nama_sertifikat}</h3>
                  <p className="text-sm text-white/60 mb-2">
                    {s.lembaga_penerbit}
                  </p>
                  <p className="text-xs text-white/40 mb-3">
                    Terbit {s.tanggal_terbit} · Berlaku s/d{" "}
                    {s.tanggal_kadaluarsa}
                  </p>
                  <span className="text-xs text-white/50 underline">
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
          className="py-24 border-t border-white/10 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold mb-6">Contact</h2>
          <p className="text-white/60 mb-6">
            Tertarik kolaborasi atau sekadar say hi? Hubungi saya lewat:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
              >
                Email
              </a>
            )}
            {profile?.github && (
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
              >
                GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
              >
                LinkedIn
              </a>
            )}
            {profile?.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-white/20 hover:border-white transition-colors"
              >
                Instagram
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="text-center text-white/30 text-xs py-8 border-t border-white/10">
        © {new Date().getFullYear()} {profile?.nama}
      </footer>
    </div>
  );
}
