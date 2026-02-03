"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton, Badge, Tag, Empty } from "antd";
import {
  UserOutlined,
  ExpandOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useBooking } from "@/hooks/useBooking";

export default function SearchPage() {
  const params = useSearchParams();
  const { rooms, loading, searchRooms } = useBooking();

  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = Number(params.get("adults"));
  const children = Number(params.get("children"));

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    searchRooms({
      checkIn,
      checkOut,
      adults,
      children,
    });
  }, [checkIn, checkOut, adults, children]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton.Image active className="!w-full !h-64 rounded-3xl" />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Empty
          description={
            <span className="text-slate-400">
              Rất tiếc, không tìm thấy phòng phù hợp cho ngày này.
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Kết quả */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Chỗ nghỉ khả dụng
            </h2>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <EnvironmentOutlined /> Tìm thấy {rooms.length} lựa chọn tốt nhất
              dành cho bạn
            </p>
          </div>
          <div className="hidden md:block">
            <Tag
              color="blue"
              className="rounded-full px-4 py-1 border-none bg-blue-50 text-blue-600 font-medium"
            >
              Sắp xếp theo: Giá tốt nhất
            </Tag>
          </div>
        </div>

        {/* Grid Danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    room.imageUrls?.[0] ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={room.roomName}
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    count="Bán chạy"
                    style={{
                      backgroundColor: "#0f172a",
                      borderRadius: "8px",
                      padding: "0 12px",
                    }}
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  ⭐ 4.9 (120 đánh giá)
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {room.roomName}
                  </h3>
                </div>

                {/* Tiện ích nhanh */}
                <div className="flex gap-4 mb-6 text-slate-400 text-sm">
                  <span className="flex items-center gap-1.5">
                    <UserOutlined className="text-[12px]" /> 2 Người
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ExpandOutlined className="text-[12px]" /> 35m²
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CoffeeOutlined className="text-[12px]" /> Free Wifi
                  </span>
                </div>

                <div className="h-[1px] w-full bg-slate-50 mb-6" />

                {/* Footer Card */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Giá mỗi đêm
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">
                        {room.basePrice.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  <button className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 hover:-rotate-12 transition-all shadow-lg shadow-slate-200">
                    <ThunderboltFilled />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
