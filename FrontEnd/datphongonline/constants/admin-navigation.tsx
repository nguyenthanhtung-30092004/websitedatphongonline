import {
    HomeOutlined,
    AppstoreOutlined,
    UserOutlined,
    ToolOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

export const ADMIN_MENU_ITEMS = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: <HomeOutlined />,
    },
    {
        label: "Quản lý loại phòng",
        href: "/admin/room-types",
        icon: <AppstoreOutlined />,
    },
    {
        label: "Quản lý tiện ích",
        href: "/admin/amenities",
        icon: <ToolOutlined />,
    },
    {
        label: "Quản lý phòng",
        href: "/admin/rooms",
        icon: <HomeOutlined />,
    },
    {
        label: "Quản lý đơn hàng",
        href: "/admin/bookings",
        icon: <CalendarOutlined />,
    },
    {
        label: "Quản lý người dùng",
        href: "/admin/users",
        icon: <UserOutlined />,
    },
    {
        label: "Sơ đồ phòng",
        href: "/admin/room-matrix",
        icon: <UserOutlined />,
    },
];
