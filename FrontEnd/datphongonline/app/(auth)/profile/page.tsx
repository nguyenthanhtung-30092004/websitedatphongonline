"use client";

import { useEffect, useState } from "react";
import { Avatar, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authApi.getUser();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] py-14">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-10">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <Avatar
            size={96}
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-[#c8a46a] to-[#b8955a]"
          />

          <div>
            <h1 className="text-3xl font-semibold text-[#1f1f1f] tracking-wide">
              {user?.fullName}
            </h1>
            <p className="text-gray-500 mt-1">Thông tin cá nhân</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <MailOutlined className="text-[#c8a46a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-[#1f1f1f]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PhoneOutlined className="text-[#c8a46a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium text-[#1f1f1f]">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={() => router.push("/")}
            className="
              px-6 py-2.5 rounded-lg
              bg-gradient-to-r from-[#c8a46a] to-[#b8955a]
              text-white font-semibold tracking-wide
              hover:from-[#b8955a] hover:to-[#a8844d]
              hover:cursor-pointer
              transition
            "
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
