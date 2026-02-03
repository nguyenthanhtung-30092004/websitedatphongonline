"use client";

import { DatePicker, InputNumber, ConfigProvider, Popover } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

export default function SearchBox() {
  const router = useRouter();
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const guestLabel = `${adults} người lớn · ${children} trẻ em`;

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
          colorPrimary: "#f97316",
          borderRadius: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
        components: {
          DatePicker: {
            activeShadow: "none",
          },
        },
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg px-6 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Dates */}
          <div className="flex-1 bg-gray-100 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <CalendarOutlined />
              <span>Check in – Check out</span>
            </div>

            <RangePicker
              variant="borderless"
              className="w-full text-base font-medium text-gray-800 px-0"
              disabledDate={(d) => d && d < dayjs().startOf("day")}
              placeholder={["Ngày đến", "Ngày đi"]}
              onChange={(v) => setDates(v as any)}
            />
          </div>

          {/* Guests */}
          <Popover
            trigger="click"
            placement="bottom"
            content={
              <div className="space-y-4 w-56">
                {/* Adults */}
                <div className="flex justify-between items-center">
                  <span className="text-sm">Người lớn</span>
                  <InputNumber
                    min={1}
                    value={adults}
                    onChange={(v) => setAdults(v || 1)}
                  />
                </div>

                {/* Children */}
                <div className="flex justify-between items-center">
                  <span className="text-sm">Trẻ em</span>
                  <InputNumber
                    min={0}
                    value={children}
                    onChange={(v) => setChildren(v || 0)}
                  />
                </div>
              </div>
            }
          >
            <div className="w-full md:w-[240px] bg-gray-100 rounded-xl px-5 py-3 cursor-pointer">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <UserOutlined />
                <span>Guests</span>
              </div>

              <div className="text-base font-medium text-gray-800">
                {guestLabel}
              </div>
            </div>
          </Popover>

          {/* Button */}
          <button
            onClick={handleSearch}
            className="h-[60px] hover:cursor-pointer px-10 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>
      </div>
    </ConfigProvider>
  );
}
