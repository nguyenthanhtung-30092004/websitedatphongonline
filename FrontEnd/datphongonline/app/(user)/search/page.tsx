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
  ArrowRightOutlined,
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
      <div className="bg-[#FCFAF7] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-[2.5rem] shadow-sm space-y-6"
            >
              <Skeleton.Image
                active
                className="!w-full !h-64 !rounded-[2rem]"
              />
              <div className="px-2 pb-2">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-[#FCFAF7] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-64 h-64 bg-[#D4E9E2]/30 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 border-2 border-dashed border-[#2D4F3C]/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <Empty
            description={false}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="m-0 opacity-40"
          />
        </div>
        <h3 className="text-2xl font-serif text-[#1E3932] mb-2">
          Chưa tìm thấy phòng phù hợp
        </h3>
        <p className="text-stone-500 max-w-sm mx-auto leading-relaxed">
          Rất tiếc, hiện không có chỗ nghỉ nào khả dụng cho ngày này. Bạn hãy
          thử thay đổi ngày hoặc số lượng khách nhé.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF7] min-h-screen py-16 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-[#D4E9E2]/20 rounded-bl-[200px] -z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F1DEB4]/20 rounded-full blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Kết quả */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D4F3C]/5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-[#2D4F3C] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D4F3C]">
                Tìm kiếm hoàn tất
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1E3932]">
              Chỗ nghỉ <span className="italic font-light">khả dụng</span>
            </h2>
            <p className="text-stone-500 mt-4 flex items-center gap-2 font-medium">
              <EnvironmentOutlined className="text-[#C9A96A]" />
              Tìm thấy {rooms.length} không gian nghỉ dưỡng dành riêng cho bạn
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-tight">
              Sắp xếp:
            </span>
            <Tag className="rounded-full px-6 py-2 border border-[#D4E9E2] bg-white text-[#1E3932] font-semibold shadow-sm cursor-default">
              Giá tốt nhất
            </Tag>
          </div>
        </div>

        {/* Grid Danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-700 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={
                    room.imageUrls?.[0] ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={room.roomName}
                />

                {/* Custom Overlay Badges */}
                <div className="absolute top-5 left-5">
                  <div className="bg-[#1E3932] text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-widest">
                    <ThunderboltFilled className="text-[#F1DEB4]" />
                    Bán chạy
                  </div>
                </div>

                <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#1E3932] shadow-sm border border-white/20">
                  <span className="text-[#C9A96A]">★</span> 4.9{" "}
                  <span className="text-stone-400 font-normal ml-1">(120)</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-serif text-[#1E3932] leading-tight group-hover:text-[#2D4F3C] transition-colors">
                    {room.roomName}
                  </h3>
                </div>

                {/* Tiện ích nhanh */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-stone-300 uppercase">
                      Sức chứa
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium text-xs">
                      <UserOutlined className="text-[#C9A96A]" /> 2 Người
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-stone-100" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-stone-300 uppercase">
                      Diện tích
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium text-xs">
                      <ExpandOutlined className="text-[#C9A96A]" /> 35m²
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-stone-100" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-stone-300 uppercase">
                      Dịch vụ
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium text-xs">
                      <CoffeeOutlined className="text-[#C9A96A]" /> Free Wifi
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-stone-50 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter mb-1">
                      Giá từ
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#1E3932]">
                        {room.basePrice.toLocaleString()}đ
                      </span>
                      <span className="text-stone-400 text-xs font-medium">
                        /đêm
                      </span>
                    </div>
                  </div>

                  <button className="flex items-center justify-center w-14 h-14 bg-[#1E3932] text-white rounded-[1.25rem] hover:bg-[#2D4F3C] hover:shadow-xl hover:shadow-green-900/20 hover:-translate-y-1 transition-all duration-300 group/btn">
                    <ArrowRightOutlined className="text-lg group-hover/btn:translate-x-1 transition-transform" />
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
