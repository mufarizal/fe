import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">
        Selamat datang, {user?.name}
      </h1>
      <p className="text-black/60">
        Pilih menu di samping untuk kelola konten portofolio.
      </p>
    </div>
  );
}
