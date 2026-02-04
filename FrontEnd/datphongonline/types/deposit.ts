// src/types/deposit.ts
export type DepositStatus = "ChoThanhToan" | "DaThanhToan" | "ThatBai";

export interface Deposit {
  id: number;
  bookingId: number;
  soTienDatCoc: number;
  trangThai: DepositStatus;
  thoiGianThanhToan?: string;
  maGiaoDichVNPay: string;
}
