"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Empty, Spin, message, Card } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

import { useAuths } from "@/hooks/useAuths";
import { useBooking } from "@/hooks/useBooking";
import { BookingResponse } from "@/types/booking";

/* ================= STATUS ================= */
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
  Pending: { label: "Đang chờ", color: "text-orange-600 bg-orange-50" },
  Confirmed: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50" },
  Completed: { label: "Hoàn thành", color: "text-green-600 bg-green-50" },
  Canceled: { label: "Đã hủy", color: "text-red-600 bg-red-50" },
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
      content: "Bạn có chắc chắn muốn hủy đơn đặt phòng này?",
      okText: "Hủy",
      cancelText: "Không",
      okButtonProps: { danger: true },
      onOk: () => handleCancelBooking(id),
    });
  };

  const handleCancelBooking = async (id: number) => {
    setCancelingId(id);
    try {
      await cancelBooking(id);
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
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="bg-[#f3f1ee] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/" className="flex items-center gap-2 text-[#b89655] mb-8">
          <ArrowLeftOutlined /> Trang chủ
        </Link>

        <h1 className="text-4xl font-bold mb-2">Đơn đặt phòng của tôi</h1>
        <p className="text-gray-600 mb-10">
          Quản lý và theo dõi các đơn đặt phòng
        </p>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[
            ["Tổng đơn", stats.total],
            ["Đang chờ", stats.pending],
            ["Đã xác nhận", stats.confirmed],
            ["Hoàn thành", stats.completed],
          ].map(([label, value]) => (
            <Card key={label as string} className="rounded-2xl">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold">{value}</p>
            </Card>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <Card className="rounded-[24px] overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : bookings.length === 0 ? (
            <Empty description="Chưa có đơn đặt phòng">
              <Link href="/rooms">
                <Button type="primary">Đặt phòng ngay</Button>
              </Link>
            </Empty>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#f7f5f2] text-left">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3">Check-out</th>
                  <th className="px-4 py-3">Số đêm</th>
                  <th className="px-4 py-3">Tổng tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => {
                  const statusKey = getStatusKey(b.status);
                  const statusDisplay = STATUS_DISPLAY[statusKey];

                  const canCancel =
                    statusKey === "Pending" &&
                    dayjs().isBefore(dayjs(b.checkInDate).endOf("day"));

                  return (
                    <tr key={b.id} className="border-t hover:bg-[#faf9f7]">
                      <td className="px-4 py-3 font-semibold">#{b.id}</td>
                      <td className="px-4 py-3">
                        {dayjs(b.checkInDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-3">
                        {dayjs(b.checkOutDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-3">{b.totalDays} đêm</td>
                      <td className="px-4 py-3 font-semibold text-[#b89655]">
                        ₫{b.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}
                        >
                          {statusDisplay.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/my-bookings/${b.id}`}>
                          <Button type="text" icon={<EyeOutlined />} />
                        </Link>
                        {canCancel && (
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            loading={cancelingId === b.id}
                            onClick={() => confirmCancel(b.id)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </main>
  );
}
