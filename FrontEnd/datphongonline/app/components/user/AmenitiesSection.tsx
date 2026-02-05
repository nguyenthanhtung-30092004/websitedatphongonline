"use client";

import {
  WifiOutlined,
  CoffeeOutlined,
  AimOutlined,
  CarOutlined,
} from "@ant-design/icons";

export default function AmenitiesSection() {
  const items = [
    { name: "Wifi tốc độ cao", icon: <WifiOutlined /> },
    { name: "Bữa sáng Organic", icon: <CoffeeOutlined /> },
    { name: "Gym & Yoga", icon: <AimOutlined /> },
    { name: "Đưa đón sân bay", icon: <CarOutlined /> },
  ];

  return (
    <section className="bg-[#FCFAF7] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[#1E3932] mb-4">
            Tiện ích đặc quyền
          </h2>
          <p className="text-stone-500">Nâng tầm trải nghiệm kỳ nghỉ của bạn</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {items.map((item) => (
            <div
              key={item.name}
              className="group bg-white p-10 rounded-[2.5rem] border border-stone-100 hover:border-[#D4E9E2] transition-all duration-500 text-center hover:-translate-y-2 shadow-sm hover:shadow-xl hover:shadow-green-900/5"
            >
              <div className="text-3xl mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E9E2] text-[#1E3932] group-hover:bg-[#1E3932] group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="font-bold text-stone-800 tracking-tight">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
