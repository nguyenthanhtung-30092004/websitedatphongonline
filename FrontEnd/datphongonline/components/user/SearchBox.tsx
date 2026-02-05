"use client";

import { DatePicker, InputNumber, ConfigProvider, Popover } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

export default function SearchBox() {
  const router = useRouter();
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const guestLabel = `${adults} người lớn, ${children} trẻ em`;

  const handleSearch = () => {
    if (!dates) return;
    const [checkIn, checkOut] = dates;
    router.push(
      `/search?checkIn=${checkIn.format("YYYY-MM-DD")}&checkOut=${checkOut.format(
        "YYYY-MM-DD",
      )}&adults=${adults}&children=${children}`,
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1E3932",
          borderRadius: 12,
        },
      }}
    >
      <div className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-white">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Dates Section */}
          <div className="flex-1 group hover:bg-stone-50 rounded-2xl px-6 py-3 transition-colors duration-300 border border-transparent hover:border-stone-100">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] uppercase font-bold tracking-tighter mb-1">
              <CalendarOutlined className="text-[#C9A96A]" />
              <span>Thời gian lưu trú</span>
            </div>
            <RangePicker
              variant="borderless"
              className="w-full p-0 font-medium text-stone-800"
              disabledDate={(d) => d && d < dayjs().startOf("day")}
              placeholder={["Ngày đến", "Ngày đi"]}
              onChange={(v) => setDates(v as any)}
            />
          </div>

          <div className="hidden md:block w-[1px] bg-stone-100 my-4" />

          {/* Guests Section */}
          <Popover
            trigger="click"
            placement="bottom"
            content={
              <div className="p-2 space-y-5 w-64">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-stone-700">
                    Người lớn
                  </div>
                  <InputNumber
                    min={1}
                    value={adults}
                    onChange={(v) => setAdults(v || 1)}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-stone-700">
                    Trẻ em
                  </div>
                  <InputNumber
                    min={0}
                    value={children}
                    onChange={(v) => setChildren(v || 0)}
                    className="rounded-lg"
                  />
                </div>
              </div>
            }
          >
            <div className="flex-1 group hover:bg-stone-50 rounded-2xl px-6 py-3 transition-colors duration-300 border border-transparent hover:border-stone-100 cursor-pointer">
              <div className="flex items-center gap-2 text-stone-400 text-[10px] uppercase font-bold tracking-tighter mb-1">
                <UserOutlined className="text-[#C9A96A]" />
                <span>Số lượng khách</span>
              </div>
              <div className="font-medium text-stone-800 truncate">
                {guestLabel}
              </div>
            </div>
          </Popover>

          {/* Search Action */}
          <button
            onClick={handleSearch}
            className="bg-[#1E3932] hover:bg-[#2D4F3C] text-white px-8 py-4 md:py-0 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-95"
          >
            <SearchOutlined className="text-lg" />
            <span>Tìm ngay</span>
          </button>
        </div>
      </div>
    </ConfigProvider>
  );
}
