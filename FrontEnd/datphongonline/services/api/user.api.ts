import api from "./axios";

export const userApi = {
  getUsers: (params?: { isLocked?: boolean; role?: string }) =>
    api.get("/api/user", { params }),

  updateUser: (id: number, data: any) => api.put(`/api/user/${id}`, data),

  activate: (id: number) => api.put(`/api/user/${id}/activate`),

  deactivate: (id: number) => api.put(`/api/user/${id}/deactivate`),
};
