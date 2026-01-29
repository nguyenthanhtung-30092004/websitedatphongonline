"use client";

import { Button, Table, Popconfirm, Tag, Modal, Form, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAmenity } from "@/hooks/useAmenity";
import { Amenity } from "@/types/amenity";

const PRIMARY = "#c8a46a";
const PRIMARY_HOVER = "#b8955a";

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
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <TagsOutlined />
            Quản lý tiện ích
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý các tiện ích đi kèm phòng
          </p>
        </div>

        <Button
          icon={<PlusOutlined />}
          size="large"
          type="primary"
          onClick={openCreate}
          style={{
            background: PRIMARY,
            borderColor: PRIMARY,
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = PRIMARY_HOVER)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
        >
          Thêm tiện ích
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={amenities}
        pagination={{ pageSize: 6 }}
        className="rounded-xl overflow-hidden"
        rowClassName={() => "hover:bg-[#faf7f2] transition"}
        columns={[
          {
            title: "Tên tiện ích",
            dataIndex: "name",
            render: (text) => (
              <span className="font-medium text-gray-800">{text}</span>
            ),
          },
          {
            title: "Icon",
            dataIndex: "icon",
            align: "center",
            render: (icon) =>
              icon ? (
                <Tag color="gold" className="px-3 py-1 text-sm">
                  {icon}
                </Tag>
              ) : (
                <Tag className="px-3 py-1">—</Tag>
              ),
          },
          {
            title: "Hành động",
            align: "center",
            width: 220,
            render: (_, record) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEdit(record)}
                  style={{
                    borderColor: PRIMARY,
                    color: PRIMARY,
                    fontWeight: 500,
                  }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Xóa tiện ích này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => deleteAmenity(record.id)}
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
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        title={
          <span className="font-semibold text-gray-800">
            {editing ? "Cập nhật tiện ích" : "Thêm tiện ích"}
          </span>
        }
        okButtonProps={{
          style: {
            background: PRIMARY,
            borderColor: PRIMARY,
            fontWeight: 500,
          },
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên tiện ích"
            name="name"
            rules={[{ required: true, message: "Nhập tên tiện ích" }]}
          >
            <Input placeholder="WiFi miễn phí" />
          </Form.Item>

          <Form.Item label="Icon (tuỳ chọn)" name="icon">
            <Input placeholder="wifi / tv / snowflake..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
