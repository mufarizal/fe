import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { skillService } from "../../../services/skillService";
import Input from "../../../components/common/Input";
import FileInput from "../../../components/common/FileInput";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

export default function SkillForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [icon, setIcon] = useState(null);
  const [currentIcon, setCurrentIcon] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) load();
  }, [id]);

  const load = async () => {
    try {
      const data = await skillService.getById(id);
      setNama(data.nama || "");
      setCurrentIcon(data.icon);
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { nama };
    if (icon) payload.icon = icon;

    try {
      if (isEdit) {
        await skillService.update(id, payload);
      } else {
        await skillService.create(payload);
      }
      navigate("/admin/skill");
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
        {isEdit ? "Edit Skill" : "Tambah Skill"}
      </h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Skill"
            name="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
          <FileInput
            label="Icon"
            name="icon"
            accept="image/*,.svg"
            currentFile={currentIcon}
            onChange={(e) => setIcon(e.target.files[0])}
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
