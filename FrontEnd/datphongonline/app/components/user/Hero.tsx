"use client";

import SearchBox from "./SearchBox";

export default function Hero() {
  return (
    <section className="bg-[#f5f3f0]">
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <span className="text-[#b8955a] font-medium">
            ✦ Trải nghiệm lưu trú cao cấp
          </span>

          <h1 className="text-4xl md:text-5xl font-semibold mt-4 mb-6">
            Tìm nơi ở <br /> phù hợp nhất cho bạn
          </h1>

          <p className="text-gray-600 mb-10">
            Đặt phòng nhanh chóng – tiện lợi – minh bạch với hệ thống quản lý
            hiện đại.
          </p>

          <SearchBox />
        </div>

        {/* Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300">
          <img
            src="/banner.png"
            alt="Room"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
