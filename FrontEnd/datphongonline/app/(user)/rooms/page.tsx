"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination, ConfigProvider } from "antd";
import { useRoom } from "@/hooks/useRoom";
import { useAmenity } from "@/hooks/useAmenity";
import {
  UserOutlined,
  ExpandOutlined,
  CompassOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import RoomCard from "@/components/user/RoomCard";

const PAGE_SIZE = 6;
const FEATURED_COUNT = 3;

export default function RoomsPage() {
  const { rooms, roomTypes } = useRoom();
  const { amenities } = useAmenity(); // Lấy data amenities để truyền vào RoomCard
  const [page, setPage] = useState(1);

  if (!rooms || rooms.length === 0) return null;

  const featuredRooms = rooms.slice(0, FEATURED_COUNT);
  const pagedRooms = rooms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="bg-[#FCFAF7] min-h-screen pb-24 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {rooms[0]?.imageUrls?.[0] && (
          <div className="absolute inset-0">
            <img
              src={rooms[0].imageUrls[0]}
              className="w-full h-full object-cover scale-105"
              alt="Hero background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E3932]/60 via-[#1E3932]/30 to-[#FCFAF7]" />
          </div>
        )}

        {/* Decorative Organic Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4E9E2]/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F1DEB4]/20 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-6">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[#C9A96A] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            ✦ Trải nghiệm không gian sống ✦
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight drop-shadow-sm">
            Phòng &{" "}
            <span className="italic font-light text-[#D4E9E2]">Suites</span>
          </h1>
        </div>
      </section>

      {/* ================= FLOATING FILTER BAR ================= */}
      <section className="relative z-30 -mt-16 px-6">
        <div className="relative max-w-5xl mx-auto">
          {/* decorative blur */}
          <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-green-200/30 via-emerald-100/30 to-lime-200/30 blur-xl" />

          <div
            className="
      relative
      bg-white/80 backdrop-blur-2xl
      rounded-[2.5rem]
      shadow-xl shadow-emerald-900/10
      border border-white
      px-4 py-4 md:px-6
    "
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* CHECK IN */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-green-50/60 transition">
                <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <CalendarOutlined />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nhận phòng</p>
                  <p className="font-semibold text-gray-800">22 Tháng 1</p>
                </div>
              </div>

              {/* CHECK OUT */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-green-50/60 transition">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CalendarOutlined />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trả phòng</p>
                  <p className="font-semibold text-gray-800">28 Tháng 1</p>
                </div>
              </div>

              {/* GUEST */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-green-50/60 transition">
                <div className="w-11 h-11 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
                  <UserOutlined />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Khách hàng</p>
                  <p className="font-semibold text-gray-800">02 Người lớn</p>
                </div>
              </div>

              {/* CTA */}
              <button
                className="
            h-14 md:h-[3.75rem]
            w-full
            rounded-2xl
            bg-gradient-to-br from-[#1E3932] to-[#2D6A4F]
            text-white
            font-semibold
            tracking-wide
            shadow-lg shadow-emerald-900/25
            hover:scale-[1.02] hover:shadow-xl
            active:scale-95
            transition-all duration-300
          "
              >
                Kiểm tra phòng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED: ALTERNATING LAYOUT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-48">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-[#C9A96A] text-xs font-bold uppercase tracking-[0.4em] mb-4">
            Bộ sưu tập giới hạn
          </h2>
          <p className="text-4xl md:text-5xl font-serif text-[#1E3932] leading-tight">
            Những không gian{" "}
            <span className="italic text-[#2D4F3C]">đáng trải nghiệm nhất</span>{" "}
            tại resort
          </p>
        </div>

        {featuredRooms.map((room, index) => {
          const reverse = index % 2 === 1;
          const typeInfo = roomTypes.find((t) => t.id === room.roomTypeId);

          return (
            <div
              key={room.id}
              className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center"
            >
              <div
                className={`lg:col-span-7 relative group ${reverse ? "lg:order-2" : "lg:order-1"
                  }`}
              >
                <div className="absolute inset-0 bg-[#D4E9E2] rounded-[3rem] translate-x-6 translate-y-6 -z-10 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
                <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3]">
                  <img
                    src={room.imageUrls[0]}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt={room.roomName}
                  />
                </div>
              </div>

              <div
                className={`lg:col-span-5 ${reverse ? "lg:order-1 text-right" : "lg:order-2"}`}
              >
                <div
                  className={`flex items-center gap-1 mb-6 ${reverse ? "justify-end" : ""}`}
                >
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#C9A96A] text-[10px]">
                      ★
                    </span>
                  ))}
                </div>

                <h3 className="text-4xl font-serif text-[#1E3932] mb-4 leading-tight group-hover:text-[#2D4F3C]">
                  {room.roomName}
                </h3>
                <p className="text-[#C9A96A] font-bold text-xs uppercase tracking-widest mb-8">
                  {room.roomTypeName}
                </p>

                <p className="text-stone-500 text-lg leading-relaxed font-light italic mb-10">
                  "
                  {typeInfo?.description ||
                    "Không gian tinh tế được thiết kế để mang lại sự tĩnh tại tuyệt đối."}
                  "
                </p>

                <div
                  className={`grid grid-cols-2 gap-8 mb-12 ${reverse ? "text-right" : ""}`}
                >
                  <SpecItem
                    reverse={reverse}
                    icon={<UserOutlined />}
                    label="Sức chứa"
                    value={`${typeInfo?.maxGuests || 2} khách`}
                  />
                  <SpecItem
                    reverse={reverse}
                    icon={<ExpandOutlined />}
                    label="Diện tích"
                    value={typeInfo?.description?.match(/\d+m²/)?.[0] || "35m²"}
                  />
                  <SpecItem
                    reverse={reverse}
                    icon={<CompassOutlined />}
                    label="Hướng nhìn"
                    value={
                      typeInfo?.description?.match(/hướng\s\w+/)?.[0] ||
                      "Sân vườn"
                    }
                  />
                  <SpecItem
                    reverse={reverse}
                    icon={<EnvironmentOutlined />}
                    label="Vị trí"
                    value="Khu biệt lập"
                  />
                </div>

                <div
                  className={`flex items-center gap-6 ${reverse ? "justify-end" : ""}`}
                >
                  <div>
                    <span className="block text-[10px] font-bold text-stone-300 uppercase tracking-tighter">
                      Giá từ
                    </span>
                    <span className="text-3xl font-bold text-[#1E3932]">
                      {room.basePrice.toLocaleString()}đ
                    </span>
                  </div>
                  <Link
                    href={`/room-detail/${room.id}`}
                    className="px-10 py-4 bg-[#1E3932] text-white rounded-2xl font-bold text-sm hover:bg-[#2D4F3C] transition-all shadow-xl shadow-green-900/10 group/btn"
                  >
                    Khám phá{" "}
                    <ArrowRightOutlined
                      className={`ml-2 transition-transform group-hover/btn:translate-x-1`}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ================= ALL ROOMS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-stone-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-serif text-[#1E3932]">
              Danh sách phòng
            </h2>
            <div className="w-16 h-1 bg-[#C9A96A] mt-4 rounded-full" />
          </div>
          <p className="text-stone-400 text-sm font-medium">
            Hiển thị {pagedRooms.length} trong tổng số {rooms.length} phòng khả
            dụng
          </p>
        </div>

        {/* Sử dụng RoomCard component đã định nghĩa trước đó */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {pagedRooms.map((room) => (
            <RoomCard key={room.id} room={room} amenities={amenities} />
          ))}
        </div>

        <div className="flex justify-center mt-20">
          <ConfigProvider
            theme={{
              token: { colorPrimary: "#1E3932", borderRadius: 12 },
            }}
          >
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={rooms.length}
              onChange={setPage}
              showSizeChanger={false}
              className="bg-white px-8 py-4 rounded-full shadow-sm border border-stone-100"
            />
          </ConfigProvider>
        </div>
      </section>
    </main>
  );
}

/* ================= HELPER COMPONENTS ================= */

function FilterItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="px-6 py-4 hover:bg-stone-50 rounded-[1.5rem] transition-colors cursor-pointer group">
      <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        <span className="text-[#C9A96A]">{icon}</span>
        {label}
      </div>
      <p className="text-[#1E3932] font-bold">{value}</p>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
  reverse,
}: {
  icon: any;
  label: string;
  value: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${reverse ? "flex-row-reverse" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1E3932] shrink-0 border border-stone-50">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">
          {label}
        </span>
        <span className="text-sm font-semibold text-stone-700">{value}</span>
      </div>
    </div>
  );
}
