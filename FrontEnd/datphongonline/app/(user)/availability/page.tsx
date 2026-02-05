"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Spin, message, Tooltip } from "antd";
import dayjs from "dayjs";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { BookingApi } from "@/services/api/booking.api";

const DAYS_COUNT = 7;

export default function AvailabilityPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDay, setStartDay] = useState(dayjs().startOf("day"));

  const startDate = startDay.format("YYYY-MM-DD");
  const endDate = startDay.add(DAYS_COUNT - 1, "day").format("YYYY-MM-DD");

  const fetchMatrix = useCallback(async () => {
    try {
      setLoading(true);
      const res = await BookingApi.getRoomMatrix(startDate, endDate);
      setRooms(res.data);
    } catch {
      message.error("Không tải được sơ đồ phòng");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  const dateList = useMemo(() => {
    return Array.from({ length: DAYS_COUNT }, (_, i) =>
      startDay.add(i, "day").format("YYYY-MM-DD"),
    );
  }, [startDay]);

  const optimizedRooms = useMemo(() => {
    return rooms.map((r) => ({
      ...r,
      statusMap: new Map(r.days.map((d: any) => [d.date, d.status])),
    }));
  }, [rooms]);

  const handleSelect = (roomId: number, date: string, status: string) => {
    if (status !== "Available") {
      message.warning("Phòng không khả dụng ngày này");
      return;
    }
    router.push(`/checkout?roomId=${roomId}&checkIn=${date}`);
  };

  const statusConfig: any = {
    Available: {
      class:
        "bg-[#D4E9E2]/40 text-[#1E3932] cursor-pointer hover:shadow-md hover:scale-[1.02]",
      icon: <CheckCircleOutlined className="text-[#C9A96A]" />,
      label: "Còn trống",
    },
    Occupied: {
      class: "bg-rose-50 text-rose-400 cursor-not-allowed opacity-60",
      icon: <UserOutlined />,
      label: "Đang ở",
    },
    Upcoming: {
      class: "bg-amber-50 text-amber-500 cursor-not-allowed opacity-70",
      icon: <ClockCircleOutlined />,
      label: "Sắp đến",
    },
  };

  const navDays = (days: number) => {
    setStartDay((prev) => prev.add(days, "day"));
  };

  return (
    <div className="p-4 md:p-8 bg-[#FCFAF7] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E3932]/5 rounded-full">
              <CalendarOutlined className="text-[#C9A96A] text-[10px]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E3932]">
                Booking Availability
              </span>
            </div>
            <h1 className="text-4xl font-serif text-[#1E3932]">
              Tình trạng phòng trống
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex gap-1">
              <button onClick={() => navDays(-7)} className="nav-btn">
                <DoubleLeftOutlined />
              </button>
              <button onClick={() => navDays(-1)} className="nav-btn">
                <LeftOutlined />
              </button>
            </div>
            <div className="px-6 text-center min-w-[180px]">
              <div className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">
                Thời gian hiển thị
              </div>
              <span className="text-sm font-bold text-[#1E3932]">
                {dayjs(startDate).format("DD/MM")} –{" "}
                {dayjs(endDate).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => navDays(1)} className="nav-btn">
                <RightOutlined />
              </button>
              <button onClick={() => navDays(7)} className="nav-btn">
                <DoubleRightOutlined />
              </button>
            </div>
          </div>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-green-900/5 overflow-hidden">
          <div className="max-h-[75vh] overflow-auto relative">
            <table className="w-full border-collapse">
              <thead>
                <tr className="z-30">
                  {/* Sticky Góc cố định */}
                  <th className="sticky top-0 left-0 z-40 bg-[#1E3932] p-6 text-left min-w-[220px]">
                    <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-widest">
                      <AppstoreOutlined className="text-[#C9A96A]" /> Danh sách
                      phòng
                    </div>
                  </th>

                  {/* Sticky Thanh Ngày tháng */}
                  {dateList.map((d) => {
                    const isToday = d === dayjs().format("YYYY-MM-DD");
                    return (
                      <th
                        key={d}
                        className="sticky top-0 z-20 bg-[#1E3932] p-4 text-center min-w-[140px] border-l border-white/5"
                      >
                        <div
                          className={`inline-block px-3 py-1 rounded-full ${isToday ? "bg-[#C9A96A] text-white" : "text-white/40"}`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-tighter">
                            {dayjs(d).format("ddd")}
                          </div>
                          <div className="text-lg font-serif">
                            {dayjs(d).format("DD/MM")}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-50">
                {loading ? (
                  <tr>
                    <td colSpan={DAYS_COUNT + 1} className="p-32 text-center">
                      <Spin tip="Đang đồng bộ..." />
                    </td>
                  </tr>
                ) : (
                  optimizedRooms.map((room) => (
                    <tr
                      key={room.roomId}
                      className="group hover:bg-stone-50/50 transition-colors"
                    >
                      {/* Sticky Cột tên phòng */}
                      <td className="sticky left-0 z-10 bg-white p-6 border-r border-stone-100 shadow-[4px_0_8px_rgba(0,0,0,0.02)]">
                        <div className="font-bold text-[#1E3932] group-hover:text-[#C9A96A] transition-colors">
                          {room.roomName}
                        </div>
                        <div className="text-[10px] text-stone-300 uppercase tracking-widest mt-1">
                          Room ID: #{room.roomId}
                        </div>
                      </td>

                      {dateList.map((d) => {
                        const status = room.statusMap.get(d) || "Available";
                        const cfg = statusConfig[status];
                        return (
                          <td key={d} className="p-3">
                            <div
                              onClick={() =>
                                handleSelect(room.roomId, d, status)
                              }
                              className={`flex flex-col items-center justify-center rounded-2xl p-4 transition-all duration-300 border border-transparent ${cfg.class}`}
                            >
                              <span className="text-xl mb-1">{cfg.icon}</span>
                              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                {cfg.label}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-8 justify-center items-center py-6 bg-white/50 rounded-full border border-stone-100">
          {Object.keys(statusConfig).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${statusConfig[key].class.split(" ")[0]}`}
              />
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                {statusConfig[key].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nav-btn {
          @apply w-10 h-10 flex items-center justify-center rounded-xl text-stone-300 hover:bg-[#1E3932] hover:text-white transition-all duration-300;
        }
        /* Tùy chỉnh thanh cuộn cho bảng */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
