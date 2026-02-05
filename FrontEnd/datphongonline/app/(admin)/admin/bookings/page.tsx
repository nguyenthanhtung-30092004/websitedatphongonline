"use client";

import { useBooking } from "@/hooks/useBooking";
import { BOOKING_STATUS, BookingResponse } from "@/types/booking";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  WalletOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Tag, Space, message, Table, Select, ConfigProvider } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const Page = () => {
  /* ================== STATUS CONFIG ================== */
  const STATUS_LABEL: Record<BOOKING_STATUS, string> = {
    [BOOKING_STATUS.PENDING]: "Chờ xác nhận",
    [BOOKING_STATUS.CONFIRM]: "Đã xác nhận",
    [BOOKING_STATUS.COMPLETE]: "Hoàn thành",
    [BOOKING_STATUS.CANCEL]: "Đã huỷ",
  };

  const STATUS_COLOR: Record<BOOKING_STATUS, string> = {
    [BOOKING_STATUS.PENDING]: "#d97706", // Amber
    [BOOKING_STATUS.CONFIRM]: "#2563eb", // Blue
    [BOOKING_STATUS.COMPLETE]: "#1e3932", // Starbucks Deep Green
    [BOOKING_STATUS.CANCEL]: "#dc2626", // Red
  };

  const STATUS_BG: Record<BOOKING_STATUS, string> = {
    [BOOKING_STATUS.PENDING]: "#fffbeb",
    [BOOKING_STATUS.CONFIRM]: "#eff6ff",
    [BOOKING_STATUS.COMPLETE]: "#d4e9e2", // Starbucks Light Green
    [BOOKING_STATUS.CANCEL]: "#fef2f2",
  };

  const STATUS_ICONS: Record<BOOKING_STATUS, React.ReactNode> = {
    [BOOKING_STATUS.PENDING]: <ClockCircleOutlined />,
    [BOOKING_STATUS.CONFIRM]: <CheckCircleOutlined />,
    [BOOKING_STATUS.COMPLETE]: <CheckCircleOutlined />,
    [BOOKING_STATUS.CANCEL]: <CloseCircleOutlined />,
  };

  /* ================== HOOK ================== */
  const {
    fetchBooking,
    setConfirmBooking,
    setCompleteBooking,
    setPendingBooking,
    setCancelBooking,
  } = useBooking();

  /* ================== STATE ================== */
  const [data, setData] = useState<BookingResponse[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  /* ================== FETCH ================== */
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetchBooking();
      setData(res);
    };
    fetchBookings();
  }, []);

  /* ================== HELPERS ================== */
  const updateStatusLocal = (id: number, status: BOOKING_STATUS) => {
    setData((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleChangeStatus = async (id: number, nextStatus: BOOKING_STATUS) => {
    try {
      setLoadingId(id);

      if (nextStatus === BOOKING_STATUS.PENDING) {
        await setPendingBooking(id);
      }
      if (nextStatus === BOOKING_STATUS.CONFIRM) {
        await setConfirmBooking(id);
      }
      if (nextStatus === BOOKING_STATUS.COMPLETE) {
        await setCompleteBooking(id);
      }
      if (nextStatus === BOOKING_STATUS.CANCEL) {
        await setCancelBooking(id);
      }

      updateStatusLocal(id, nextStatus);
      message.success("Cập nhật trạng thái thành công");
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================== RENDER STATUS ================== */
  const renderStatus = (status: BOOKING_STATUS, record: BookingResponse) => (
    <Space direction="vertical" size={4} className="min-w-[140px]">
      <div
        className="px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-2 border uppercase tracking-tighter"
        style={{
          color: STATUS_COLOR[status],
          backgroundColor: STATUS_BG[status],
          borderColor: `${STATUS_COLOR[status]}20`,
        }}
      >
        {STATUS_ICONS[status]}
        {STATUS_LABEL[status]}
      </div>

      <Select
        size="small"
        variant="filled"
        value={status}
        loading={loadingId === record.id}
        className="w-full text-[11px]"
        onChange={(value) =>
          handleChangeStatus(record.id, value as BOOKING_STATUS)
        }
      >
        <Option value={BOOKING_STATUS.PENDING}>Chờ xác nhận</Option>
        <Option value={BOOKING_STATUS.CONFIRM}>Đã xác nhận</Option>
        <Option value={BOOKING_STATUS.COMPLETE}>Hoàn thành</Option>
        <Option value={BOOKING_STATUS.CANCEL}>Đã huỷ</Option>
      </Select>
    </Space>
  );

  /* ================== RENDER ================== */
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e3932",
          borderRadius: 12,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
        components: {
          Table: {
            headerBg: "#f8f9f8",
            headerColor: "#1e3932",
            headerBorderRadius: 16,
          },
        },
      }}
    >
      <div className="relative min-h-screen bg-[#FCFAF7] p-4 md:p-8 overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D4E9E2]/40 rounded-full blur-[100px] -z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#F1DEB4]/30 rounded-full blur-[80px] -z-0" />

        <div className="relative z-10 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-serif text-[#1e3932] flex items-center gap-3">
                <HomeOutlined className="text-[#C9A96A]" />
                Quản lý đặt phòng
              </h1>
              <p className="text-stone-500 font-medium italic">
                Theo dõi và điều phối lịch trình lưu trú của khách hàng
              </p>
            </div>

            {/* Stats Summary (Optional Visual Decor) */}
            <div className="flex gap-4">
              <div className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-2xl shadow-sm">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Tổng đơn
                </p>
                <p className="text-xl font-bold text-[#1e3932]">
                  {data.length}
                </p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-white overflow-hidden p-2">
            <Table
              rowKey="id"
              scroll={{ x: 1200 }}
              childrenColumnName="__children"
              dataSource={data}
              pagination={{ pageSize: 8, className: "px-6" }}
              className="custom-admin-table"
              columns={[
                {
                  title: "Khách hàng",
                  dataIndex: "userId",
                  fixed: "left",
                  render: (id) => (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1e3932] text-white flex items-center justify-center text-[10px] font-bold">
                        U{id}
                      </div>
                      <span className="font-bold text-[#1e3932]">#{id}</span>
                    </div>
                  ),
                },
                {
                  title: "Lịch trình",
                  render: (_: any, record: BookingResponse) => (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-[13px] text-stone-700 font-semibold">
                        <CalendarOutlined className="text-[#C9A96A]" />
                        {record.checkInDate.split("T")[0]}
                      </div>
                      <div className="h-4 w-[1px] bg-stone-200 ml-1.5" />
                      <div className="flex items-center gap-2 text-[13px] text-stone-400">
                        <div className="w-3 h-3 border-b-2 border-l-2 border-stone-200 rounded-bl-md ml-0.5" />
                        {record.checkOutDate.split("T")[0]}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Thông tin phòng",
                  render: (_: any, record: BookingResponse) => (
                    <div className="max-w-[200px]">
                      <p className="font-bold text-[#1e3932] truncate">
                        {record.bookingDetails?.[0]?.roomName ?? "—"}
                      </p>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1">
                        <EnvironmentOutlined />{" "}
                        {record.bookingDetails?.[0]?.address ?? "—"}
                      </p>
                    </div>
                  ),
                },
                {
                  title: "Số lượng khách",
                  render: (_: any, record: BookingResponse) => (
                    <div className="flex items-center gap-4 text-stone-600">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-stone-300">
                          Lớn
                        </span>
                        <span className="font-semibold">{record.adults}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-stone-300">
                          Trẻ em
                        </span>
                        <span className="font-semibold">{record.children}</span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Thời gian",
                  dataIndex: "totalDays",
                  render: (days) => (
                    <Tag className="rounded-full bg-stone-100 border-none font-bold text-stone-600">
                      {days} đêm
                    </Tag>
                  ),
                },
                {
                  title: "Doanh thu",
                  dataIndex: "totalPrice",
                  render: (price) => (
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-stone-300 tracking-tighter">
                        Tổng tiền
                      </span>
                      <span className="text-sm font-bold text-[#C9A96A]">
                        ₫{price.toLocaleString()}
                      </span>
                    </div>
                  ),
                },
                {
                  title: "Cập nhật trạng thái",
                  dataIndex: "status",
                  fixed: "right",
                  render: renderStatus,
                },
              ]}
            />
          </div>
        </div>

        {/* Inline CSS for Ant Table Customization */}
        <style jsx global>{`
          .custom-admin-table .ant-table {
            background: transparent !important;
          }
          .custom-admin-table .ant-table-thead > tr > th {
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.1em;
            font-weight: 800;
            padding: 20px 16px !important;
          }
          .custom-admin-table .ant-table-tbody > tr > td {
            padding: 24px 16px !important;
            border-bottom: 1px solid #f0f0f0 !important;
          }
          .custom-admin-table .ant-table-tbody > tr:hover > td {
            background-color: #f1f8f5 !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default Page;
