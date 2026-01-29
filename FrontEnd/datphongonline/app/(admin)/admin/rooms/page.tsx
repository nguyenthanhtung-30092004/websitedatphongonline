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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAmenity } from "@/hooks/useAmenity";
import { useRoomTypes } from "@/hooks/useRoomType";
import { useRoom } from "@/hooks/useRoom";

const PRIMARY = "#c8a46a";
const PRIMARY_HOVER = "#b8955a";

export default function RoomsPage() {
  const { rooms, loading, submitting, createRoom, updateRoom, deleteRoom } =
    useRoom();
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

      // map tên tiện ích -> id
      amenityIds: amenities
        .filter((a) => record.amenities?.includes(a.name))
        .map((a) => a.id),
    });

    // map ảnh cloudinary -> Upload
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
      images: files
        .filter((f) => f.originFileObj) // chỉ upload ảnh mới
        .map((f) => f.originFileObj),
    };

    editing ? await updateRoom(editing.id, payload) : await createRoom(payload);

    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <HomeOutlined />
            Quản lý phòng
          </h1>
          <p className="text-sm text-gray-500">
            Thêm, chỉnh sửa phòng và tiện ích
          </p>
        </div>

        <Button
          icon={<PlusOutlined />}
          size="large"
          type="primary"
          onClick={openCreate}
          style={{ background: PRIMARY, borderColor: PRIMARY }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = PRIMARY_HOVER)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = PRIMARY)}
        >
          Thêm phòng
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={rooms}
        pagination={{ pageSize: 6 }}
        rowClassName={() => "hover:bg-[#faf7f2] transition"}
        columns={[
          {
            title: "Tên phòng",
            dataIndex: "roomName",
            render: (t) => <b>{t}</b>,
          },
          {
            title: "Địa điểm",
            dataIndex: "address",
            render: (t) => <p>{t}</p>,
          },
          {
            title: "Loại Phòng",
            dataIndex: "roomTypeName",
            render: (t) => <p>{t}</p>,
          },
          {
            title: "Giá",
            dataIndex: "basePrice",
            render: (v) => `${v.toLocaleString()} đ`,
          },
          {
            title: "Tiện ích",
            dataIndex: "amenities",
            render: (list: string[]) =>
              list?.map((a) => (
                <Tag key={a} color="gold">
                  {a}
                </Tag>
              )),
          },
          {
            title: "Hành động",
            align: "center",
            width: 220,
            render: (_, r) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEdit(r)}
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Xóa phòng này?"
                  onConfirm={() => deleteRoom(r.id)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    style={{
                      backgroundColor: "#d46b6b",
                      borderColor: "#d46b6b",
                      color: "#fff",
                    }}
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
        onCancel={() => !submitting && setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        title={editing ? "Cập nhật phòng" : "Thêm phòng"}
        okButtonProps={{
          disabled: submitting,
          style: { background: PRIMARY, borderColor: PRIMARY },
        }}
        cancelButtonProps={{
          disabled: submitting,
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên phòng"
            name="roomName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Giá" name="basePrice" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            label="Loại phòng"
            name="roomTypeId"
            rules={[{ required: true }]}
          >
            <Select>
              {roomTypes.map((r: any) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Tiện ích" name="amenityIds">
            <Checkbox.Group className="grid grid-cols-3 gap-2">
              {amenities.map((a: any) => (
                <Checkbox key={a.id} value={a.id}>
                  {a.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="Ảnh phòng">
            <Upload
              multiple
              listType="picture-card"
              beforeUpload={() => false}
              fileList={files}
              onChange={({ fileList }) => setFiles(fileList)}
            >
              <UploadOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
