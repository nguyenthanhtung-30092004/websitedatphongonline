"use client";

import { useBooking } from "@/hooks/useBooking";
import { BOOKING_STATUS, BookingResponse } from "@/types/booking";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Tag, Button, Space, Popconfirm, message, Table, Select } from "antd";
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
    [BOOKING_STATUS.PENDING]: "orange",
    [BOOKING_STATUS.CONFIRM]: "blue",
    [BOOKING_STATUS.COMPLETE]: "green",
    [BOOKING_STATUS.CANCEL]: "red",
  };

  /* ================== HOOK ================== */
  const {
    fetchBooking,
    setConfirmBooking,
    setCompleteBooking,
    cancelBooking,
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
      console.log(res);
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
    <Space direction="vertical">
      <Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>

      <Select
        size="small"
        value={status}
        loading={loadingId === record.id}
        style={{ width: 160 }}
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
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <HomeOutlined />
            Quản lý đặt phòng
          </h1>
          <p className="text-sm text-gray-500">Cập nhật trạng thái booking</p>
        </div>

        {/* <Button icon={<PlusOutlined />} size="large" type="primary">
          Thêm phòng
        </Button> */}
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        childrenColumnName="__children"
        dataSource={data}
        columns={[
          {
            title: "User ID",
            dataIndex: "userId",
          },
          {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            render: (d: string) => d.split("T")[0],
          },
          {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            render: (d: string) => d.split("T")[0],
          },
          {
            title: "Phòng",
            render: (_: any, record: BookingResponse) =>
              record.bookingDetails?.[0]?.roomName ?? "—",
          },
          {
            title: "Địa chỉ",
            render: (_: any, record: BookingResponse) =>
              record.bookingDetails?.[0]?.address ?? "—",
          },

          {
            title: "Người lớn",
            dataIndex: "adults",
          },
          {
            title: "Trẻ em",
            dataIndex: "children",
          },
          {
            title: "Số ngày",
            dataIndex: "totalDays",
          },
          {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: renderStatus,
          },
        ]}
      />
    </div>
  );
};

export default Page;
