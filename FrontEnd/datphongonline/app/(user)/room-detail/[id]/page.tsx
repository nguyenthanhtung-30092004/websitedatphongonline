"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DatePicker, message, ConfigProvider } from "antd";
import * as AntdIcons from "@ant-design/icons";
import {
  ShareAltOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { useAmenity } from "@/hooks/useAmenity";

const { RangePicker } = DatePicker;

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { rooms } = useRoom();
  const { amenities } = useAmenity();
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);

  const room = rooms.find((r) => r.id === Number(id));

  const handleBooking = () => {
    if (!dates) {
      message.warning("Vui lòng chọn ngày check-in và check-out");
      return;
    }

    const [checkIn, checkOut] = dates;
    router.push(
      `/checkout?checkIn=${checkIn.format("YYYY-MM-DD")}&checkOut=${checkOut.format(
        "YYYY-MM-DD",
      )}&roomId=${room?.id}`,
    );
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1E3932] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1E3932] font-medium italic">
            Đang tải không gian của bạn...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#FCFAF7] min-h-screen pb-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[30%] h-[500px] bg-[#D4E9E2]/20 rounded-bl-[200px] -z-0" />
      <div className="absolute top-[20%] -left-20 w-64 h-64 bg-[#F1DEB4]/20 rounded-full blur-3xl -z-0" />

      {/* ================= HEADER & NAVIGATION ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1E3932] transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeftOutlined /> Quay lại danh sách phòng
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1E3932] leading-tight">
              {room.roomName}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-stone-500">
              <div className="flex items-center gap-1">
                <EnvironmentOutlined className="text-[#C9A96A]" />
                <span className="text-sm">{room.address}</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-[#2D4F3C] text-sm font-semibold italic">
                Vị trí xuất sắc
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-100 shadow-sm text-stone-600 text-sm font-medium hover:bg-stone-50 transition">
              <ShareAltOutlined /> Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-100 shadow-sm text-stone-600 text-sm font-medium hover:bg-stone-50 transition">
              <HeartOutlined /> Lưu lại
            </button>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[auto] md:h-[550px]">
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] shadow-xl">
            <img
              src={room.imageUrls[0]}
              className="w-full h-full min-h-[300px] object-cover group-hover:scale-105 transition duration-[1.5s]"
              alt="Main Gallery"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-lg group">
            <img
              src={room.imageUrls[1] || room.imageUrls[0]}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              alt="Gallery 2"
            />
          </div>

          <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-lg group">
            <img
              src={room.imageUrls[2] || room.imageUrls[0]}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              alt="Gallery 3"
            />
          </div>

          <div className="hidden md:col-span-2 md:block relative overflow-hidden rounded-[2rem] shadow-lg group">
            <img
              src={room.imageUrls[3] || room.imageUrls[0]}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              alt="Gallery 4"
            />
            <div className="absolute inset-0 bg-black/10" />
            <button className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-bold text-[#1E3932] uppercase tracking-widest shadow-xl border border-white/50 hover:bg-[#1E3932] hover:text-white transition-all duration-300">
              Xem tất cả {room.imageUrls.length} ảnh
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8">
            {/* Quick Ratings & Badges */}
            <div className="flex items-center gap-6 mb-12 border-b border-stone-100 pb-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-stone-300 tracking-[0.2em]">
                  Đánh giá
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#F1DEB4] px-2 py-0.5 rounded-lg">
                    <StarFilled className="text-[#1E3932] text-xs" />
                    <span className="font-bold text-[#1E3932] text-sm">
                      4.92
                    </span>
                  </div>
                  <span className="text-sm text-stone-500 underline decoration-stone-200 cursor-pointer">
                    128 khách đã trải nghiệm
                  </span>
                </div>
              </div>
              <div className="w-px h-10 bg-stone-100" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-stone-300 tracking-[0.2em]">
                  Phân loại
                </span>
                <span className="text-[#1E3932] font-bold text-sm tracking-tight">
                  {room.roomTypeName || "Luxury Suite"}
                </span>
              </div>
            </div>

            {/* Icons Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              <InfoItem
                icon="UserOutlined"
                label="Khách tối đa"
                value="02 Người lớn"
              />
              <InfoItem icon="ExpandOutlined" label="Diện tích" value="45 m²" />
              <InfoItem
                icon="CompassOutlined"
                label="Hướng nhìn"
                value="Thành phố"
              />
            </div>

            {/* Description Card */}
            <div className="relative mb-16">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#D4E9E2] opacity-40 rounded-full blur-xl" />
              <p className="text-lg text-stone-600 leading-[1.8] italic font-light relative z-10">
                "{room.roomName} mang đến không gian nghỉ dưỡng tinh tế, nội
                thất cao cấp và tầm nhìn tuyệt đẹp. Được thiết kế theo phong
                cách tối giản nhưng sang trọng, đây là sự lựa chọn hoàn hảo cho
                cả kỳ nghỉ lãng mãy lẫn công tác dài ngày."
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-stone-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4E9E2]/10 rounded-full -translate-y-16 translate-x-16" />

              <h3 className="text-2xl font-serif text-[#1E3932] mb-10">
                Tiện nghi đẳng cấp
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                {room.amenities.map((name, i) => {
                  const a = amenities.find((x) => x.name === name);
                  const Icon = a ? (AntdIcons as any)[a.icon] : null;

                  return (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-2xl bg-[#FCFAF7] border border-stone-50 shadow-sm flex items-center justify-center text-[#2D4F3C] group-hover:bg-[#1E3932] group-hover:text-white transition-all duration-500">
                        {Icon && <Icon className="text-xl" />}
                      </div>
                      <span className="text-stone-600 font-semibold tracking-tight group-hover:text-[#1E3932] transition-colors">
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - BOOKING SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-green-900/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#1E3932]" />

                <div className="flex items-baseline justify-between mb-8">
                  <div>
                    <span className="block text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">
                      Giá mỗi đêm
                    </span>
                    <span className="text-3xl font-bold text-[#1E3932]">
                      {room.basePrice.toLocaleString()}đ
                    </span>
                    <span className="text-stone-400 font-light ml-1">
                      {" "}
                      / đêm
                    </span>
                  </div>
                  <div className="text-[#C9A96A]">
                    <StarFilled /> 4.9
                  </div>
                </div>

                {/* Booking Form UI */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-3">
                      Lịch trình nghỉ dưỡng
                    </label>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#1E3932",
                          borderRadius: 12,
                        },
                      }}
                    >
                      <RangePicker
                        className="w-full !rounded-2xl !py-3 !border-stone-100 hover:!border-[#D4E9E2] transition-all bg-stone-50/50"
                        disabledDate={(d) => d && d < dayjs().startOf("day")}
                        placeholder={["Ngày đến", "Ngày đi"]}
                        onChange={(v) => setDates(v as any)}
                      />
                    </ConfigProvider>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full py-5 rounded-2xl bg-[#1E3932] text-white font-bold tracking-widest hover:bg-[#2D4F3C] shadow-lg shadow-green-900/20 active:scale-95 transition-all duration-300 group"
                  >
                    ĐẶT PHÒNG NGAY
                  </button>

                  <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-[#D4E9E2]/10 border border-[#D4E9E2]/20 mt-4">
                    <SafetyCertificateOutlined className="text-[#1E3932] text-xl shrink-0" />
                    <div>
                      <h4 className="text-[11px] font-bold text-[#1E3932] uppercase mb-1">
                        Đảm bảo kỳ nghỉ
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed">
                        Chính sách linh hoạt & cam kết hỗ trợ 24/7 từ đội ngũ
                        CSKH resort.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ================= REUSABLE SUB-COMPONENT ================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const Icon = (AntdIcons as any)[icon];
  return (
    <div className="bg-white p-7 rounded-[2rem] border border-stone-50 shadow-sm hover:shadow-md transition-all duration-500 group">
      <div className="w-12 h-12 rounded-full bg-[#FCFAF7] border border-stone-100 flex items-center justify-center mb-4 text-[#C9A96A] group-hover:scale-110 transition-transform">
        <Icon className="text-xl" />
      </div>
      <p className="text-[10px] uppercase text-stone-300 font-bold tracking-widest mb-1">
        {label}
      </p>
      <p className="font-bold text-[#1E3932] tracking-tight">{value}</p>
    </div>
  );
}
