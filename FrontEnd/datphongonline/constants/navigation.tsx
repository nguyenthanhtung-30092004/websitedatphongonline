import {
    FacebookFilled,
    InstagramFilled,
    YoutubeFilled,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";

export const NAV_LINKS = [
    {
        href: "/rooms",
        label: "Khám phá phòng",
        public: true,
    },
    {
        href: "/availability",
        label: "Sơ đồ phòng",
        icon: <AppstoreOutlined />,
        public: true,
    },
    {
        href: "/my-bookings",
        label: "Đơn đặt của tôi",
        public: false, // Requires user
    },
];

export const SOCIAL_LINKS = [
    { icon: <FacebookFilled />, href: "#" },
    { icon: <InstagramFilled />, href: "#" },
    { icon: <YoutubeFilled />, href: "#" },
];

export const EXPLORE_LINKS = [
    { href: "/", label: "Trang chủ" },
    { href: "/rooms", label: "Danh sách phòng" },
    { href: "/amenities", label: "Tiện nghi" },
    { href: "/contact", label: "Liên hệ" },
];

export const SUPPORT_INFO = [
    {
        icon: <PhoneOutlined />,
        label: "Hotline 24/7",
        value: "1900 9999",
    },
    {
        icon: <MailOutlined />,
        label: "Email",
        value: "support@datphongonline.vn",
    },
    {
        icon: <ClockCircleOutlined />,
        label: "Giờ làm việc",
        value: "08:00 – 22:00",
    },
];
