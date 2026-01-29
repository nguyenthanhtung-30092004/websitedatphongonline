"use client";

import {
  Table,
  Button,
  Tag,
  Select,
  Modal,
  Form,
  Input,
  Popconfirm,
  Switch,
  Spin,
} from "antd";
import { LockOutlined, UnlockOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

const PRIMARY = "#c8a46a";

export default function UsersPage() {
  const {
    users,
    loading,
    submitting,
    filterUsers,
    updateUser,
    activateUser,
    deactivateUser,
  } = useUser();

  const [role, setRole] = useState<string>();
  const [isLocked, setIsLocked] = useState<boolean>();
  const [rowLoading, setRowLoading] = useState<
    Record<number, { role?: boolean; status?: boolean }>
  >({});

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const setRowActionLoading = (
    id: number,
    action: "role" | "status",
    value: boolean,
  ) => {
    setRowLoading((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [action]: value,
      },
    }));
  };

  /* ===================== FILTER ===================== */
  const onFilterChange = (nextRole?: string, nextLocked?: boolean) => {
    setRole(nextRole);
    setIsLocked(nextLocked);
    filterUsers({
      role: nextRole,
      isLocked: nextLocked,
    });
  };

  /* ===================== EDIT ===================== */
  const openEdit = (user: any) => {
    setEditing(user);
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
    setOpen(true);
  };

  const handleChangeRole = async (id: number, role: string) => {
    setRowActionLoading(id, "role", true);
    try {
      await updateUser(id, { role });
    } finally {
      setRowActionLoading(id, "role", false);
    }
  };

  const handleToggleStatus = async (id: number, checked: boolean) => {
    setRowActionLoading(id, "status", true);
    try {
      checked ? await activateUser(id) : await deactivateUser(id);
    } finally {
      setRowActionLoading(id, "status", false);
    }
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();
    await updateUser(editing.id, values);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý người dùng</h1>

      {/* ===================== FILTER ===================== */}
      <div className="flex gap-4 mb-4">
        <Select
          allowClear
          placeholder="Lọc theo role"
          style={{ width: 200 }}
          onChange={(v) => onFilterChange(v, isLocked)}
        >
          <Select.Option value="">Tất Cả</Select.Option>
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="User">User</Select.Option>
        </Select>

        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 200 }}
          onChange={(v) => onFilterChange(role, v)}
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value={false}>Hoạt động</Select.Option>
          <Select.Option value={true}>Bị khóa</Select.Option>
        </Select>
      </div>

      {/* ===================== TABLE ===================== */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={users}
        pagination={{ pageSize: 6 }}
        columns={[
          {
            title: "Họ tên",
            dataIndex: "fullName",
            render: (t) => <b>{t}</b>,
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "SĐT",
            dataIndex: "phone",
          },
          {
            title: "Role",
            dataIndex: "role",
            align: "center",
            render: (role, u) => {
              const isRoleLoading = rowLoading[u.id]?.role;

              return (
                <Select
                  value={role}
                  style={{ width: 120 }}
                  disabled={isRoleLoading}
                  suffixIcon={isRoleLoading ? <Spin size="small" /> : undefined}
                  onChange={(value) => handleChangeRole(u.id, value)}
                >
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="User">User</Select.Option>
                </Select>
              );
            },
          },

          {
            title: "Trạng thái",
            dataIndex: "isLocked",
            align: "center",
            render: (isLocked, u) => (
              <Switch
                checked={!isLocked}
                disabled={rowLoading[u.id]?.status}
                checkedChildren={
                  rowLoading[u.id]?.status ? <Spin size="small" /> : "Hoạt động"
                }
                unCheckedChildren={
                  rowLoading[u.id]?.status ? <Spin size="small" /> : "Bị khóa"
                }
                style={{
                  backgroundColor: !isLocked ? "#52c41a" : "#d9d9d9",
                }}
                onChange={(checked) => handleToggleStatus(u.id, checked)}
              />
            ),
          },

          {
            title: "Hành động",
            align: "center",
            width: 120,
            render: (_, u) => (
              <Button
                icon={<EditOutlined />}
                onClick={() => openEdit(u)}
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                Sửa
              </Button>
            ),
          },
        ]}
      />

      {/* ===================== MODAL ===================== */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleUpdate}
        confirmLoading={submitting}
        title="Cập nhật người dùng"
        okButtonProps={{ style: { background: PRIMARY } }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="SĐT" name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
