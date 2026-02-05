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
  ConfigProvider,
  Avatar,
} from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  UserOutlined,
  FilterOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

const PRIMARY_GREEN = "#1E3932";
const MINT_GREEN = "#D4E9E2";
const SOFT_CREAM = "#FCFAF7";
const GOLDEN = "#C9A96A";

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_GREEN,
          borderRadius: 16,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
        components: {
          Table: {
            headerBg: "transparent",
            headerColor: PRIMARY_GREEN,
            rowHoverBg: "#F1F8F5",
          },
          Select: {
            controlHeight: 42,
          },
        },
      }}
    >
      <div className="relative min-h-screen bg-[#FCFAF7] p-4 md:p-10 overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[120px] opacity-30 -z-0" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E3932]/5 rounded-full mb-1">
                <TeamOutlined className="text-[#1E3932] text-xs" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E3932]">
                  Hệ thống nhân sự
                </span>
              </div>
              <h1 className="text-4xl font-serif text-[#1E3932] leading-tight">
                Quản lý{" "}
                <span className="italic font-light text-[#2D4F3C]">
                  người dùng
                </span>
              </h1>
              <p className="text-stone-500 font-medium max-w-md">
                Phân quyền truy cập và giám sát trạng thái hoạt động của các
                thành viên trong hệ thống.
              </p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-3 bg-white/60 backdrop-blur-xl p-2 rounded-[2rem] border border-white shadow-sm">
              <div className="flex items-center gap-2 pl-4 text-stone-400">
                <FilterOutlined className="text-xs" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Bộ lọc
                </span>
              </div>
              <Select
                allowClear
                placeholder="Phân quyền"
                style={{ width: 160 }}
                className="custom-select-minimal"
                onChange={(v) => onFilterChange(v, isLocked)}
              >
                <Select.Option value="">Tất Cả Vai Trò</Select.Option>
                <Select.Option value="Admin">Quản trị viên</Select.Option>
                <Select.Option value="User">Người dùng</Select.Option>
              </Select>

              <Select
                allowClear
                placeholder="Trạng thái"
                style={{ width: 160 }}
                className="custom-select-minimal"
                onChange={(v) => onFilterChange(role, v)}
              >
                <Select.Option value="">Tất Cả Trạng Thái</Select.Option>
                <Select.Option value={false}>Đang Hoạt động</Select.Option>
                <Select.Option value={true}>Đã Bị khóa</Select.Option>
              </Select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-white overflow-hidden p-2 md:p-6">
            <Table
              rowKey="id"
              loading={loading}
              dataSource={users}
              pagination={{
                pageSize: 6,
                className: "px-6 pb-2",
              }}
              scroll={{ x: 1000 }}
              className="custom-admin-table"
              columns={[
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold px-4">
                      Thành viên
                    </span>
                  ),
                  dataIndex: "fullName",
                  render: (t, u) => (
                    <div className="flex items-center gap-4 px-4 py-1">
                      <Avatar
                        src={u.avatar}
                        icon={<UserOutlined />}
                        className="bg-[#D4E9E2] text-[#1E3932] border-2 border-white shadow-sm"
                        size={44}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-[#1E3932] tracking-tight">
                          {t}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">
                          ID: #{u.id}
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                      Liên hệ
                    </span>
                  ),
                  render: (_, u) => (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
                        <MailOutlined className="text-[#C9A96A]" /> {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                        <PhoneOutlined className="text-[#C9A96A]" />{" "}
                        {u.phone || "Chưa cập nhật"}
                      </div>
                    </div>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold text-center">
                      Vai trò
                    </span>
                  ),
                  dataIndex: "role",
                  align: "center",
                  render: (role, u) => {
                    const isRoleLoading = rowLoading[u.id]?.role;
                    return (
                      <Select
                        value={role}
                        variant="borderless"
                        className={`rounded-full px-2 font-bold text-xs uppercase tracking-tighter w-32 ${
                          role === "Admin"
                            ? "bg-[#1E3932]/5 text-[#1E3932]"
                            : "bg-stone-50 text-stone-500"
                        }`}
                        disabled={isRoleLoading}
                        suffixIcon={
                          isRoleLoading ? <Spin size="small" /> : undefined
                        }
                        onChange={(value) => handleChangeRole(u.id, value)}
                      >
                        <Select.Option value="Admin">Admin</Select.Option>
                        <Select.Option value="User">User</Select.Option>
                      </Select>
                    );
                  },
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold text-center">
                      Trạng thái
                    </span>
                  ),
                  dataIndex: "isLocked",
                  align: "center",
                  render: (isLocked, u) => (
                    <div className="flex flex-col items-center gap-2">
                      <Switch
                        checked={!isLocked}
                        disabled={rowLoading[u.id]?.status}
                        className={!isLocked ? "bg-[#52c41a]" : "bg-stone-200"}
                        onChange={(checked) =>
                          handleToggleStatus(u.id, checked)
                        }
                      />
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${!isLocked ? "text-green-600" : "text-stone-400"}`}
                      >
                        {!isLocked ? "Active" : "Locked"}
                      </span>
                    </div>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold text-right pr-8">
                      Hành động
                    </span>
                  ),
                  align: "right",
                  width: 140,
                  render: (_, u) => (
                    <div className="pr-4">
                      <Button
                        icon={<EditOutlined className="text-xs" />}
                        onClick={() => openEdit(u)}
                        className="rounded-xl border-stone-200 text-stone-600 hover:text-[#1E3932] hover:border-[#1E3932] font-bold text-xs uppercase transition-all shadow-sm"
                      >
                        Sửa
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* ===================== MODAL ===================== */}
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleUpdate}
          confirmLoading={submitting}
          centered
          width={450}
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
              <div className="w-10 h-10 rounded-xl bg-[#D4E9E2] flex items-center justify-center text-[#1E3932]">
                <EditOutlined />
              </div>
              <span className="text-xl font-serif text-[#1E3932]">
                Hiệu chỉnh thành viên
              </span>
            </div>
          }
          okButtonProps={{
            className:
              "h-11 rounded-2xl bg-[#1E3932] border-none font-bold tracking-tight px-8",
          }}
          cancelButtonProps={{
            className:
              "h-11 rounded-2xl border-stone-200 text-stone-500 font-bold px-6",
          }}
        >
          <div className="py-6">
            <Form layout="vertical" form={form} requiredMark={false}>
              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Họ và tên
                  </span>
                }
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-stone-300 mr-2" />}
                  placeholder="Nguyễn Văn A"
                  className="h-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">
                    Số điện thoại
                  </span>
                }
                name="phone"
              >
                <Input
                  prefix={<PhoneOutlined className="text-stone-300 mr-2" />}
                  placeholder="09xx xxx xxx"
                  className="h-12 rounded-2xl bg-stone-50 border-stone-100 focus:bg-white transition-all"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Global styles for Table customization */}
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
          .custom-select-minimal .ant-select-selector {
            border-radius: 30px !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            font-weight: 600;
            color: #1e3932 !important;
          }
          .custom-select-minimal .ant-select-selection-placeholder {
            color: #a8a29e !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
