import api, { buildFormData } from "./api";

export const profileService = {
  get: async () => {
    const res = await api.get("/profile");
    return res.data.data;
  },

  create: async (payload) => {
    const formData = buildFormData(payload);
    const res = await api.post("/profile", formData);
    return res.data.data;
  },

  update: async (id, payload) => {
    const formData = buildFormData(payload);
    const res = await api.put(`/profile/${id}`, formData);
    return res.data.data;
  },
};
