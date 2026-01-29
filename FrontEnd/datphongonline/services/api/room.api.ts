import api from "./axios";

export const RoomApi = {
  getRooms: () => api.get("/api/room"),
  getRoomById: (id: number | string) => api.get(`/api/room/${id}`),
  createRoom: (data: any) => api.post("/api/room", data),
  updateRoom: (id: number, data: any) => api.put(`/api/room/${id}`, data),
  deleteRoom: (id: number) => api.delete(`/api/room/${id}`),
};
