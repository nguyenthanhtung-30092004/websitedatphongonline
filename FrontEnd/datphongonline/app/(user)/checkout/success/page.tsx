"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Result, Divider, Spin, Tag } from "antd";
import {
  CheckCircleFilled,
  HomeOutlined,
  PrinterOutlined,
  WalletOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { useBooking } from "@/hooks/useBooking";
import { useDeposit } from "@/hooks/useDeposit";
import { BookingResponse } from "@/types/booking";
import { Deposit } from "@/types/deposit";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getBookingById } = useBooking();
  const { fetchDepositByBooking } = useDeposit();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. CHẨN ĐOÁN ID TỪ URL
  const vnpRef = searchParams.get("vnp_TxnRef");
  const bIdParam = searchParams.get("bookingId");
  const localId =
    typeof window !== "undefined"
      ? localStorage.getItem("latest_booking_id")
      : null;

  const bookingIdRaw = bIdParam || vnpRef || localId;

  useEffect(() => {
    console.log("--- DEBUG CHECKOUT SUCCESS ---");
    console.log("ID từ vnp_TxnRef:", vnpRef);
    console.log("ID từ bookingId:", bIdParam);
    console.log("ID từ LocalStorage:", localId);

    const loadData = async () => {
      if (!bookingIdRaw) {
        console.error("Không tìm thấy bất kỳ ID nào!");
        setLoading(false);
        return;
      }

      try {
        const id = Number(bookingIdRaw);
        // Thử lấy dữ liệu đơn hàng
        const data = await getBookingById(id);
        setBooking(data);

        // Thử lấy dữ liệu đặt cọc (có thể chậm hơn 1 chút do Backend xử lý IPN)
        const depData = await fetchDepositByBooking(id).catch(() => null);
        setDeposit(depData);

        // Xóa ID tạm sau khi đã load thành công
        localStorage.removeItem("latest_booking_id");
      } catch (err) {
        console.error("Lỗi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingIdRaw]);

  const remainAmount = useMemo(() => {
    if (!booking) return 0;
    return booking.totalPrice - (deposit?.soTienDatCoc || 0);
  }, [booking, deposit]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (!booking) {
    return (
      <Result
        status="warning"
        title="Đang cập nhật trạng thái đơn hàng"
        subTitle="Hệ thống đang xử lý thanh toán. Vui lòng chờ trong giây lát hoặc kiểm tra Lịch sử đặt phòng."
        extra={
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        }
      />
    );
  }

  return (
    <main className="bg-[#f3f1ee] min-h-screen py-20">
      <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-12 shadow-xl">
        <div className="text-center mb-8">
          <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
          <h2 className="text-3xl font-bold">Thanh toán hoàn tất!</h2>
          <p className="text-gray-500 italic">Mã đơn: #{booking.id}</p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <WalletOutlined /> Chi tiết tiền nong
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tổng tiền:</span>
              <span className="font-semibold">
                {booking.totalPrice.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Đã cọc (30%):</span>
              <span>-{(deposit?.soTienDatCoc || 0).toLocaleString()}đ</span>
            </div>
            <Divider />
            <div className="flex justify-between text-xl font-bold text-[#b89655]">
              <span>Còn lại:</span>
              <span>{remainAmount.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <p className="text-gray-400 uppercase font-bold text-[10px]">
              Nhận phòng
            </p>
            <p className="font-semibold">
              {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
            </p>
          </div>
          <div>
            <p className="text-gray-400 uppercase font-bold text-[10px]">
              Trả phòng
            </p>
            <p className="font-semibold">
              {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            block
            size="large"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            In hóa đơn
          </Button>
          <Button
            block
            size="large"
            type="primary"
            className="bg-[#b89655]"
            icon={<HomeOutlined />}
            onClick={() => router.push("/rooms")}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </main>
  );
}
