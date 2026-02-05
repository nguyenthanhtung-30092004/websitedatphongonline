"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  Empty,
  Spin,
  message,
  Card,
  ConfigProvider,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

import { useAuths } from "@/hooks/useAuths";
import { useBooking } from "@/hooks/useBooking";
import { BookingResponse } from "@/types/booking";

/* ================= STATUS STYLING ================= */
type BookingStatusKey = "Pending" | "Confirmed" | "Completed" | "Canceled";

const STATUS_NUMBER_MAP: Record<number, BookingStatusKey> = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Canceled",
};

const STATUS_DISPLAY: Record<
  BookingStatusKey,
  { label: string; color: string }
> = {
  Pending: {
    label: "Đang chờ",
    color: "text-amber-700 bg-amber-50 border-amber-100",
  },
  Confirmed: {
    label: "Đã xác nhận",
    color: "text-emerald-700 bg-emerald-50 border-emerald-100",
  },
  Completed: {
    label: "Hoàn thành",
    color: "text-[#1E3932] bg-[#D4E9E2] border-[#2D4F3C]/10",
  },
  Canceled: {
    label: "Đã hủy",
    color: "text-rose-700 bg-rose-50 border-rose-100",
  },
};

const getStatusKey = (status: string | number): BookingStatusKey => {
  if (typeof status === "number") return STATUS_NUMBER_MAP[status];
  return status as BookingStatusKey;
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuths();
  const { getMyBooking, cancelBooking } = useBooking();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/my-bookings");
    }
  }, [authLoading, user, router]);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBooking();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const confirmCancel = (id: number) => {
    Modal.confirm({
      title: "Hủy đặt phòng",
      content:
        "Bạn có chắc chắn muốn hủy đơn đặt phòng này? Hành động này không thể hoàn tác.",
      okText: "Xác nhận hủy",
      cancelText: "Quay lại",
      okButtonProps: { danger: true, style: { borderRadius: "12px" } },
      cancelButtonProps: { style: { borderRadius: "12px" } },
      centered: true,
      onOk: () => handleCancelBooking(id),
    });
  };

  const handleCancelBooking = async (id: number) => {
    setCancelingId(id);
    try {
      await cancelBooking(id);
      message.success("Đã hủy phòng thành công");
      fetchBookings();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không thể hủy");
    } finally {
      setCancelingId(null);
    }
  };

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => getStatusKey(b.status) === "Pending")
        .length,
      confirmed: bookings.filter((b) => getStatusKey(b.status) === "Confirmed")
        .length,
      completed: bookings.filter((b) => getStatusKey(b.status) === "Completed")
        .length,
    };
  }, [bookings]);

  /* ================= RENDER ================= */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center">
        <Spin size="large" />
        <p className="mt-4 text-[#2D4F3C] font-medium italic">
          Đang chuẩn bị dữ liệu của bạn...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="bg-[#FCFAF7] min-h-screen py-16 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4E9E2]/30 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F1DEB4]/20 rounded-full blur-[80px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1E3932] transition-colors mb-8 text-sm font-medium group"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />{" "}
          Quay lại Trang chủ
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1E3932] mb-3">
            Đơn đặt phòng của tôi
          </h1>
          <p className="text-stone-500 max-w-2xl leading-relaxed">
            Nơi lưu giữ những hành trình tuyệt vời. Bạn có thể theo dõi tiến độ,
            quản lý thông tin và chuẩn bị cho kỳ nghỉ sắp tới tại đây.
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            label="Tổng đơn đặt"
            value={stats.total}
            icon={<ShoppingOutlined />}
            color="bg-white"
          />
          <StatCard
            label="Đang chờ duyệt"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            color="bg-white"
          />
          <StatCard
            label="Đã xác nhận"
            value={stats.confirmed}
            icon={<CheckCircleOutlined />}
            color="bg-white"
          />
          <StatCard
            label="Đã hoàn thành"
            value={stats.completed}
            icon={<FileDoneOutlined />}
            color="bg-white"
          />
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1E3932",
              borderRadius: 16,
            },
          }}
        >
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Spin />
                <p className="text-stone-400 text-sm italic">
                  Đang tải danh sách...
                </p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-24 text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-stone-400 italic">
                      Bạn chưa có đơn đặt phòng nào
                    </span>
                  }
                >
                  <Link href="/rooms">
                    <button className="px-8 py-3 bg-[#1E3932] text-white rounded-full font-bold hover:bg-[#2D4F3C] transition-all shadow-lg shadow-green-900/10">
                      Khám phá phòng ngay
                    </button>
                  </Link>
                </Empty>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FCFAF7] border-b border-stone-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Mã đơn
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Thời gian lưu trú
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">
                        Số đêm
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Tổng thanh toán
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Trạng thái
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">
                        Chi tiết
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-50">
                    {bookings.map((b) => {
                      const statusKey = getStatusKey(b.status);
                      const statusDisplay = STATUS_DISPLAY[statusKey];

                      const canCancel =
                        statusKey === "Pending" &&
                        dayjs().isBefore(dayjs(b.checkInDate).endOf("day"));

                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-stone-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <span className="font-bold text-[#1E3932]">
                              #{b.id}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-semibold text-stone-700">
                                {dayjs(b.checkInDate).format("DD/MM/YYYY")}
                              </div>
                              <div className="h-px w-4 bg-stone-300" />
                              <div className="text-sm font-semibold text-stone-700">
                                {dayjs(b.checkOutDate).format("DD/MM/YYYY")}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-stone-500 font-medium">
                              {b.totalDays} đêm
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-bold text-[#C9A96A] text-base">
                              ₫{b.totalPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-tighter ${statusDisplay.color}`}
                            >
                              {statusDisplay.label}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/my-bookings/${b.id}`}>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-[#1E3932] hover:bg-[#1E3932] hover:text-white transition-all duration-300 shadow-sm">
                                  <EyeOutlined />
                                </button>
                              </Link>
                              {canCancel && (
                                <button
                                  disabled={cancelingId === b.id}
                                  onClick={() => confirmCancel(b.id)}
                                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm"
                                >
                                  {cancelingId === b.id ? (
                                    <Spin size="small" />
                                  ) : (
                                    <DeleteOutlined />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ConfigProvider>
      </div>
    </main>
  );
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div
      className={`${color} p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#1E3932] tracking-tight">
            {value}
          </p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FCFAF7] text-[#C9A96A] group-hover:bg-[#1E3932] group-hover:text-white transition-all duration-500">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
