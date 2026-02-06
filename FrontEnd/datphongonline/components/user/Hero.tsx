"use client";

import SearchBox from "./SearchBox";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-[#FCFAF7] overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4E9E2] rounded-l-[100px] opacity-20 -z-0 hidden lg:block" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F1DEB4] rounded-full blur-[100px] opacity-20 -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-100 shadow-sm">
              <span className="text-[#C9A96A] text-sm animate-pulse">✦</span>
              <span className="text-[#2D4F3C] text-xs font-bold uppercase tracking-widest">
                Trải nghiệm lưu trú cao cấp
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] text-[#1E3932]">
              Tìm nơi ở <br />
              <span className="italic font-light text-[#2D4F3C]">
                yên bình
              </span>{" "}
              cho bạn
            </h1>

            <p className="text-lg text-stone-600 max-w-md leading-relaxed">
              Đặt phòng nhanh chóng – tiện lợi – minh bạch với hệ thống quản lý
              hiện đại nhất hiện nay.
            </p>
          </div>

          {/* Image with Organic Frame */}
          <div className="relative">
            <div className="relative z-10 h-[420px] md:h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/10 rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/banner.png"
                alt="Luxury Room"
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-700"
                priority
              />
            </div>

            {/* Decor */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#D4E9E2] rounded-full -z-10" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-[#C9A96A]/30 rounded-[3rem] -z-10" />
          </div>

        </div>
      </div>

      {/* Floating Search box */}
      <div className="max-w-5xl mx-auto px-6 mt-16 relative z-20">
        <SearchBox />
      </div>
    </section>
  );
}
