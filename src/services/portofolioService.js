import api from "./api";

export const portofolioService = {
  get: async () => {
    const res = await api.get("/portofolio");
    return res.data;
  },
};
