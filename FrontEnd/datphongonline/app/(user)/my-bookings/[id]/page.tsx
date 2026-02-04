"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Spin,
  Button,
  Descriptions,
  message,
  Table,
  Tag,
  Divider,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

import { useAuths } from "@/hooks/useAuths";
import { useBooking } from "@/hooks/useBooking";
import { BookingResponse } from "@/types/booking";
import { useDeposit } from "@/hooks/useDeposit";
import { Deposit, DepositStatus } from "@/types/deposit";

export default function BookingDetailPage() {
  const BOOKING_STATUS_TEXT: Record<number, string> = {
    0: "Chờ xác nhận",
    1: "Đã xác nhận",
    2: "Hoàn thành",
    3: "Đã hủy",
  };

  const DEPOSIT_STATUS_TEXT: Record<DepositStatus, JSX.Element> = {
    ChoThanhToan: <Tag color="orange">Chờ thanh toán</Tag>,
    DaThanhToan: <Tag color="green">Đã thanh toán</Tag>,
    ThatBai: <Tag color="red">Thất bại</Tag>,
  };

  const { id } = useParams();
  const router = useRouter();

  const { getBookingById } = useBooking();
  const { user, loading: authLoading } = useAuths();
  const { createDeposit, fetchDepositByBooking } = useDeposit();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(false);

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
      console.log(data);
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

      message.success("Đặt cọc thành công (MOCK)");
      fetchDeposit();
    } catch {
      message.error("Không thể tạo đặt cọc");
    }
  };

  const subTotal = useMemo(() => {
    if (!booking) return 0;
    return booking.bookingDetails.reduce(
      (sum, d) => sum + d.pricePerNight * booking.totalDays,
      0,
    );
  }, [booking]);
  const remainAmount = useMemo(() => {
    if (!booking) return 0;
    if (!deposit) return booking.totalPrice;

    return booking.totalPrice - deposit.soTienDatCoc;
  }, [booking, deposit]);

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

        <h1 className="text-3xl font-bold mb-4">
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
            <Descriptions.Item label="Số đêm">
              {booking.totalDays}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái booking">
              <Tag color="blue">{BOOKING_STATUS_TEXT[booking.status]}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* ================= DEPOSIT ================= */}
        <Card className="rounded-2xl mb-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin đặt cọc</h3>

          {deposit ? (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Số tiền đặt cọc">
                ₫{deposit.soTienDatCoc.toLocaleString()}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {DEPOSIT_STATUS_TEXT[deposit.trangThai]}
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian thanh toán">
                {deposit.thoiGianThanhToan
                  ? dayjs(deposit.thoiGianThanhToan).format("DD/MM/YYYY HH:mm")
                  : "--"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-500">Booking này chưa có đặt cọc</p>
              <Button type="primary" onClick={handleCreateDeposit}>
                Đặt cọc 30%
              </Button>
            </div>
          )}
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
            <Descriptions.Item label="Tổng tiền booking">
              ₫{booking.totalPrice.toLocaleString()}
            </Descriptions.Item>

            <Descriptions.Item label="Đã đặt cọc">
              {deposit ? (
                <span className="text-green-600 font-medium">
                  - ₫{deposit.soTienDatCoc.toLocaleString()}
                </span>
              ) : (
                "₫0"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Số tiền còn lại phải thanh toán">
              <span className="text-2xl font-bold text-[#b89655]">
                ₫{remainAmount.toLocaleString()}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    </main>
  );
}
