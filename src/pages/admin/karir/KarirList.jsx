import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { karirService } from "../../../services/karirService";
import { formatDate } from "../../../utils/formatDate";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function KarirList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await karirService.getAll());
    } catch {
      setError("Gagal memuat data karir.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus riwayat karir ini?")) return;
    try {
      await karirService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Gagal menghapus.");
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Jenjang Karir</h1>
        <Link to="/admin/karir/new">
          <Button>+ Tambah Karir</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-black/60">Belum ada data karir.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.jabatan}</h3>
                <p className="text-sm text-black/60">
                  {item.perusahaan} · {item.status}
                </p>
                <p className="text-xs text-black/40">
                  {formatDate(item.tanggal_mulai)} —{" "}
                  {formatDate(item.tanggal_selesai)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/karir/${item.id}`}>
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
