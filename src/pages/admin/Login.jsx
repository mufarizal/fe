import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login(form.email, form.password);
      login(res.user, res.access_token);
      navigate("/admin/dashboard");
    } catch (err) {
      // Response 401 dari API: { error: "Email atau password salah" }
      const message = err.response?.data?.error || "Login gagal, coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-black mb-1">Admin Login</h1>
        <p className="text-sm text-black/60 mb-6">
          Masuk untuk kelola portofolio
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <Button
            type="submit"
            variant="solid"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
