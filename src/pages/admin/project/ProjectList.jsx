import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../../../services/projectService";
import { getStorageUrl } from "../../../utils/formatUrl";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal memuat data project.";
      setError(`${msg}${err.response?.status ? ` (${err.response.status})` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus project ini?")) return;
    try {
      await projectService.remove(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal menghapus project.";
      alert(`${msg}${err.response?.status ? ` (${err.response.status})` : ""}`);
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Project</h1>
        <Link to="/admin/project/new">
          <Button>+ Project Baru</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {projects.length === 0 ? (
        <p className="text-black/60">Belum ada project.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const first = project.gambars?.[0];
            const thumbnail =
              typeof first === "string" ? first : first?.gambar;
            return (
              <Card key={project.id} className="flex flex-col">
                {thumbnail && (
                  <img
                    src={getStorageUrl(thumbnail)}
                    alt={project.nama}
                    className="w-full h-36 object-cover mb-3 border border-black/10"
                  />
                )}
                <h3 className="font-semibold">{project.nama}</h3>
                <span className="text-xs text-black/60 mb-3">
                  {project.status}
                </span>

                <div className="mt-auto flex gap-2 pt-3">
                  <Link to={`/admin/project/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="solid"
                    className="flex-1"
                    onClick={() => handleDelete(project.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
