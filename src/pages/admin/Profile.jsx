import { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import FileInput from "../../components/common/FileInput";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const emptyForm = {
  nama: "",
  profesi: "",
  deskripsi: "",
  email: "",
  instagram: "",
  linkedin: "",
  github: "",
};

export default function Profile() {
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [foto, setFoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [currentFoto, setCurrentFoto] = useState(null);
  const [currentCv, setCurrentCv] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.get();
      if (data) {
        setProfileId(data.id);
        setForm({
          nama: data.nama || "",
          profesi: data.profesi || "",
          deskripsi: data.deskripsi || "",
          email: data.email || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
        });
        setCurrentFoto(data.foto);
        setCurrentCv(data.cv);
      }
    } catch (err) {
      // 404 wajar kalau profile belum pernah dibuat — biarkan form kosong (mode create)
      if (err.response?.status !== 404) {
        setError("Gagal memuat data profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = { ...form };
    if (foto) payload.foto = foto;
    if (cv) payload.cv = cv;

    try {
      if (profileId) {
        const updated = await profileService.update(profileId, payload);
        setMessage("Profile berhasil diperbarui.");
        setCurrentFoto(updated.foto);
        setCurrentCv(updated.cv);
      } else {
        const created = await profileService.create(payload);
        setProfileId(created.id);
        setMessage("Profile berhasil dibuat.");
        setCurrentFoto(created.foto);
        setCurrentCv(created.cv);
      }
      setFoto(null);
      setCv(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-black/60">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
          <Input
            label="Profesi"
            name="profesi"
            value={form.profesi}
            onChange={handleChange}
          />
          <Textarea
            label="Deskripsi"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
          />
          <Input
            label="LinkedIn"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
          />
          <Input
            label="GitHub"
            name="github"
            value={form.github}
            onChange={handleChange}
          />

          <FileInput
            label="Foto"
            name="foto"
            accept="image/*"
            currentFile={currentFoto}
            onChange={(e) => setFoto(e.target.files[0])}
          />
          <FileInput
            label="CV (PDF)"
            name="cv"
            accept="application/pdf"
            currentFile={currentCv}
            onChange={(e) => setCv(e.target.files[0])}
          />

          {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
