import api from "./axios";

export const roomTypeApi = {
  getRoomTypes: () => api.get("/api/roomtype"),
  getRoomTypeById: (id: number | string) => api.get(`/api/roomtype/${id}`),
  createRoomType: (data: any) => api.post("/api/roomtype", data),
  updateRoomType: (id: number, data: any) =>
    api.put(`/api/roomtype/${id}`, data),
  deleteRoomType: (id: number) => api.delete(`/api/roomtype/${id}`),
};
