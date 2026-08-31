import api from "./api";

export const authService = {
  login: async (email, password) => {
    const res = await api.post("/login", { email, password });
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/logout");
    return res.data;
  },
};
