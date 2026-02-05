"use client";

import {
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Upload,
  Tag,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAmenity } from "@/hooks/useAmenity";
import { useRoomTypes } from "@/hooks/useRoomType";
import { useRoom } from "@/hooks/useRoom";

const PRIMARY = "#1E3932"; // Deep Starbucks Green
const PRIMARY_HOVER = "#2D4F3C";
const ACCENT_GOLD = "#C9A96A";

export default function RoomsPage() {
  const { rooms, loading, submitting, createRoom, updateRoom, deleteRoom } =
    useRoom();
  console.log(rooms);
  const { amenities } = useAmenity();
  const { roomTypes } = useRoomTypes();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<any[]>([]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setFiles([]);
    setOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);

    form.setFieldsValue({
      roomName: record.roomName,
      address: record.address,
      basePrice: record.basePrice,
      roomTypeId: record.roomTypeId,

      amenityIds: amenities
        .filter((a) => record.amenities?.includes(a.name))
        .map((a) => a.id),
    });

    setFiles(
      record.imagesUrls?.map((url: string, i: number) => ({
        uid: `old-${i}`,
        name: `image-${i}`,
        status: "done",
        url,
      })) || [],
    );

    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      images: files.filter((f) => f.originFileObj).map((f) => f.originFileObj),
    };

    editing ? await updateRoom(editing.id, payload) : await createRoom(payload);

    setOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY,
          borderRadius: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
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
          Button: {
            controlHeightLG: 48,
          },
        },
      }}
    >
      <div className="relative overflow-hidden bg-[#FCFAF7] p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-green-900/5 min-h-screen">
        {/* Decorative Nature Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[120px] opacity-40 -z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[100px] opacity-30 -z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-[#1E3932] leading-tight">
                Danh sách{" "}
                <span className="italic font-light text-[#2D4F3C]">
                  phòng lưu trú
                </span>
              </h1>
              <p className="text-stone-500 font-medium max-w-md">
                Quản lý các không gian nghỉ dưỡng, điều chỉnh giá và cập nhật
                tiện ích đi kèm.
              </p>
            </div>

            <Button
              icon={<PlusOutlined />}
              size="large"
              type="primary"
              onClick={openCreate}
              className="h-14 px-8 rounded-2xl shadow-xl shadow-green-900/10 hover:scale-105 transition-transform border-none flex items-center bg-[#1E3932]"
            >
              Thêm phòng mới
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white overflow-hidden p-2">
            <Table
              rowKey="id"
              loading={loading}
              dataSource={rooms}
              tableLayout="fixed"
              pagination={{
                pageSize: 6,
                className: "px-6 pb-4",
              }}
              className="custom-admin-table"
              columns={[
                {
                  title: "TÊN PHÒNG",
                  dataIndex: "roomName",
                  width: 220,
                  fixed: "left",
                  render: (t) => (
                    <div className="space-y-1">
                      <div className="font-semibold text-[#16352F] text-base leading-snug">
                        {t}
                      </div>
                    </div>
                  ),
                },

                {
                  title: "VỊ TRÍ",
                  dataIndex: "address",
                  width: 200,
                  render: (t) => (
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <EnvironmentOutlined className="text-[#C9A96A]" />
                      <span className="truncate">{t}</span>
                    </div>
                  ),
                },

                {
                  title: "PHÂN LOẠI",
                  dataIndex: "roomTypeName",
                  width: 260,
                  render: (t) => (
                    <Tag
                      className="
            max-w-full
            truncate
            rounded-full
            px-4 py-1
            bg-[#F1F8F5]
            text-[#1E3932]
            font-medium
            text-xs
            border-none
          "
                    >
                      {t}
                    </Tag>
                  ),
                },

                {
                  title: "GIÁ CƠ BẢN",
                  dataIndex: "basePrice",
                  width: 160,
                  align: "right",
                  render: (v) => (
                    <div className="text-right leading-tight">
                      <div className="text-lg font-semibold text-[#C9A96A]">
                        {v.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-stone-400">
                        VNĐ / đêm
                      </div>
                    </div>
                  ),
                },

                {
                  title: "TIỆN ÍCH",
                  dataIndex: "amenities",
                  width: 260,
                  render: (list: string[]) => (
                    <div className="flex flex-wrap gap-1 max-w-full">
                      {list?.slice(0, 4).map((a) => (
                        <Tag
                          key={a}
                          className="m-0 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium border-none"
                        >
                          {a}
                        </Tag>
                      ))}
                      {list?.length > 4 && (
                        <span className="text-[10px] text-stone-400 ml-1">
                          +{list.length - 4}
                        </span>
                      )}
                    </div>
                  ),
                },

                {
                  title: "THAO TÁC",
                  fixed: "right",
                  width: 140,
                  align: "right",
                  render: (_, r) => (
                    <div className="flex justify-end gap-2">
                      <Button
                        icon={<EditOutlined />}
                        className="rounded-full border-stone-300"
                        onClick={() => openEdit(r)}
                      />
                      <Popconfirm
                        title="Xóa phòng?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => deleteRoom(r.id)}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          className="rounded-full"
                        />
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={open}
          onCancel={() => !submitting && setOpen(false)}
          onOk={handleSubmit}
          confirmLoading={submitting}
          centered
          width={700}
          okText={editing ? "Cập nhật không gian" : "Khởi tạo phòng"}
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
              <div className="w-10 h-10 rounded-xl bg-[#D4E9E2] flex items-center justify-center text-[#1E3932]">
                <HomeOutlined />
              </div>
              <span className="font-serif text-[#1E3932]">
                {editing ? "Hiệu chỉnh thông tin phòng" : "Thêm không gian mới"}
              </span>
            </div>
          }
          okButtonProps={{
            disabled: submitting,
            className:
              "h-12 px-8 rounded-2xl bg-[#1E3932] border-none font-bold tracking-tight",
          }}
          cancelButtonProps={{
            disabled: submitting,
            className:
              "h-12 px-6 rounded-2xl border-stone-200 text-stone-500 font-bold",
          }}
        >
          <div className="py-6 max-h-[70vh] overflow-y-auto px-1">
            <Form layout="vertical" form={form} requiredMark={false}>
              <div className="grid md:grid-cols-2 gap-x-6">
                <Form.Item
                  label={
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                      Tên phòng nghỉ
                    </span>
                  }
                  name="roomName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên phòng" },
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined className="text-stone-300 mr-2" />}
                    placeholder="Ví dụ: Ocean Suite 302"
                    className="rounded-2xl bg-stone-50 border-stone-100 h-12 focus:bg-white transition-all"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                      Giá mỗi đêm (VNĐ)
                    </span>
                  }
                  name="basePrice"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá phòng" },
                  ]}
                >
                  <InputNumber
                    prefix={<DollarOutlined className="text-stone-300 mr-2" />}
                    className="w-full rounded-2xl bg-stone-50 border-stone-100 h-12 flex items-center focus:bg-white transition-all"
                    min={0}
                    placeholder="1,500,000"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Địa chỉ chi tiết / Vị trí
                  </span>
                }
                name="address"
              >
                <Input
                  prefix={
                    <EnvironmentOutlined className="text-stone-300 mr-2" />
                  }
                  placeholder="Khu B, Tầng 3..."
                  className="rounded-2xl bg-stone-50 border-stone-100 h-12 focus:bg-white transition-all"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Hạng phòng
                  </span>
                }
                name="roomTypeId"
                rules={[
                  { required: true, message: "Vui lòng chọn loại phòng" },
                ]}
              >
                <Select
                  placeholder="Lựa chọn phân loại..."
                  suffixIcon={<AppstoreOutlined className="text-stone-400" />}
                  className="custom-select"
                >
                  {roomTypes.map((r: any) => (
                    <Select.Option key={r.id} value={r.id}>
                      {r.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="bg-[#FCFAF7] p-6 rounded-[2rem] border border-stone-100 mb-6">
                <Form.Item
                  label={
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-4 block">
                      Tiện ích đi kèm
                    </span>
                  }
                  name="amenityIds"
                >
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                      {amenities.map((a: any) => (
                        <Checkbox
                          key={a.id}
                          value={a.id}
                          className="text-stone-600 font-medium"
                        >
                          {a.name}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-4">
                    Hình ảnh không gian
                  </span>
                }
              >
                <Upload
                  multiple
                  listType="picture-card"
                  beforeUpload={() => false}
                  fileList={files}
                  onChange={({ fileList }) => setFiles(fileList)}
                  className="custom-uploader"
                >
                  <div className="flex flex-col items-center gap-1">
                    <UploadOutlined className="text-[#1E3932] text-lg" />
                    <span className="text-[10px] font-bold text-[#1E3932] uppercase">
                      Tải ảnh
                    </span>
                  </div>
                </Upload>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* CSS Scoped for Ant Override */}
        <style jsx global>{`
          .custom-admin-table .ant-table-thead > tr > th {
            border-bottom: 1px solid #e6e1d8 !important;
            padding: 20px 16px !important;
          }
          .custom-admin-table .ant-table-tbody > tr > td {
            padding: 20px 16px !important;
            border-bottom: 1px solid #f5f5f5 !important;
          }
          .custom-admin-table .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }
          .custom-select .ant-select-selector {
            border-radius: 16px !important;
            background-color: #f8f7f5 !important;
            border: 1px solid #f1f0ee !important;
            height: 48px !important;
            padding: 8px 16px !important;
          }
          .custom-uploader .ant-upload.ant-upload-select {
            border-radius: 20px !important;
            background-color: #f1f8f5 !important;
            border: 2px dashed #d4e9e2 !important;
          }
          .custom-uploader .ant-upload-list-item {
            border-radius: 20px !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
