import { useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePortofolio } from "../../context/PortofolioContext";
import { getStorageUrl } from "../../utils/formatUrl";
import { formatDate } from "../../utils/formatDate";
import Sidebar from "../../components/guest/Sidebar";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = usePortofolio();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBack = () => navigate("/");

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
        <p className="text-white/60">{error}</p>
      </div>
    );
  }

  const project = data.projects?.find((p) => String(p.id) === String(id));

  if (!project) {
    return (
      <div className="bg-black text-white min-h-screen flex">
        <Sidebar profile={data.profile} />
        <div className="sm:ml-64 flex-1 flex items-center justify-center">
          <p className="text-white/60">Project tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen animate-[fadeIn_0.25s_ease-out]">
      <Sidebar profile={data.profile} />

      <main className="sm:ml-80 px-6 sm:px-12 pt-28 sm:pt-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="text-base text-white/50 hover:text-white mb-10 inline-block transition-colors"
          >
            ← Kembali
          </button>

          <div className="w-full h-72 sm:h-80 bg-white/5 flex items-center justify-center text-white/20 text-base mb-10 overflow-hidden">
            {project.gambars?.[0]?.gambar ? (
              <img
                src={getStorageUrl(project.gambars[0].gambar)}
                alt={project.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              "Gambar Project"
            )}
          </div>

          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-semibold">{project.nama}</h1>
            <span className="text-xs text-white/40 uppercase px-3 py-1.5">
              {project.status}
            </span>
          </div>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            {project.deskripsi}
          </p>

          {project.fitur && (
            <div className="mb-8">
              <h3 className="text-base font-medium text-white/80 mb-3">
                Fitur
              </h3>
              <p className="text-base text-white/60">{project.fitur}</p>
            </div>
          )}

          <p className="text-sm text-white/40 mb-10">
            {formatDate(project.tanggal_mulai)} —{" "}
            {formatDate(project.tanggal_selesai)}
          </p>

          <div className="flex gap-4">
            {project.link_github && (
              <a
                href={project.link_github}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 border border-white/30 hover:border-white transition-colors text-base"
              >
                GitHub
              </a>
            )}
            {project.link_demo && (
              <a
                href={project.link_demo}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 border border-white/30 hover:border-white transition-colors text-base"
              >
                Live Demo
              </a>
            )}
          </div>

          {project.gambars?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar mt-12 pb-2">
              {project.gambars.slice(1).map((g) => (
                <img
                  key={g.id}
                  src={getStorageUrl(g.gambar)}
                  alt=""
                  className="shrink-0 w-48 h-36 object-cover border border-white/10"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
