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
  ConfigProvider,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
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

  /* ================= PARAMS (Logic Unchanged) ================= */
  const checkInParam = params.get("checkIn");
  const checkOutParam = params.get("checkOut");
  const roomId = Number(params.get("roomId"));

  const room = rooms.find((r) => r.id === roomId);

  /* ================= STATE (Logic Unchanged) ================= */
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(
    checkInParam ? [dayjs(checkInParam), null as any] : null,
  );

  const nights =
    dates && dates[0] && dates[1] ? dates[1].diff(dates[0], "day") : 0;

  const totalPrice = room ? room.basePrice * nights : 0;
  const depositPrice = totalPrice * 0.3;

  /* ================= AUTH (Logic Unchanged) ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        `/login?redirect=/checkout?checkIn=${checkInParam}&checkOut=${checkOutParam}&roomId=${roomId}`,
      );
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  /* ================= SUBMIT (Logic Unchanged) ================= */
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
      if (!booking || !booking.id) {
        throw new Error("Không tạo được booking");
      }
      localStorage.setItem("latest_booking_id", booking.id.toString());

      const datCoc = await taoDatCoc({
        bookingId: booking.id,
        phanTramDatCoc: 30,
      });

      window.location.href = datCoc.urlThanhToan;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi đặt phòng");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || !room || !dates)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <Empty description="Thông tin không hợp lệ" />
      </div>
    );

  return (
    <main className="bg-[#FCFAF7] min-h-screen py-16 relative overflow-hidden">
      {/* Nature-inspired background decorations */}
      <div className="absolute top-0 right-0 w-[40%] h-[400px] bg-[#D4E9E2]/30 rounded-bl-[200px] -z-0" />
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-[#F1DEB4]/20 rounded-full blur-[100px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Navigation */}
        <Link
          href={`/room-detail/${room.id}`}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1E3932] mb-10 font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
          Quay lại chi tiết phòng
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-green-900/5 border border-stone-50">
              <div className="mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D4F3C]/5 rounded-full mb-4 text-[10px] font-bold text-[#2D4F3C] uppercase tracking-[0.2em]">
                  <SafetyCertificateOutlined className="text-[#C9A96A]" /> Đặt
                  phòng an toàn
                </span>
                <h2 className="text-4xl font-serif text-[#1E3932]">
                  Hoàn tất đặt chỗ
                </h2>
                <p className="text-stone-500 mt-2 font-light">
                  Vui lòng kiểm tra và cung cấp thông tin để xác nhận kỳ nghỉ
                  của bạn.
                </p>
              </div>

              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#1E3932",
                    borderRadius: 16,
                  },
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                >
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    <Form.Item
                      label={
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                          Họ và tên
                        </span>
                      }
                      name="fullName"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-stone-300" />}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-100"
                        placeholder="Nguyễn Văn A"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                          Email liên hệ
                        </span>
                      }
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Vui lòng nhập email hợp lệ",
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-stone-300" />}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-100"
                        placeholder="example@gmail.com"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                          Số điện thoại
                        </span>
                      }
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined className="text-stone-300" />}
                        className="h-14 rounded-2xl bg-stone-50/50 border-stone-100"
                        placeholder="0901 234 567"
                      />
                    </Form.Item>
                  </div>

                  <div className="my-12 h-px bg-stone-100 w-full relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-white pr-4 text-[10px] font-bold uppercase text-stone-300 tracking-[0.3em]">
                      Chi tiết lưu trú
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                        Ngày nhận & trả phòng
                      </label>
                      <RangePicker
                        value={dates as any}
                        onChange={(v) => setDates(v as any)}
                        disabledDate={(d) =>
                          !dates?.[0]
                            ? d && d < dayjs(checkInParam)
                            : d && d <= dates[0]
                        }
                        className="w-full h-14 rounded-2xl bg-stone-50/50 border-stone-100"
                        suffixIcon={
                          <CalendarOutlined className="text-[#C9A96A]" />
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="adults"
                        label={
                          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                            Người lớn
                          </span>
                        }
                        initialValue={1}
                      >
                        <InputNumber
                          min={1}
                          className="w-full h-14 rounded-2xl bg-stone-50/50 border-stone-100 flex items-center"
                        />
                      </Form.Item>

                      <Form.Item
                        name="children"
                        label={
                          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                            Trẻ em
                          </span>
                        }
                        initialValue={0}
                      >
                        <InputNumber
                          min={0}
                          className="w-full h-14 rounded-2xl bg-stone-50/50 border-stone-100 flex items-center"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="bg-[#FCFAF7] border border-[#D4E9E2] p-6 rounded-3xl flex gap-4 mt-8">
                    <div className="w-10 h-10 rounded-full bg-[#D4E9E2] flex items-center justify-center shrink-0">
                      <InfoCircleOutlined className="text-[#1E3932]" />
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Chính sách thanh toán: Bạn chỉ cần đặt cọc trước{" "}
                      <b className="text-[#1E3932]">
                        30% ({depositPrice.toLocaleString()}đ)
                      </b>{" "}
                      để giữ chỗ. Số tiền còn lại sẽ được thanh toán trực tiếp
                      tại quầy khi nhận phòng.
                    </p>
                  </div>

                  <Button
                    htmlType="submit"
                    loading={submitting}
                    className="w-full mt-12 h-16 bg-[#1E3932] hover:bg-[#2D4F3C] border-none text-white text-base font-bold rounded-2xl shadow-xl shadow-green-900/20 transition-all active:scale-[0.98]"
                  >
                    XÁC NHẬN & THANH TOÁN ĐẶT CỌC
                  </Button>
                </Form>
              </ConfigProvider>
            </div>
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <Card
                className="rounded-[2.5rem] shadow-2xl shadow-stone-200 border-stone-50 overflow-hidden"
                bodyStyle={{ padding: "2rem" }}
              >
                <div className="relative h-48 -mx-8 -mt-8 mb-8 overflow-hidden">
                  <img
                    src={room.imageUrls[0]}
                    className="w-full h-full object-cover"
                    alt={room.roomName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3932]/40 to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                      Không gian lựa chọn
                    </p>
                    <h3 className="text-lg font-serif">{room.roomName}</h3>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400 font-medium">
                      Loại phòng
                    </span>
                    <span className="text-[#1E3932] font-bold">
                      {room.roomTypeName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400 font-medium">
                      Thời gian lưu trú
                    </span>
                    <span className="text-[#1E3932] font-bold">
                      {nights} đêm
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400 font-medium">
                      Giá niêm yết
                    </span>
                    <span className="text-stone-600">
                      {room.basePrice.toLocaleString()}đ / đêm
                    </span>
                  </div>

                  <Divider className="my-4 border-stone-100" />

                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">
                      Tổng tiền phòng
                    </span>
                    <span className="text-lg font-bold text-stone-800">
                      {totalPrice.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="bg-[#D4E9E2]/20 p-5 rounded-2xl mt-4 border border-[#D4E9E2]/30">
                    <div className="flex justify-between items-center text-[#1E3932]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                          Số tiền đặt cọc (30%)
                        </span>
                        <span className="text-2xl font-bold font-serif">
                          {depositPrice.toLocaleString()}đ
                        </span>
                      </div>
                      <WalletOutlined className="text-2xl opacity-20" />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="px-6 text-center">
                <p className="text-[10px] text-stone-400 leading-relaxed uppercase tracking-widest">
                  Đảm bảo giá tốt nhất & không thu phí đặt chỗ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Reused Icons for consistency if not imported elsewhere */
function WalletOutlined(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 464H528V448h312v128zm0 264H184V184h656v200H496c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32h344v200z"></path>
    </svg>
  );
}
