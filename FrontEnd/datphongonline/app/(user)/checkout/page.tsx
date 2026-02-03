"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  DatePicker,
  InputNumber,
  Input,
  Button,
  Divider,
  Card,
  Empty,
  Spin,
  message,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useRoom } from "@/hooks/useRoom";
import { useBooking } from "@/hooks/useBooking";
import { useAuths } from "@/hooks/useAuths";
import Link from "next/link";

const { RangePicker } = DatePicker;

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { rooms } = useRoom();
  const { createBooking, submitting } = useBooking();
  const { user, loading: authLoading } = useAuths();
  const [form] = Form.useForm();

  /* ================= PARAMS ================= */
  const checkInParam = params.get("checkIn");
  const checkOutParam = params.get("checkOut");
  const roomId = Number(params.get("roomId"));

  const room = rooms.find((r) => r.id === roomId);

  /* ================= DATE STATE ================= */
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(
    checkInParam && checkOutParam
      ? [dayjs(checkInParam), dayjs(checkOutParam)]
      : null,
  );

  const nights =
    dates && dates[0] && dates[1] ? dates[1].diff(dates[0], "day") : 0;

  const totalPrice = room ? room.basePrice * nights : 0;

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        `/login?redirect=/checkout?checkIn=${checkInParam}&checkOut=${checkOutParam}&roomId=${roomId}`,
      );
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (values: any) => {
    if (!room || !dates || nights <= 0) {
      message.error("Ngày không hợp lệ");
      return;
    }

    await createBooking({
      checkInDate: dates[0].format("YYYY-MM-DD"),
      checkOutDate: dates[1].format("YYYY-MM-DD"),
      adults: values.adults,
      children: values.children,
      roomIds: [room.id],
    });

    message.success("🎉 Đặt phòng thành công!");
    router.push("/checkout/success");
  };

  /* ================= GUARD ================= */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || !room || !dates) {
    return <Empty />;
  }

  /* ================= UI ================= */
  return (
    <main className="bg-[#f3f1ee] min-h-screen py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href={`/room-detail/${room.id}`}
          className="inline-flex items-center gap-2 text-[#b89655] mb-10"
        >
          <ArrowLeftOutlined /> Quay lại chi tiết phòng
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-10">
            <h2 className="text-3xl font-bold mb-8">Xác nhận đặt phòng</h2>

            {/* CHANGE DATE */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Thay đổi ngày lưu trú
              </label>
              <RangePicker
                value={dates}
                onChange={(v) => setDates(v as any)}
                disabledDate={(d) => d && d < dayjs().startOf("day")}
                className="w-full h-[48px] rounded-xl"
              />
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} size="large" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input prefix={<MailOutlined />} size="large" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<PhoneOutlined />} size="large" />
                </Form.Item>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-6">
                <Form.Item name="adults" label="Người lớn" initialValue={1}>
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item name="children" label="Trẻ em" initialValue={0}>
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </div>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={submitting}
                className="w-full mt-8 h-[56px]"
              >
                Hoàn tất đặt phòng
              </Button>
            </Form>
          </div>

          {/* RIGHT */}
          <Card className="rounded-[32px] sticky">
            <h3 className="text-xl font-bold">{room.roomName}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {dates[0].format("DD/MM/YYYY")} → {dates[1].format("DD/MM/YYYY")}
            </p>

            <div className="flex justify-between mb-2">
              <span>{nights} đêm</span>
              <span>{room.basePrice.toLocaleString()}đ / đêm</span>
            </div>

            <Divider />

            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng</span>
              <span className="text-[#b89655]">
                {totalPrice.toLocaleString()}đ
              </span>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
