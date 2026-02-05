"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, message, Table, ConfigProvider } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  WalletOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { useAuths } from "@/hooks/useAuths";
import { useBooking } from "@/hooks/useBooking";
import { BookingResponse } from "@/types/booking";
import { useDeposit } from "@/hooks/useDeposit";
import { Deposit, DepositStatus } from "@/types/deposit";

/* ================= CONSTANTS ================= */
const BOOKING_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  CANCELED: 3,
};

const BOOKING_STATUS_TEXT: Record<number, string> = {
  [BOOKING_STATUS.PENDING]: "Chờ xác nhận",
  [BOOKING_STATUS.CONFIRMED]: "Đã xác nhận",
  [BOOKING_STATUS.COMPLETED]: "Hoàn thành",
  [BOOKING_STATUS.CANCELED]: "Đã hủy",
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { getBookingById } = useBooking();
  const { user, loading: authLoading } = useAuths();
  const { createDeposit, fetchDepositByBooking } = useDeposit();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/my-bookings/${id}`);
    }
  }, [authLoading, user, router, id]);

  useEffect(() => {
    if (user && id) {
      fetchDetail();
      fetchDeposit();
    }
  }, [user, id]);

  /* ================= DATA FETCHING ================= */
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await getBookingById(Number(id));
      setBooking(data);
    } catch {
      message.error("Không thể tải chi tiết hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeposit = async () => {
    try {
      const data = await fetchDepositByBooking(Number(id));
      setDeposit(data);
    } catch {
      setDeposit(null);
    }
  };

  const handleCreateDeposit = async () => {
    try {
      await createDeposit({
        bookingId: Number(id),
        phanTramDatCoc: 30,
      });
      message.success("Tạo yêu cầu đặt cọc thành công");
      fetchDeposit();
    } catch {
      message.error("Không thể tạo đặt cọc");
    }
  };

  /* ================= COMPUTED VALUES ================= */
  const isCompleted = useMemo(
    () => booking?.status === BOOKING_STATUS.COMPLETED,
    [booking],
  );

  const remainAmount = useMemo(() => {
    if (!booking) return 0;
    // Nếu đã hoàn thành -> Số tiền cần thu thêm = 0
    if (isCompleted) return 0;

    if (!deposit || deposit.trangThai !== "DaThanhToan")
      return booking.totalPrice;
    return Math.max(0, booking.totalPrice - deposit.soTienDatCoc);
  }, [booking, deposit, isCompleted]);

  /* ================= UI HELPERS ================= */
  const depositStatusTag = (status: DepositStatus) => {
    const configs = {
      ChoThanhToan: {
        class: "bg-amber-50 text-amber-600 border-amber-100",
        label: "Chờ thanh toán",
      },
      DaThanhToan: {
        class: "bg-[#D4E9E2] text-[#1E3932] border-[#2D4F3C]/10",
        label: "Đã thanh toán",
      },
      ThatBai: {
        class: "bg-rose-50 text-rose-600 border-rose-100",
        label: "Thất bại",
      },
    };
    const config = configs[status];
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  /* ================= RENDERING ================= */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center">
        <Spin size="large" />
        <p className="mt-4 text-[#2D4F3C] font-medium italic animate-pulse">
          Đang chuẩn bị không gian của bạn...
        </p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <main className="bg-[#FCFAF7] min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[500px] bg-[#D4E9E2]/20 rounded-bl-[200px] -z-0" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-[#1E3932] mb-8 font-medium group transition-all"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách đơn đặt
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E3932]/5 rounded-full mb-3">
              <CheckCircleOutlined className="text-[#C9A96A] text-[10px]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E3932]">
                Chi tiết đặt phòng
              </span>
            </div>
            <h1 className="text-4xl font-serif text-[#1E3932] leading-tight">
              Mã hóa đơn{" "}
              <span className="italic text-[#2D4F3C] opacity-70">
                #{booking.id}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
              Trạng thái:
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-stone-200 text-[#1E3932] text-xs font-bold shadow-sm">
              {BOOKING_STATUS_TEXT[booking.status]}
            </span>
          </div>
        </div>

        <ConfigProvider
          theme={{ token: { colorPrimary: "#1E3932", borderRadius: 20 } }}
        >
          <div className="space-y-8">
            {/* 1. Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100">
              <SummaryItem
                icon={<CalendarOutlined />}
                label="Ngày đến"
                value={dayjs(booking.checkInDate).format("DD/MM/YYYY")}
              />
              <SummaryItem
                icon={<CalendarOutlined />}
                label="Ngày đi"
                value={dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
              />
              <SummaryItem
                icon={<ClockCircleOutlined />}
                label="Thời gian"
                value={`${booking.totalDays} đêm`}
              />
              <SummaryItem
                icon={<InfoCircleOutlined />}
                label="Tổng tiền"
                value={`₫${booking.totalPrice.toLocaleString()}`}
                isHighlight
              />
            </div>

            {/* 2. Deposit Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-stone-100 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-7xl">
                <WalletOutlined />
              </div>
              <h3 className="text-xl font-serif text-[#1E3932] mb-8">
                Thông tin thanh toán đặt cọc
              </h3>

              {deposit ? (
                <div className="grid md:grid-cols-3 gap-8 p-6 rounded-3xl bg-[#FCFAF7] border border-stone-50">
                  <DetailLine
                    label="Số tiền đã cọc"
                    value={`₫${deposit.soTienDatCoc.toLocaleString()}`}
                  />
                  <DetailLine
                    label="Trạng thái cọc"
                    value={depositStatusTag(deposit.trangThai)}
                  />
                  <DetailLine
                    label="Ngày thanh toán"
                    value={
                      deposit.thoiGianThanhToan
                        ? dayjs(deposit.thoiGianThanhToan).format(
                            "DD/MM/YYYY HH:mm",
                          )
                        : "---"
                    }
                  />
                </div>
              ) : (
                !isCompleted && (
                  <div className="text-center py-10 px-6 rounded-3xl bg-[#F1DEB4]/10 border border-[#F1DEB4]/30">
                    <p className="mb-6 text-stone-500 italic">
                      Chưa ghi nhận khoản đặt cọc cho mã hóa đơn này.
                    </p>
                    <button
                      onClick={handleCreateDeposit}
                      className="px-10 py-4 bg-[#1E3932] text-white rounded-2xl font-bold text-sm hover:bg-[#2D4F3C] transition-all shadow-lg active:scale-95"
                    >
                      TIẾN HÀNH ĐẶT CỌC (30%)
                    </button>
                  </div>
                )
              )}
            </div>

            {/* 3. Rooms Table */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-stone-100">
              <div className="px-10 py-6 border-b border-stone-100 bg-stone-50/50">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3932] flex items-center gap-2">
                  <HomeOutlined className="text-[#C9A96A]" /> Chi tiết không
                  gian
                </h3>
              </div>
              <Table
                pagination={false}
                dataSource={booking.bookingDetails}
                rowKey="roomId"
                className="custom-table"
                columns={[
                  {
                    title: (
                      <span className="text-[10px] uppercase text-stone-400">
                        Phòng
                      </span>
                    ),
                    dataIndex: "roomId",
                    render: (id) => (
                      <span className="font-bold text-[#1E3932]">
                        Phòng #{id}
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span className="text-[10px] uppercase text-stone-400">
                        Giá / đêm
                      </span>
                    ),
                    dataIndex: "pricePerNight",
                    render: (v) => (
                      <span className="text-stone-600 font-medium">
                        ₫{v.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span className="text-[10px] uppercase text-stone-400">
                        Số đêm
                      </span>
                    ),
                    align: "center",
                    render: () => (
                      <span className="text-stone-500">
                        {booking.totalDays}
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span className="text-[10px] uppercase text-stone-400 text-right block pr-4">
                        Thành tiền
                      </span>
                    ),
                    align: "right",
                    render: (_, r) => (
                      <span className="font-bold text-[#1E3932] pr-4">
                        ₫
                        {(r.pricePerNight * booking.totalDays).toLocaleString()}
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            {/* 4. Final Receipt */}
            <div
              className={`rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden transition-colors ${isCompleted ? "bg-[#2D4F3C]" : "bg-[#1E3932]"}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />

              <div className="max-w-md ml-auto space-y-6">
                <div className="flex justify-between items-center text-stone-300 font-medium">
                  <span>Tổng giá trị đơn:</span>
                  <span className="text-white">
                    ₫{booking.totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-300 font-medium">
                  <span>Khoản đã thanh toán (Cọc):</span>
                  <span className={deposit ? "text-[#D4E9E2]" : ""}>
                    {deposit?.trangThai === "DaThanhToan"
                      ? `- ₫${deposit.soTienDatCoc.toLocaleString()}`
                      : "₫0"}
                  </span>
                </div>

                <div className="h-px bg-white/10 w-full" />

                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-[#C9A96A] tracking-[0.3em] mb-2">
                      {isCompleted
                        ? "Trạng thái thanh toán"
                        : "Cần thanh toán thêm"}
                    </p>
                    <p className="text-4xl md:text-5xl font-serif font-bold">
                      {isCompleted
                        ? "ĐÃ TẤT TOÁN"
                        : `₫${remainAmount.toLocaleString()}`}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircleOutlined className="text-5xl text-[#C9A96A] mb-1" />
                  )}
                </div>

                {!isCompleted && (
                  <p className="text-[10px] text-stone-400 italic text-right mt-4">
                    * Số tiền còn lại sẽ được thanh toán trực tiếp tại quầy khi
                    nhận phòng.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => router.back()}
                className="px-12 py-4 rounded-full border border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#1E3932] transition-all"
              >
                Trở về
              </button>
            </div>
          </div>
        </ConfigProvider>
      </div>

      <style jsx global>{`
        .custom-table .ant-table {
          background: transparent !important;
        }
        .custom-table .ant-table-thead > tr > th {
          background: transparent !important;
          border-bottom: 1px solid #f0f0f0 !important;
          padding: 20px 16px !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f9f9f9 !important;
          padding: 24px 16px !important;
        }
        .custom-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }
      `}</style>
    </main>
  );
}

/* ================= MINI COMPONENTS ================= */
function SummaryItem({
  icon,
  label,
  value,
  isHighlight,
}: {
  icon: any;
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-stone-300 tracking-widest flex items-center gap-1.5">
        <span className="text-[#C9A96A]">{icon}</span> {label}
      </span>
      <span
        className={`text-lg font-bold font-serif ${isHighlight ? "text-[#C9A96A]" : "text-[#1E3932]"}`}
      >
        {value}
      </span>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
        {label}
      </span>
      <div className="text-base font-bold text-[#1E3932]">{value}</div>
    </div>
  );
}
