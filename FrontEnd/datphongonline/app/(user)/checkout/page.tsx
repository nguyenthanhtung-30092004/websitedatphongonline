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
  Tag,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
  CoffeeOutlined,
  WifiOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useRoom } from "@/hooks/useRoom";
import { useBooking } from "@/hooks/useBooking";
import { useAuths } from "@/hooks/useAuths";
import Link from "next/link";
import { taoDatCoc } from "@/services/api/deposit.api";

const { RangePicker } = DatePicker;

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { rooms } = useRoom();
  const { createBooking, submitting } = useBooking();
  const { user, loading: authLoading } = useAuths();
  const [form] = Form.useForm();

  /* ================= PARAMS & DATA ================= */
  const checkInParam = params.get("checkIn");
  const checkOutParam = params.get("checkOut");
  const roomId = Number(params.get("roomId"));

  const room = rooms.find((r) => r.id === roomId);

  /* ================= STATE ================= */
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(
    checkInParam && checkOutParam
      ? [dayjs(checkInParam), dayjs(checkOutParam)]
      : null,
  );

  const nights =
    dates && dates[0] && dates[1] ? dates[1].diff(dates[0], "day") : 0;

  const totalPrice = room ? room.basePrice * nights : 0;
  const depositPrice = totalPrice * 0.3; // 30% đặt cọc

  /* ================= AUTH GUARD ================= */
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
      message.error("Vui lòng chọn ngày lưu trú hợp lệ");
      return;
    }

    try {
      const booking = await createBooking({
        checkInDate: dates[0].format("YYYY-MM-DD"),
        checkOutDate: dates[1].format("YYYY-MM-DD"),
        adults: values.adults,
        children: values.children,
        roomIds: [room.id],
      });

      if (!booking?.id) throw new Error("Không tạo được yêu cầu đặt phòng");

      localStorage.setItem("latest_booking_id", booking.id.toString());

      const datCoc = await taoDatCoc({
        bookingId: booking.id,
        phanTramDatCoc: 30,
      });

      window.location.href = datCoc.urlThanhToan;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi quá trình đặt phòng");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f1ee]">
        <Spin size="large" tip="Đang tải dữ liệu thanh toán..." />
      </div>
    );
  }

  if (!user || !room || !dates)
    return <Empty description="Thông tin phòng không hợp lệ" />;

  return (
    <main className="bg-[#f3f1ee] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* BACK BUTTON */}
        <Link
          href={`/room-detail/${room.id}`}
          className="inline-flex items-center gap-2 text-[#b89655] mb-8 font-medium hover:underline"
        >
          <ArrowLeftOutlined /> Quay lại chi tiết phòng
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: FORM & INFO */}
          <div className="lg:col-span-2 space-y-6">
            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#b89655] text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Thông tin người đặt
              </h2>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-x-6">
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      size="large"
                      className="rounded-xl h-12"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Vui lòng nhập đúng định dạng email",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      size="large"
                      className="rounded-xl h-12"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      size="large"
                      className="rounded-xl h-12"
                    />
                  </Form.Item>
                </div>

                <Divider className="my-8" />

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#b89655] text-white rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  Chi tiết lưu trú
                </h2>

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="md:col-span-2 mb-4">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Thời gian nhận/trả phòng
                    </label>
                    <RangePicker
                      value={dates}
                      onChange={(v) => setDates(v as any)}
                      disabledDate={(d) => d && d < dayjs().startOf("day")}
                      className="w-full h-12 rounded-xl"
                    />
                  </div>

                  <Form.Item name="adults" label="Người lớn" initialValue={1}>
                    <InputNumber
                      min={1}
                      className="w-full h-12 rounded-xl flex items-center"
                    />
                  </Form.Item>
                  <Form.Item name="children" label="Trẻ em" initialValue={0}>
                    <InputNumber
                      min={0}
                      className="w-full h-12 rounded-xl flex items-center"
                    />
                  </Form.Item>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 mt-4">
                  <InfoCircleOutlined className="text-blue-500 mt-1" />
                  <p className="text-sm text-blue-700">
                    Sau khi nhấn hoàn tất, bạn sẽ được chuyển hướng đến cổng
                    thanh toán <b>VNPAY</b> để thực hiện đặt cọc 30%.
                  </p>
                </div>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={submitting}
                  className="w-full mt-10 h-14 bg-[#b89655] hover:bg-[#a38345] border-none text-lg font-bold rounded-xl shadow-lg shadow-yellow-900/10"
                >
                  Xác nhận & Thanh toán đặt cọc
                </Button>
              </Form>
            </div>

            {/* CHÍNH SÁCH */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Chính sách & Lưu ý</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <ClockCircleOutlined /> Nhận phòng: <b>14:00</b>
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockCircleOutlined /> Trả phòng: <b>12:00</b>
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <CheckCircleFilled className="text-green-500" /> Hủy phòng
                    miễn phí trước 48h
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircleFilled className="text-green-500" /> Xuất hóa
                    đơn VAT khi trả phòng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ROOM SUMMARY CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <Card className="rounded-[32px] overflow-hidden border-none shadow-xl">
                {/* Ảnh phòng */}
                <div className="-mx-6 -mt-6 mb-6">
                  <img
                    src={room.imageUrls[0]}
                    alt={room.roomName}
                    className="w-full h-52 object-cover"
                  />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {room.roomName}
                  </h3>
                  <Tag
                    color="gold"
                    className="m-0 border-none rounded-md px-2 py-0.5"
                  >
                    VIP
                  </Tag>
                </div>

                <p className="text-sm text-[#b89655] font-medium mb-4">
                  {room.roomTypeName}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lịch trình:</span>
                    <span className="font-semibold">
                      {dates[0].format("DD/MM")} - {dates[1].format("DD/MM")} (
                      {nights} đêm)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giá phòng:</span>
                    <span className="font-semibold">
                      {room.basePrice.toLocaleString()}đ / đêm
                    </span>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Tiện ích nhanh */}
                <div className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <WifiOutlined className="text-lg" />
                    <span className="text-[10px]">Free Wifi</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <CoffeeOutlined className="text-lg" />
                    <span className="text-[10px]">Breakfast</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <UserOutlined className="text-lg" />
                    <span className="text-[10px]">Max 2+</span>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền phòng</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-[#b89655] font-bold text-lg pt-2 border-t border-dashed border-gray-300">
                    <span>Cần đặt cọc (30%)</span>
                    <span>{depositPrice.toLocaleString()}đ</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 text-center mt-4 italic">
                  * Giá đã bao gồm thuế phí và các tiện ích cơ bản.
                </p>
              </Card>

              <div className="bg-[#e8e4df] p-6 rounded-[24px] text-center border border-[#d8d4cf]">
                <p className="text-sm text-gray-600 mb-1">
                  Cần hỗ trợ đặt phòng?
                </p>
                <p className="text-lg font-bold text-[#b89655]">1900 6789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
