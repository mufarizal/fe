import api from "./api";

export const karirService = {
  getAll: async () => {
    const res = await api.get("/karir");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/karir/${id}`);
    return res.data.data;
  },

  create: async (payload) => {
    const res = await api.post("/karir", payload);
    return res.data.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/karir/${id}`, payload);
    return res.data.data;
  },

  remove: async (id) => {
    const res  = await api.delete(`/karir/${id}`);
    return res.data.message;
  }
};
