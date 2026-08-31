import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pendidikanService } from "../../../services/pendidikanService";
import { formatDate } from "../../../utils/formatDate";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function PendidikanList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await pendidikanService.getAll());
    } catch {
      setError("Gagal memuat data pendidikan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus riwayat pendidikan ini?")) return;
    try {
      await pendidikanService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Gagal menghapus.");
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Jenjang Pendidikan</h1>
        <Link to="/admin/pendidikan/new">
          <Button>+ Tambah Pendidikan</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-black/60">Belum ada data pendidikan.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.nama}</h3>
                <p className="text-sm text-black/60">
                  {item.jurusan} · {item.jenjang} · {item.status}
                </p>
                <p className="text-xs text-black/40">
                  {formatDate(item.tanggal_mulai, item.tanggal_selesai)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/pendidikan/${item.id}`}>
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
