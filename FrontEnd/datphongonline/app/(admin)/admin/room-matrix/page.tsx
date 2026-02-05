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
import { BookingApi } from "@/services/api/booking.api";

const DAYS_COUNT = 7;

export default function RoomMatrixPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDay, setStartDay] = useState(() => dayjs().startOf("day"));

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

  const statusConfig: any = {
    Available: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: <CheckCircleOutlined className="text-sm" />,
      label: "Trống",
      border: "border-emerald-200",
    },
    Occupied: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      icon: <UserOutlined className="text-sm" />,
      label: "Đang ở",
      border: "border-rose-200",
    },
    Upcoming: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: <ClockCircleOutlined className="text-sm" />,
      label: "Sắp đến",
      border: "border-amber-200",
    },
  };

  const navDays = (days: number) => {
    setStartDay((prev) => prev.add(days, "day"));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto space-y-4">
        {/* ===== HEADER ===== */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
              <AppstoreOutlined className="text-xs" /> Room Management
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Sơ đồ trạng thái phòng
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
                {dayjs(endDate).format("DD/MM")}
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

        {/* ===== MATRIX ===== */}
        <div className="bg-white rounded-xl border shadow-xs overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-180px)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-30 bg-gray-800 text-white p-3 min-w-[180px]">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <CalendarOutlined className="text-xs" /> Phòng
                    </div>
                  </th>

                  {dateList.map((d) => {
                    const isToday = d === dayjs().format("YYYY-MM-DD");
                    return (
                      <th
                        key={d}
                        className="sticky top-0 z-20 bg-gray-800 text-center min-w-[100px] p-2 border-l border-gray-700"
                      >
                        <div
                          className={`rounded px-1.5 py-1 inline-block ${
                            isToday ? "bg-blue-500 text-white" : "text-gray-300"
                          }`}
                        >
                          <div className="text-[10px] uppercase">
                            {dayjs(d).format("ddd")}
                          </div>
                          <div className="text-sm font-semibold">
                            {dayjs(d).format("DD")}
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
                    <td colSpan={DAYS_COUNT + 1} className="p-10 text-center">
                      <Spin tip="Đang tải dữ liệu..." size="small" />
                    </td>
                  </tr>
                ) : (
                  optimizedRooms.map((room) => (
                    <tr key={room.roomId} className="hover:bg-gray-50">
                      <td className="sticky left-0 bg-white z-10 p-3 border-r min-w-[180px]">
                        <div className="font-medium text-gray-800">
                          {room.roomName}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{room.roomId}
                        </div>
                      </td>

                      {dateList.map((d) => {
                        const status = room.statusMap.get(d) || "Available";
                        const cfg = statusConfig[status];

                        return (
                          <td key={d} className="p-2">
                            <Tooltip title={cfg.label} placement="top">
                              <div
                                className={`flex items-center justify-center rounded-lg border p-2 transition-colors hover:shadow-xs ${cfg.bg} ${cfg.border} ${cfg.text}`}
                              >
                                <span>{cfg.icon}</span>
                              </div>
                            </Tooltip>
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
        <div className="flex flex-wrap justify-center gap-3 bg-white rounded-lg border py-2 px-4 shadow-xs">
          {Object.values(statusConfig).map((item: any) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${item.bg} border ${item.border}`}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          Hiển thị {rooms.length} phòng • {DAYS_COUNT} ngày
        </div>
      </div>
    </div>
  );
}
