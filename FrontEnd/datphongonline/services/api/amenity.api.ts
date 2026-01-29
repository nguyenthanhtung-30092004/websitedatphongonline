import api from "./axios";

export const AmenityApi = {
  getAmenitys: () => api.get("/api/amenity"),
  getAmenityById: (id: number | string) => api.get(`/api/amenity/${id}`),
  createAmenity: (data: any) => api.post("/api/amenity", data),
  updateAmenity: (id: number, data: any) => api.put(`/api/amenity/${id}`, data),
  deleteAmenity: (id: number) => api.delete(`/api/amenity/${id}`),
};
