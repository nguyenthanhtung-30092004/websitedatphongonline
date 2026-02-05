"use client";

import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
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
      label: <span className="px-2 py-1 block">Thông tin cá nhân</span>,
      onClick: () => router.push("/profile"),
    },
    {
      key: "bookings",
      label: <span className="px-2 py-1 block">Đơn đặt phòng của tôi</span>,
      onClick: () => router.push("/my-bookings"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: (
        <span className="text-red-500 font-medium px-2 py-1 block">
          Đăng xuất
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFAF7]/80 backdrop-blur-md border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo Area */}
        <Link
          href="/"
          className="relative group transition-transform duration-300 hover:scale-105"
        >
          <div className="w-[140px] h-12 flex items-center justify-center">
            <img
              src="/logo.png"
              className="w-full h-full object-contain"
              alt="DatPhongOnline Logo"
            />
          </div>
        </Link>

        {!loading && (
          <nav className="flex items-center gap-2 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/rooms"
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === "/rooms"
                    ? "text-[#2D4F3C]"
                    : "text-stone-600 hover:text-[#2D4F3C]"
                }`}
              >
                Khám phá phòng
              </Link>
              <Link
                href="/availability"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <AppstoreOutlined />
                <span>Sơ đồ phòng</span>
              </Link>

              {user && (
                <Link
                  href="/my-bookings"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === "/my-bookings"
                      ? "text-[#2D4F3C]"
                      : "text-stone-600 hover:text-[#2D4F3C]"
                  }`}
                >
                  Đơn đặt của tôi
                </Link>
              )}
            </div>

            <div className="h-6 w-[1px] bg-stone-200 mx-2 hidden md:block" />

            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-stone-600 hover:text-[#2D4F3C] px-4 py-2 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-full bg-[#2D4F3C] text-white text-sm font-semibold shadow-lg shadow-green-900/10 hover:bg-[#1E3932] hover:-translate-y-0.5 transition-all duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Dropdown
                  menu={{ items }}
                  classNames={{ root: "my-dropdown" }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden text-right md:block">
                      <p className="text-xs text-stone-500 leading-none">
                        Xin chào,
                      </p>
                      <p className="text-sm font-semibold text-stone-800">
                        {user?.fullName || "Thành viên"}
                      </p>
                    </div>
                    <Avatar
                      icon={<UserOutlined />}
                      size="large"
                      className="cursor-pointer bg-[#2D4F3C] border-2 border-white shadow-sm group-hover:shadow-md transition-all"
                    />
                  </div>
                </Dropdown>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
