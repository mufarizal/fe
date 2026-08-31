import api from "./api";

export const pendidikanService = {
  getAll: async () => {
    const res = await api.get("/pendidikan");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/pendidikan/${id}`);
    return res.data.data;
  },

  create: async (payload) => {
    const res = await api.post("/pendidikan", payload);
    return res.data.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/pendidikan/${id}`, payload);
    return res.data.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/pendidikan/${id}`);
    return res.data.message;
  },
};
