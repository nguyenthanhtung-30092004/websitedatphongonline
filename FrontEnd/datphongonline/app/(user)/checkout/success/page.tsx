"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Result, Divider, Spin, ConfigProvider, Tag } from "antd";
import {
  CheckCircleFilled,
  HomeOutlined,
  PrinterOutlined,
  WalletOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
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

  // 1. CHẨN ĐOÁN ID TỪ URL (Giữ nguyên logic)
  const vnpRef = searchParams.get("vnp_TxnRef");
  const bIdParam = searchParams.get("bookingId");
  const localId =
    typeof window !== "undefined"
      ? localStorage.getItem("latest_booking_id")
      : null;

  const bookingIdRaw = bIdParam || vnpRef || localId;

  useEffect(() => {
    const loadData = async () => {
      if (!bookingIdRaw) {
        setLoading(false);
        return;
      }

      try {
        const id = Number(bookingIdRaw);
        const data = await getBookingById(id);
        setBooking(data);

        const depData = await fetchDepositByBooking(id).catch(() => null);
        setDeposit(depData);

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
      <div className="h-screen flex flex-col items-center justify-center bg-[#FCFAF7]">
        <Spin size="large" />
        <p className="mt-4 text-stone-400 font-medium animate-pulse">
          Đang xác thực giao dịch...
        </p>
      </div>
    );

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7] p-6">
        <Result
          status="warning"
          title={
            <span className="text-[#1E3932] font-serif text-2xl">
              Đang cập nhật trạng thái
            </span>
          }
          subTitle="Hệ thống đang xử lý thanh toán. Vui lòng chờ trong giây lát hoặc kiểm tra Lịch sử đặt phòng."
          extra={[
            <Button
              key="reload"
              type="primary"
              className="bg-[#1E3932] border-none rounded-full h-12 px-8"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>,
            <Button
              key="history"
              className="rounded-full h-12 px-8 border-[#1E3932] text-[#1E3932]"
              onClick={() => router.push("/my-bookings")}
            >
              Xem lịch sử
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <main className="bg-[#FCFAF7] min-h-screen py-16 px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#F1DEB4] rounded-full blur-[100px] opacity-30 -z-0" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-green-900/5 overflow-hidden border border-stone-100">
          {/* Top Green Banner */}
          <div className="bg-[#1E3932] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircleFilled className="text-5xl text-[#C9A96A]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                Thanh toán hoàn tất
              </h2>
              <p className="text-[#D4E9E2] font-light tracking-wide uppercase text-xs">
                Mã giao dịch: #{booking.id}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Payment Summary */}
            <div className="bg-[#FCFAF7] rounded-[2rem] p-8 mb-8 border border-stone-100 relative">
              <div className="flex items-center gap-3 text-[#1E3932] font-bold text-xs uppercase tracking-widest mb-6">
                <WalletOutlined className="text-[#C9A96A] text-lg" />
                <span>Chi tiết thanh toán</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-medium">Tổng giá trị đơn:</span>
                  <span className="text-lg font-medium">
                    {booking.totalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-700">
                  <span className="font-medium flex items-center gap-2">
                    Đã đặt cọc (30%){" "}
                    <Tag className="bg-green-100 text-green-700 rounded-full text-[10px]">
                      SUCCESS
                    </Tag>
                  </span>
                  <span className="text-lg font-bold">
                    -{(deposit?.soTienDatCoc || 0).toLocaleString()}đ
                  </span>
                </div>

                <Divider className="my-6 border-stone-200" />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1">
                      Số tiền còn lại thanh toán tại quầy
                    </p>
                    <p className="text-3xl font-bold text-[#1E3932] leading-none">
                      {remainAmount.toLocaleString()}đ
                    </p>
                  </div>
                  <div className="text-right">
                    <SafetyCertificateOutlined className="text-2xl text-[#C9A96A]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10 px-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <CalendarOutlined className="text-[#C9A96A]" /> Nhận phòng
                </div>
                <p className="text-lg font-serif text-[#1E3932]">
                  {dayjs(booking.checkInDate).format("DD MMM, YYYY")}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <CalendarOutlined className="text-[#C9A96A]" /> Trả phòng
                </div>
                <p className="text-lg font-serif text-[#1E3932]">
                  {dayjs(booking.checkOutDate).format("DD MMM, YYYY")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1E3932",
                  borderRadius: 16,
                },
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  block
                  size="large"
                  className="h-14 font-bold text-[#1E3932] border-stone-200 hover:border-[#1E3932] hover:text-[#1E3932] transition-all flex items-center justify-center gap-2"
                  icon={<PrinterOutlined />}
                  onClick={() =>
                    typeof window !== "undefined" && window.print()
                  }
                >
                  In hóa đơn
                </Button>
                <Button
                  block
                  size="large"
                  type="primary"
                  className="h-14 font-bold shadow-xl shadow-green-900/10 flex items-center justify-center gap-2 group"
                  icon={<HomeOutlined />}
                  onClick={() => router.push("/rooms")}
                >
                  Tiếp tục khám phá
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </ConfigProvider>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center mt-8 text-stone-400 text-sm font-light">
          Một email xác nhận đã được gửi đến địa chỉ của bạn. <br />
          Cảm ơn bạn đã lựa chọn trải nghiệm cùng chúng tôi.
        </p>
      </div>
    </main>
  );
}
