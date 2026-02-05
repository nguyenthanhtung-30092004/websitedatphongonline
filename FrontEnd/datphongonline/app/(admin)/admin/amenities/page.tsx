"use client";

import {
  Button,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAmenity } from "@/hooks/useAmenity";
import { Amenity } from "@/types/amenity";

export default function AmenitiesPage() {
  const { amenities, loading, createAmenity, updateAmenity, deleteAmenity } =
    useAmenity();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: Amenity) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      editing
        ? await updateAmenity(editing.id, values)
        : await createAmenity(values);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1E3932",
          borderRadius: 16,
          fontFamily: "inherit",
        },
        components: {
          Button: {
            controlHeightLG: 48,
            fontWeight: 600,
          },
          Table: {
            headerBg: "transparent",
            headerColor: "#1E3932",
            rowHoverBg: "#F1F8F5",
          },
          Modal: {
            borderRadiusLG: 24,
          },
        },
      }}
    >
      <div className="relative min-h-screen bg-[#FCFAF7] p-4 md:p-8 overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[120px] opacity-30 -z-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-[#1E3932] leading-tight">
                Quản lý{" "}
                <span className="italic font-light text-[#2D4F3C]">
                  tiện ích
                </span>
              </h1>
              <p className="text-stone-500 font-medium max-w-md">
                Tổ chức và định nghĩa các dịch vụ đi kèm để nâng cao trải nghiệm
                lưu trú của khách hàng.
              </p>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={openCreate}
              className="rounded-2xl shadow-xl shadow-green-900/10 hover:scale-105 transition-transform border-none flex items-center bg-[#1E3932]"
            >
              Thêm tiện ích mới
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-white overflow-hidden p-2 md:p-4">
            <Table
              rowKey="id"
              loading={loading}
              dataSource={amenities}
              pagination={{
                pageSize: 6,
                className: "px-6 pb-2",
              }}
              scroll={{ x: 600 }}
              className="custom-table"
              columns={[
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold px-4">
                      Tên tiện ích
                    </span>
                  ),
                  dataIndex: "name",
                  render: (text) => (
                    <div className="px-4">
                      <span className="text-base font-semibold text-[#1E3932] tracking-tight">
                        {text}
                      </span>
                    </div>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      Mã định danh Icon
                    </span>
                  ),
                  dataIndex: "icon",
                  align: "center",
                  render: (icon) =>
                    icon ? (
                      <Tag className="px-4 py-1.5 rounded-full border-none bg-[#D4E9E2] text-[#1E3932] font-bold text-xs uppercase tracking-tighter">
                        {icon}
                      </Tag>
                    ) : (
                      <span className="text-stone-300">—</span>
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
                        className="rounded-xl border-stone-200 text-stone-600 hover:text-[#1E3932] hover:border-[#1E3932] font-bold text-xs uppercase transition-all"
                      >
                        Sửa
                      </Button>

                      <Popconfirm
                        title="Xóa tiện ích"
                        description="Hành động này không thể hoàn tác. Bạn có chắc chắn?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => deleteAmenity(record.id)}
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          icon={<DeleteOutlined className="text-xs" />}
                          className="rounded-xl bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase transition-all"
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

        {/* Styled Modal */}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
          confirmLoading={submitting}
          centered
          width={480}
          footer={(buttons) => (
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-50">
              {buttons}
            </div>
          )}
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
              <div className="w-10 h-10 rounded-xl bg-[#D4E9E2] flex items-center justify-center text-[#1E3932]">
                <PlusOutlined />
              </div>
              <span className="text-xl font-serif text-[#1E3932]">
                {editing ? "Cập nhật không gian" : "Khởi tạo tiện ích"}
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
                  { required: true, message: "Vui lòng nhập tên tiện ích" },
                ]}
              >
                <Input
                  placeholder="Ví dụ: WiFi 6G, Bể bơi vô cực..."
                  className="h-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Icon Token
                  </span>
                }
                name="icon"
                extra={
                  <span className="text-[10px] text-stone-400">
                    Sử dụng slug icon như: wifi, tv, coffee...
                  </span>
                }
              >
                <Input
                  placeholder="wifi / tv / snowflake..."
                  className="h-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                  prefix={<SearchOutlined className="text-stone-300 mr-2" />}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Custom Global Table Styles */}
        <style jsx global>{`
          .custom-table .ant-table {
            background: transparent !important;
          }
          .custom-table .ant-table-tbody > tr > td {
            padding: 24px 16px !important;
            border-bottom: 1px solid #f5f5f5 !important;
          }
          .custom-table .ant-table-thead > tr > th {
            border-bottom: 1px solid #e6e1d8 !important;
          }
          .custom-table .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
