import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { skillService } from "../../../services/skillService";
import { getStorageUrl } from "../../../utils/formatUrl";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function SkillList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await skillService.getAll());
    } catch {
      setError("Gagal memuat data skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus skill ini?")) return;
    try {
      await skillService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Gagal menghapus.");
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Skill</h1>
        <Link to="/admin/skill/new">
          <Button>+ Tambah Skill</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-black/60">Belum ada skill.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col items-center text-center"
            >
              {item.icon && (
                <img
                  src={getStorageUrl(item.icon)}
                  alt={item.nama}
                  className="w-10 h-10 object-contain mb-2"
                />
              )}
              <p className="font-medium text-sm mb-3">{item.nama}</p>
              <div className="flex gap-2 w-full">
                <Link to={`/admin/skill/${item.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="solid"
                  className="flex-1"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
