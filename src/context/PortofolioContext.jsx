import { createContext, useContext, useEffect, useState } from "react";
import { portofolioService } from "../services/portofolioService";

const PortofolioContext = createContext(null);

export function PortofolioProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await portofolioService.get();
      setData(res);
    } catch {
      setError("Gagal memuat data portofolio. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortofolioContext.Provider value={{ data, loading, error }}>
      {children}
    </PortofolioContext.Provider>
  );
}

export const usePortofolio = () => useContext(PortofolioContext);
