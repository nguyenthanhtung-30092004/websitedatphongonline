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
  AppstoreOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { bookingApi } from "@/services/api/booking.api";

const DAYS_COUNT = 7;

export default function AvailabilityPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDay, setStartDay] = useState(() => dayjs().startOf("day"));

  const startDate = startDay.format("YYYY-MM-DD");
  const endDate = startDay.add(DAYS_COUNT - 1, "day").format("YYYY-MM-DD");

  const fetchMatrix = useCallback(async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getRoomMatrix(startDate, endDate);
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

  const dateList = useMemo(
    () =>
      Array.from({ length: DAYS_COUNT }, (_, i) =>
        startDay.add(i, "day").format("YYYY-MM-DD"),
      ),
    [startDay],
  );

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

  const navDays = (days: number) => {
    setStartDay((prev) => prev.add(days, "day"));
  };

  const statusConfig: any = {
    Available: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <CheckCircleOutlined className="text-sm" />,
      label: "Còn trống",
      border: "border-emerald-200",
      interactiveClass:
        "cursor-pointer hover:shadow-md hover:scale-105 hover:bg-emerald-100",
    },
    Occupied: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      icon: <UserOutlined className="text-sm" />,
      label: "Đang ở",
      border: "border-rose-200",
      interactiveClass: "cursor-not-allowed opacity-60",
    },
    Upcoming: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <ClockCircleOutlined className="text-sm" />,
      label: "Sắp đến",
      border: "border-amber-200",
      interactiveClass: "cursor-not-allowed opacity-70",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* ===== HEADER ===== */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
              <AppstoreOutlined className="text-xs" /> Booking Availability
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Tình trạng phòng trống
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-white rounded-lg border shadow-xs px-2 py-1.5">
            <Tooltip title="Tuần trước">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => navDays(-7)}
              >
                <DoubleLeftOutlined className="text-xs" />
              </button>
            </Tooltip>
            <Tooltip title="Ngày trước">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => navDays(-1)}
              >
                <LeftOutlined className="text-xs" />
              </button>
            </Tooltip>

            <div className="px-3 text-center min-w-[140px]">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Khoảng thời gian
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {dayjs(startDate).format("DD/MM")} –{" "}
                {dayjs(endDate).format("DD/MM/YYYY")}
              </div>
            </div>

            <Tooltip title="Ngày sau">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => navDays(1)}
              >
                <RightOutlined className="text-xs" />
              </button>
            </Tooltip>
            <Tooltip title="Tuần sau">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => navDays(7)}
              >
                <DoubleRightOutlined className="text-xs" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* ===== MATRIX TABLE ===== */}
        <div className="bg-white rounded-xl border shadow-xs overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-180px)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-30 bg-gray-800 text-white p-3 min-w-[200px] text-left">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <CalendarOutlined className="text-xs" /> Danh sách phòng
                    </div>
                  </th>

                  {dateList.map((d) => {
                    const isToday = d === dayjs().format("YYYY-MM-DD");
                    return (
                      <th
                        key={d}
                        className="sticky top-0 z-20 bg-gray-800 text-center min-w-[120px] p-2 border-l border-gray-700"
                      >
                        <div
                          className={`rounded px-2 py-1 inline-block ${isToday
                            ? "bg-blue-500 text-white"
                            : "text-gray-300"
                            }`}
                        >
                          <div className="text-[10px] uppercase">
                            {dayjs(d).format("ddd")}
                          </div>
                          <div className="text-sm font-semibold">
                            {dayjs(d).format("DD/MM")}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={DAYS_COUNT + 1} className="p-20 text-center">
                      <Spin tip="Đang tải dữ liệu..." size="large" />
                    </td>
                  </tr>
                ) : (
                  optimizedRooms.map((room) => (
                    <tr
                      key={room.roomId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Sticky Column */}
                      <td className="sticky left-0 bg-white z-10 p-4 border-r min-w-[200px] shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
                        <div className="font-bold text-gray-800 text-base">
                          {room.roomName}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ID: #{room.roomId}
                        </div>
                      </td>

                      {dateList.map((d) => {
                        const status = room.statusMap.get(d) || "Available";
                        const cfg = statusConfig[status];

                        return (
                          <td key={d} className="p-2 align-middle">
                            <div
                              onClick={() =>
                                handleSelect(room.roomId, d, status)
                              }
                              className={`
                                flex flex-col items-center justify-center 
                                rounded-lg border p-3 
                                transition-all duration-200 
                                ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.interactiveClass}
                              `}
                            >
                              <span className="mb-1">{cfg.icon}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                {cfg.label}
                              </span>
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

        {/* ===== LEGEND ===== */}
        <div className="flex flex-wrap justify-center gap-4 bg-white rounded-lg border py-3 px-6 shadow-xs">
          {Object.values(statusConfig).map((item: any) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${item.bg} border ${item.border}`}
              />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 pt-2 pb-8">
          Hệ thống hiển thị trạng thái phòng trực tiếp • {rooms.length} phòng khả dụng
        </div>
      </div>
    </div>
  );
}
