import api, { buildFormData } from "./api";

export const projectService = {
  getAll: async () => {
    const res = await api.get("/project");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/project/${id}`);
    return res.data.data;
  },

  create: async (payload) => {
    const formData = buildFormData(payload);
    const res = await api.post("/project", formData);
    return res.data.data;
  },

  update: async (id, payload) => {
    const formData = buildFormData(payload, true);
    const res = await api.post(`/project/${id}`, formData);
    return res.data.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/project/${id}`);
    return res.data.message;
  },

  addGambar: async (projectId, files) => {
    const formData = buildFormData({ gambar: files });
    const res = await api.post(`/project/${projectId}/gambar`, formData);
    return res.data.data;
  },

  removeGambar: async (gambarId) => {
    const res = await api.delete(`/project/gambar/${gambarId}`);
    return res.data.message;
  },
};
