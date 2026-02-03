"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DatePicker, message } from "antd";
import * as AntdIcons from "@ant-design/icons";
import {
  ShareAltOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  StarFilled,
  SafetyCertificateOutlined,
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

  if (!room) return <div className="p-20 text-center">Đang tải...</div>;

  return (
    <main className="bg-[#f3f1ee] min-h-screen pb-24">
      {/* ================= GALLERY ================= */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[520px] rounded-[32px] overflow-hidden">
          <div className="col-span-2 row-span-2 relative group">
            <img
              src={room.imageUrls[0]}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={room.imageUrls[i] || room.imageUrls[0]}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />
            </div>
          ))}

          <div className="col-span-2 relative overflow-hidden group">
            <img
              src={room.imageUrls[3] || room.imageUrls[0]}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />
            <div className="absolute bottom-6 right-6 px-6 py-2 bg-white/90 rounded-full text-sm font-medium shadow">
              Xem tất cả {room.imageUrls.length} ảnh
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        {/* Breadcrumb */}
        <div className="mb-10 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#b89655]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/rooms" className="hover:text-[#b89655]">
            Rooms
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{room.roomName}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="border-b border-[#e6e1d8] pb-10 mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <StarFilled className="text-[#c9a96a]" />
                  <span className="font-medium">4.92</span>
                  <span className="text-gray-400 underline">128 đánh giá</span>
                </div>

                <div className="flex gap-4 text-sm">
                  <button className="flex items-center gap-1 underline hover:text-[#b89655]">
                    <ShareAltOutlined /> Chia sẻ
                  </button>
                  <button className="flex items-center gap-1 underline hover:text-[#b89655]">
                    <HeartOutlined /> Lưu
                  </button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                {room.roomName}
              </h1>

              <div className="flex items-center gap-3 text-gray-500">
                <EnvironmentOutlined />
                <span>{room.address}</span>
                <span className="text-[#b89655] font-medium">
                  • Vị trí xuất sắc
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-6 mb-14">
              <InfoItem
                icon="UserOutlined"
                label="Khách tối đa"
                value="02 Người lớn"
              />
              <InfoItem icon="BlockOutlined" label="Diện tích" value="45 m²" />
              <InfoItem
                icon="CompassOutlined"
                label="Hướng nhìn"
                value="Thành phố"
              />
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-16">
              {room.roomName} mang đến không gian nghỉ dưỡng tinh tế, nội thất
              cao cấp và tầm nhìn tuyệt đẹp. Phù hợp cho kỳ nghỉ dưỡng lẫn công
              tác dài ngày.
            </p>

            {/* Amenities */}
            <div className="bg-[#f7f5f2] rounded-[32px] p-10 border border-[#e6e1d8]">
              <h3 className="text-2xl font-semibold mb-8">Tiện nghi có sẵn</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {room.amenities.map((name, i) => {
                  const a = amenities.find((x) => x.name === name);
                  const Icon = a ? (AntdIcons as any)[a.icon] : null;

                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white shadow flex items-center justify-center text-[#b89655]">
                        {Icon && <Icon />}
                      </div>
                      <span className="text-gray-600 font-medium">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside>
            <div className="sticky top-24 bg-[#f7f5f2] border border-[#e6e1d8] rounded-[32px] p-8 shadow-lg">
              <div className="mb-8">
                <span className="text-2xl font-semibold">
                  {room.basePrice.toLocaleString()}đ
                </span>
                <span className="text-gray-400"> / đêm</span>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider block mb-3">
                  Chọn ngày
                </label>
                <RangePicker
                  className="w-full rounded-xl"
                  disabledDate={(d) => d && d < dayjs().startOf("day")}
                  placeholder={["Ngày đến", "Ngày đi"]}
                  onChange={(v) => setDates(v as any)}
                  style={{ height: "44px" }}
                />
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-3 rounded-full bg-[#b89655] hover:cursor-pointer text-white font-medium tracking-widest hover:bg-[#a38345] transition mb-6"
              >
                Đặt ngay
              </button>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fffaf0] border border-[#eadfca]">
                <SafetyCertificateOutlined className="text-[#b89655] text-xl" />
                <p className="text-xs text-gray-700">
                  Cam kết hoàn tiền 100% nếu có sự cố từ khách sạn
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ================= SUB COMPONENT ================= */

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
    <div className="bg-[#f7f5f2] p-6 rounded-2xl border border-[#e6e1d8]">
      <Icon className="text-[#b89655] text-xl mb-2" />
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
