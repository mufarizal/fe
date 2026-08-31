import api, { buildFormData } from "./api";

export const skillService = {
  getAll: async () => {
    const res = await api.get("/skill");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/skill/${id}`);
    return res.data.data;
  },

  create: async (payload) => {
    const formData = buildFormData(payload);
    const res = await api.post("/skill", formData);
    return res.data.data;
  },

  update: async (id, payload) => {
    const formData = buildFormData(payload);
    const res = await api.put(`skill/${id}`, formData);
    return res.data.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/skill/${id}`);
    return res.data.message;
  },
};
