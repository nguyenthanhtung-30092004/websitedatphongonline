import api from "./axios";

/* ===== TYPES ===== */
export interface TaoDatCocPayload {
  bookingId: number;
  phanTramDatCoc: number;
}

export interface DepositResponse {
  id: number;
  soTienDatCoc: number;
  phanTramDatCoc: number;
  trangThai: number;
  urlThanhToan?: string;
  thoiGianTao: string;
}

/* ===== CREATE DEPOSIT ===== */
export const taoDatCoc = async (payload: TaoDatCocPayload) => {
  const res = await api.post("/api/datcoc", payload);
  return res.data as { urlThanhToan: string };
};

/* ===== GET DEPOSIT BY BOOKING ===== */
export const getDatCocByBookingId = async (bookingId: number) => {
  const res = await api.get(`/api/datcoc/booking/${bookingId}`);
  console.log(res.data);
  return res.data;
};
