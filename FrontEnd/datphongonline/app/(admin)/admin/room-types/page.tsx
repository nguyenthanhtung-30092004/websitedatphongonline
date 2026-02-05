"use client";

import {
  Button,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UserOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { RoomType } from "@/types/roomType";
import { useRoomTypes } from "@/hooks/useRoomType";

// Starbucks inspired nature palette
const PRIMARY = "#1E3932"; // Deep Starbucks Green
const PRIMARY_HOVER = "#2D4F3C";
const ACCENT_GOLD = "#C9A96A";
const SOFT_MINT = "#D4E9E2";

export default function RoomTypesPage() {
  const { roomTypes, loading, createRoomType, updateRoomType, deleteRoomType } =
    useRoomTypes();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: RoomType) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      editing
        ? await updateRoomType(editing.id, values)
        : await createRoomType(values);

      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY,
          borderRadius: 16,
          fontFamily: "inherit",
        },
        components: {
          Table: {
            headerBg: "transparent",
            headerColor: PRIMARY,
            headerBorderRadius: 0,
            rowHoverBg: "#F1F8F5",
          },
          Modal: {
            borderRadiusLG: 24,
            titleFontSize: 20,
          },
          Input: {
            controlHeight: 44,
          },
          InputNumber: {
            controlHeight: 44,
          },
        },
      }}
    >
      <div className="relative overflow-hidden bg-[#FCFAF7] p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-green-900/5 min-h-[600px]">
        {/* Organic Decorative Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#F1DEB4] rounded-full blur-[80px] opacity-30 -z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-[#1E3932] leading-tight">
                Quản lý{" "}
                <span className="italic font-light text-[#2D4F3C]">
                  loại phòng
                </span>
              </h1>
              <p className="text-stone-500 font-medium max-w-md">
                Tổ chức và chuẩn hóa các hạng phòng để tối ưu hóa việc vận hành
                và báo cáo.
              </p>
            </div>

            <Button
              icon={<PlusOutlined />}
              size="large"
              onClick={openCreate}
              type="primary"
              className="h-14 px-8 rounded-2xl shadow-xl shadow-green-900/10 hover:scale-105 transition-transform border-none flex items-center bg-[#1E3932]"
            >
              Thêm loại phòng
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white overflow-hidden p-2">
            <Table
              rowKey="id"
              loading={loading}
              dataSource={roomTypes}
              pagination={{
                pageSize: 6,
                className: "px-6 pb-2",
              }}
              className="custom-admin-table"
              columns={[
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold px-4">
                      Tên loại phòng
                    </span>
                  ),
                  dataIndex: "name",
                  render: (text) => (
                    <div className="px-4">
                      <span className="text-base font-bold text-[#1E3932] tracking-tight">
                        {text}
                      </span>
                    </div>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      Số người tối đa
                    </span>
                  ),
                  dataIndex: "maxGuests",
                  align: "center",
                  render: (v) => (
                    <Tag className="px-4 py-1 rounded-full border-none bg-[#D4E9E2] text-[#1E3932] font-bold text-xs">
                      <UserOutlined className="mr-1.5" />
                      {v} người
                    </Tag>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      Mô tả đặc điểm
                    </span>
                  ),
                  dataIndex: "description",
                  ellipsis: true,
                  render: (desc) => (
                    <span className="text-stone-500 font-light italic">
                      {desc || "Chưa có mô tả..."}
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold text-right pr-8">
                      Thao tác
                    </span>
                  ),
                  align: "right",
                  width: 240,
                  render: (_, record) => (
                    <div className="flex justify-end gap-3 pr-4">
                      <Button
                        icon={<EditOutlined className="text-xs" />}
                        onClick={() => openEdit(record)}
                        className="rounded-xl border-stone-200 text-stone-600 hover:text-[#1E3932] hover:border-[#1E3932] font-bold text-[11px] uppercase tracking-tighter transition-all"
                      >
                        Sửa
                      </Button>

                      <Popconfirm
                        title="Xóa loại phòng"
                        description="Hành động này sẽ ảnh hưởng đến các phòng đang thuộc loại này. Bạn chắc chắn?"
                        okText="Xác nhận xóa"
                        cancelText="Hủy"
                        onConfirm={() => deleteRoomType(record.id)}
                        okButtonProps={{
                          danger: true,
                          className: "rounded-lg",
                        }}
                        cancelButtonProps={{ className: "rounded-lg" }}
                      >
                        <Button
                          icon={<DeleteOutlined className="text-xs" />}
                          className="rounded-xl bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-[11px] uppercase tracking-tighter transition-all border-none"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Modal Design */}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
          confirmLoading={submitting}
          centered
          width={520}
          footer={(buttons) => (
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-50">
              {buttons}
            </div>
          )}
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
              <div className="w-10 h-10 rounded-xl bg-[#D4E9E2] flex items-center justify-center text-[#1E3932]">
                <AppstoreOutlined />
              </div>
              <span className="font-serif text-[#1E3932]">
                {editing ? "Cập nhật phân loại" : "Khởi tạo hạng phòng mới"}
              </span>
            </div>
          }
        >
          <div className="py-6">
            <Form layout="vertical" form={form} requiredMark={false}>
              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Tên hiển thị
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên loại phòng" },
                ]}
              >
                <Input
                  placeholder="Ví dụ: Suite Premium, Bungalow Garden..."
                  className="rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                  prefix={<AppstoreOutlined className="text-stone-300 mr-2" />}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Sức chứa tối đa
                  </span>
                }
                name="maxGuests"
                rules={[{ required: true, message: "Vui lòng nhập số người" }]}
              >
                <InputNumber
                  className="w-full rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                  min={1}
                  prefix={<UserOutlined className="text-stone-300 mr-2" />}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Mô tả đặc điểm
                  </span>
                }
                name="description"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Mô tả ngắn gọn về không gian, trang thiết bị..."
                  className="rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all p-3"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Global Styles for Ant Table */}
        <style jsx global>{`
          .custom-admin-table .ant-table {
            background: transparent !important;
          }
          .custom-admin-table .ant-table-thead > tr > th {
            border-bottom: 1px solid #e6e1d8 !important;
            padding: 20px 16px !important;
          }
          .custom-admin-table .ant-table-tbody > tr > td {
            padding: 24px 16px !important;
            border-bottom: 1px solid #f5f5f5 !important;
          }
          .custom-admin-table .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }
          .custom-admin-table .ant-table-tbody > tr:hover > td {
            background-color: #f1f8f5 !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
