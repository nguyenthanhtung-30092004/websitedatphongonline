"use client";

import { useEffect, useState } from "react";
import { message } from "antd";
import { userApi } from "@/services/api/user.api";

export const useUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // gọi
  const fetchUsers = async (params?: { isLocked?: boolean; role?: string }) => {
    try {
      setLoading(true);
      const res = await userApi.getUsers(params);
      setUsers(res.data);
    } catch (err: any) {
      message.error("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // cập nhật
  const updateUser = async (id: number, data: any) => {
    try {
      setSubmitting(true);
      await userApi.updateUser(id, data);
      message.success("Cập nhật thành công");
      await fetchUsers();
    } catch (err) {
      message.error("Cập nhật thất bại");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  // khóa tài khoản
  const deactivateUser = async (id: number) => {
    try {
      setSubmitting(true);
      await userApi.deactivate(id);
      message.success("Đã khóa tài khoản");
      await fetchUsers();
    } catch {
      message.error("Khóa tài khoản thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // mở tài khoản
  const activateUser = async (id: number) => {
    try {
      setSubmitting(true);
      await userApi.activate(id);
      message.success("Đã mở khóa tài khoản");
      await fetchUsers();
    } catch {
      message.error("Mở khóa thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  //lọc
  const filterUsers = async (filter: { isLocked?: boolean; role?: string }) => {
    await fetchUsers(filter);
  };

  return {
    users,
    loading,
    submitting,

    fetchUsers,
    filterUsers,
    updateUser,
    activateUser,
    deactivateUser,
  };
};
