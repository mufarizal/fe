import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sertifikatService } from "../../../services/sertifikatService";
import { formatDate } from "../../../utils/formatDate";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function SertifikatList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await sertifikatService.getAll());
    } catch {
      setError("Gagal memuat data sertifikat.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus sertifikat ini?")) return;
    try {
      await sertifikatService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Gagal menghapus.");
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sertifikat</h1>
        <Link to="/admin/sertifikat/new">
          <Button>+ Tambah Sertifikat</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-black/60">Belum ada sertifikat.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.nama_sertifikat}</h3>
                <p className="text-sm text-black/60">{item.lembaga_penerbit}</p>
                <p className="text-xs text-black/40">
                  Terbit {formatDate(item.tanggal_terbit)} · Kadaluarsa{" "}
                  {formatDate(item.tanggal_kadaluarsa)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/sertifikat/${item.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button variant="solid" onClick={() => handleDelete(item.id)}>
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
