import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sertifikatService } from "../../../services/sertifikatService";
import Input from "../../../components/common/Input";
import FileInput from "../../../components/common/FileInput";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

const emptyForm = {
  nama_sertifikat: "",
  lembaga_penerbit: "",
  tanggal_terbit: "",
  tanggal_kadaluarsa: "",
};

export default function SertifikatForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    try {
      const data = await sertifikatService.getById(id);
      setForm({
        nama_sertifikat: data.nama_sertifikat || "",
        lembaga_penerbit: data.lembaga_penerbit || "",
        tanggal_terbit: data.tanggal_terbit || "",
        tanggal_kadaluarsa: data.tanggal_kadaluarsa || "",
      });
      setCurrentFile(data.file_sertifikat);
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...form };
    if (file) payload.file_sertifikat = file;

    try {
      if (isEdit) {
        await sertifikatService.update(id, payload);
      } else {
        await sertifikatService.create(payload);
      }
      navigate("/admin/sertifikat");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Sertifikat" : "Tambah Sertifikat"}
      </h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Sertifikat"
            name="nama_sertifikat"
            value={form.nama_sertifikat}
            onChange={handleChange}
            required
          />
          <Input
            label="Lembaga Penerbit"
            name="lembaga_penerbit"
            value={form.lembaga_penerbit}
            onChange={handleChange}
            required
          />
          <Input
            label="Tanggal Terbit"
            type="date"
            name="tanggal_terbit"
            value={form.tanggal_terbit}
            onChange={handleChange}
            required
          />
          <Input
            label="Tanggal Kadaluarsa"
            type="date"
            name="tanggal_kadaluarsa"
            value={form.tanggal_kadaluarsa}
            onChange={handleChange}
            required
          />
          <FileInput
            label="File Sertifikat (PDF/gambar)"
            name="file_sertifikat"
            accept=".pdf,image/*"
            currentFile={currentFile}
            onChange={(e) => setFile(e.target.files[0])}
          />

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
