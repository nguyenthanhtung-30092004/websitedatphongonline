import { useState } from "react";

import { Deposit } from "@/types/deposit";
import { message } from "antd";
import {
  getDatCocByBookingId,
  taoDatCoc,
  TaoDatCocPayload,
} from "@/services/api/deposit.api";

export const useDeposit = () => {
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH ===== */
  const fetchDepositByBooking = async (bookingId: number) => {
    setLoading(true);
    try {
      const data = await getDatCocByBookingId(bookingId);
      setDeposit(data);
      return data;
    } catch {
      setDeposit(null);
    } finally {
      setLoading(false);
    }
  };

  /* ===== CREATE ===== */
  const createDeposit = async (payload: TaoDatCocPayload) => {
    try {
      const res = await taoDatCoc(payload);
      window.location.href = res.urlThanhToan; // 🔥 redirect VNPay
    } catch {
      message.error("Không thể tạo giao dịch đặt cọc");
    }
  };

  return {
    deposit,
    loading,
    fetchDepositByBooking,
    createDeposit,
  };
};
