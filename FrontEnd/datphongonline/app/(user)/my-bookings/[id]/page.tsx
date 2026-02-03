"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Spin, Button, Descriptions, message, Table } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

import { useAuths } from "@/hooks/useAuths";
import { useBooking } from "@/hooks/useBooking";
import { BookingResponse } from "@/types/booking";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getBookingById } = useBooking();

  const { user, loading: authLoading } = useAuths();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/my-bookings/${id}`);
    }
  }, [authLoading, user, router, id]);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (user && id) fetchDetail();
  }, [user, id]);

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

  const subTotal = useMemo(() => {
    if (!booking) return 0;
    return booking.bookingDetails.reduce(
      (sum, d) => sum + d.pricePerNight * booking.totalDays,
      0,
    );
  }, [booking]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <main className="bg-[#f3f1ee] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/my-bookings"
          className="flex items-center gap-2 text-[#b89655] mb-6"
        >
          <ArrowLeftOutlined /> Quay lại
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          Chi tiết hóa đơn #{booking.id}
        </h1>

        {/* ================= INFO ================= */}
        <Card className="rounded-2xl mb-6">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Check-in">
              {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Check-out">
              {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Người lớn">
              {booking.adults}
            </Descriptions.Item>
            <Descriptions.Item label="Trẻ em">
              {booking.children}
            </Descriptions.Item>
            <Descriptions.Item label="Số đêm">
              {booking.totalDays}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {booking.status}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* ================= ROOMS ================= */}
        <Card className="rounded-2xl mb-6">
          <Table
            pagination={false}
            dataSource={booking.bookingDetails}
            rowKey="roomId"
            columns={[
              {
                title: "Phòng",
                dataIndex: "roomId",
                render: (id) => `Phòng #${id}`,
              },
              {
                title: "Giá / đêm",
                dataIndex: "pricePerNight",
                render: (v) => `₫${v.toLocaleString()}`,
              },
              {
                title: "Số đêm",
                render: () => booking.totalDays,
              },
              {
                title: "Thành tiền",
                render: (_, r) =>
                  `₫${(r.pricePerNight * booking.totalDays).toLocaleString()}`,
              },
            ]}
          />
        </Card>

        {/* ================= TOTAL ================= */}
        <Card className="rounded-2xl">
          <Descriptions column={1}>
            <Descriptions.Item label="Tạm tính">
              ₫{subTotal.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng thanh toán">
              <span className="text-xl font-bold text-[#b89655]">
                ₫{booking.totalPrice.toLocaleString()}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <div className="mt-8">
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    </main>
  );
}
