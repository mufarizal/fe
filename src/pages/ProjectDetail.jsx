import { useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const dummyProjects = {
  1: {
    nama: "Sistem Manajemen Inventaris",
    deskripsi: "Aplikasi web untuk kelola stok barang gudang secara real-time.",
    fitur: "Kelola stok, Notifikasi, Laporan PDF",
    status: "selesai",
    tanggal_mulai: "2024-01-01",
    tanggal_selesai: "2024-04-01",
    link_github: "#",
    link_demo: "#",
    gambars: [],
  },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = dummyProjects[id];

  // useLayoutEffect jalan SEBELUM browser paint -> gak ada momen kelihatan posisi scroll lama
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBack = () => {
    navigate("/preview");
  };

  if (!project) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-white/60">Project tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen animate-[fadeIn_0.25s_ease-out]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={handleBack}
          className="text-sm text-white/50 hover:text-white mb-8 inline-block transition-colors"
        >
          ← Kembali
        </button>

        <div className="w-full h-64 bg-white/5 flex items-center justify-center text-white/20 text-sm mb-8">
          {project.gambars?.[0]?.gambar ? (
            <img
              src={project.gambars[0].gambar}
              alt={project.nama}
              className="w-full h-full object-cover"
            />
          ) : (
            "Gambar Project"
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{project.nama}</h1>
          <span className="text-xs text-white/40 uppercase border border-white/20 px-2 py-1">
            {project.status}
          </span>
        </div>

        <p className="text-white/60 leading-relaxed mb-6">
          {project.deskripsi}
        </p>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/80 mb-2">Fitur</h3>
          <p className="text-sm text-white/60">{project.fitur}</p>
        </div>

        <p className="text-xs text-white/40 mb-8">
          {project.tanggal_mulai} — {project.tanggal_selesai}
        </p>

        <div className="flex gap-3">
          <a
            href={project.link_github}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 border border-white/30 hover:border-white transition-colors text-sm"
          >
            GitHub
          </a>
          <a
            href={project.link_demo}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 border border-white/30 hover:border-white transition-colors text-sm"
          >
            Live Demo
          </a>
        </div>

        {project.gambars?.length > 1 && (
          <div className="grid grid-cols-3 gap-2 mt-10">
            {project.gambars.slice(1).map((g) => (
              <img
                key={g.id}
                src={g.gambar}
                alt=""
                className="w-full h-24 object-cover border border-white/10"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
