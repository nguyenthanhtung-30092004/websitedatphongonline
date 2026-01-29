"use client";
const PRIMARY = "#c8a46a";
const PRIMARY_HOVER = "#b8955a";

import {
  Button,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RoomType } from "@/types/roomType";
import { useRoomTypes } from "@/hooks/useRoomType";

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
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý loại phòng
          </h1>
          <p className="text-sm text-gray-500">
            Thêm, chỉnh sửa và quản lý các loại phòng
          </p>
        </div>

        <Button
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          type="primary"
          style={{
            background: PRIMARY,
            borderColor: PRIMARY,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = PRIMARY_HOVER)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
        >
          Thêm loại phòng
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={roomTypes}
        pagination={{ pageSize: 6 }}
        className="rounded-xl overflow-hidden"
        rowClassName={() => "hover:bg-[#faf7f2] transition"}
        columns={[
          {
            title: "Tên loại phòng",
            dataIndex: "name",
            render: (text) => (
              <span className="font-medium text-gray-800">{text}</span>
            ),
          },
          {
            title: "Số người tối đa",
            dataIndex: "maxGuests",
            align: "center",
            render: (v) => (
              <Tag color="gold" className="font-medium">
                {v} người
              </Tag>
            ),
          },
          {
            title: "Mô tả",
            dataIndex: "description",
            ellipsis: true,
          },
          {
            title: "Hành động",
            align: "center",
            render: (_, record) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEdit(record)}
                  style={{
                    color: "black",
                    borderColor: PRIMARY,
                    fontWeight: "500",
                  }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => deleteRoomType(record.id)}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    style={{
                      backgroundColor: "#d46b6b",
                      borderColor: "#d46b6b",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#cf5656")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d46b6b")
                    }
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      {/* Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        cancelButtonProps={{
          style: {
            borderColor: PRIMARY,
            color: PRIMARY,
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = PRIMARY;
            e.currentTarget.style.color = "#fff";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = PRIMARY;
          },
        }}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        okButtonProps={{
          style: {
            background: PRIMARY,
            borderColor: PRIMARY,
          },
        }}
        title={
          <span className="font-semibold text-gray-800">
            {editing ? "Cập nhật loại phòng" : "Thêm loại phòng"}
          </span>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên loại phòng"
            name="name"
            rules={[{ required: true, message: "Nhập tên loại phòng" }]}
          >
            <Input placeholder="Phòng Deluxe" />
          </Form.Item>

          <Form.Item
            label="Số người tối đa"
            name="maxGuests"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
