import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { getStorageUrl } from "../../utils/formatUrl";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await projectService.getById(id);
      setProject(data);
    } catch {
      setError("Project tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/");

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-white/60">Memuat...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-white/60">{error}</p>
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

        <div className="w-full h-64 bg-white/5 flex items-center justify-center text-white/20 text-sm mb-8 overflow-hidden">
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

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{project.nama}</h1>
          <span className="text-xs text-white/40 uppercase border border-white/20 px-2 py-1">
            {project.status}
          </span>
        </div>

        <p className="text-white/60 leading-relaxed mb-6">
          {project.deskripsi}
        </p>

        {project.fitur && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/80 mb-2">Fitur</h3>
            <p className="text-sm text-white/60">{project.fitur}</p>
          </div>
        )}

        <p className="text-xs text-white/40 mb-8">
          {project.tanggal_mulai} — {project.tanggal_selesai}
        </p>

        <div className="flex gap-3">
          {project.link_github && (
            <a
              href={project.link_github}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 border border-white/30 hover:border-white transition-colors text-sm"
            >
              GitHub
            </a>
          )}
          {project.link_demo && (
            <a
              href={project.link_demo}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 border border-white/30 hover:border-white transition-colors text-sm"
            >
              Live Demo
            </a>
          )}
        </div>

        {project.gambars?.length > 1 && (
          <div className="grid grid-cols-3 gap-2 mt-10">
            {project.gambars.slice(1).map((g) => (
              <img
                key={g.id}
                src={getStorageUrl(g.gambar)}
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
