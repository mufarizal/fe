import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { karirService } from "../../../services/karirService";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

const emptyForm = {
  perusahaan: "",
  jabatan: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
  status: "",
};

export default function KarirForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    try {
      const data = await karirService.getById(id);
      setForm({
        perusahaan: data.perusahaan || "",
        jabatan: data.jabatan || "",
        deskripsi: data.deskripsi || "",
        tanggal_mulai: data.tanggal_mulai || "",
        tanggal_selesai: data.tanggal_selesai || "",
        status: data.status || "",
      });
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
    try {
      if (isEdit) {
        await karirService.update(id, form);
      } else {
        await karirService.create(form);
      }
      navigate("/admin/karir");
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
        {isEdit ? "Edit Karir" : "Tambah Karir"}
      </h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Perusahaan"
            name="perusahaan"
            value={form.perusahaan}
            onChange={handleChange}
          />
          <Input
            label="Jabatan"
            name="jabatan"
            value={form.jabatan}
            onChange={handleChange}
          />
          <Textarea
            label="Deskripsi"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
          />
          <Input
            label="Tanggal Mulai"
            type="date"
            name="tanggal_mulai"
            value={form.tanggal_mulai}
            onChange={handleChange}
          />
          <Input
            label="Tanggal Selesai"
            type="date"
            name="tanggal_selesai"
            value={form.tanggal_selesai}
            onChange={handleChange}
          />
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["aktif", "tidak aktif"]}
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
