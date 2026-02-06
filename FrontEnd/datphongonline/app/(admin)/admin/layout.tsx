"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Modal, Tooltip, Avatar } from "antd";
import { useAuths } from "@/hooks/useAuths";
import { ADMIN_MENU_ITEMS } from "@/constants/admin-navigation";

const { confirm } = Modal;

const menu = ADMIN_MENU_ITEMS;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuths();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    confirm({
      title: "Xác nhận đăng xuất",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      async onOk() {
        await logout();
        router.push("/");
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-[#f5f3f0]">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
            bg-white shadow-lg border-r
            flex flex-col
            transition-all duration-300
            ${collapsed ? "w-20" : "w-64"}
          `}
      >
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-4">
          {!collapsed && (
            <span className="font-bold text-lg text-[#b8955a]">MENU</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-[#b8955a] hover:cursor-pointer text-lg"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Menu */}
        <nav className="px-2 space-y-2 flex-1">
          {menu.map((item) => {
            const active = pathname === item.href;

            const content = (
              <Link
                href={item.href}
                className={`
                    flex items-center gap-3
                    px-4 py-3 rounded-lg
                    transition
                    ${active
                    ? "bg-yellow-50 text-[#b8955a] font-semibold border-l-4 border-[#b8955a]"
                    : "text-gray-600 hover:bg-gray-50"
                  }
                    ${collapsed ? "justify-center pl-4" : ""}
                  `}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.href} title={item.label} placement="right">
                {content}
              </Tooltip>
            ) : (
              <div key={item.href}>{content}</div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 ">
          <button
            onClick={handleLogout}
            className={`
                w-full flex items-center gap-3 px-4 py-3
                rounded-lg
                bg-red-50
                text-red-600 font-medium
                hover:bg-red-100
                transition
                ${collapsed ? "justify-center" : ""}
              `}
          >
            <LogoutOutlined className="text-lg" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
