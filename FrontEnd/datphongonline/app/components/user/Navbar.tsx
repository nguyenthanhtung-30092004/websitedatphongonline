"use client";

import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuths } from "@/hooks/useAuths";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, fetchUser } = useAuths();

  // Cập nhật trạng thái người dùng khi quay lại trang chính
  useEffect(() => {
    if (pathname === "/" || pathname === "/rooms") {
      fetchUser();
    }
  }, [pathname, fetchUser]);

  const handleLogout = async () => {
    await logout();
    await fetchUser();
    router.replace("/");
  };

  const items = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      onClick: () => router.push("/profile"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: <span className="text-red-500 font-medium">Đăng xuất</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="text-xl w-[140px] flex items-center justify-center h-10 font-bold text-[#b8955a]"
        >
          {" "}
          <img src="logo.png" className="w-[140px] block object-cover" alt="" />
        </a>

        {!loading && (
          <nav className="flex items-center gap-6">
            <Link href="/rooms" className="hover:text-[#b8955a]">
              Phòng
            </Link>

            {user && (
              <Link href="/bookings" className="hover:text-[#b8955a]">
                Đơn đặt
              </Link>
            )}

            {!user ? (
              <>
                <Link href="/login" className="hover:text-[#b8955a]">
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-[#b8955a] text-white"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <Dropdown menu={{ items }} placement="bottomRight">
                <Avatar
                  icon={<UserOutlined />}
                  className="cursor-pointer bg-[#b8955a]"
                />
              </Dropdown>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
