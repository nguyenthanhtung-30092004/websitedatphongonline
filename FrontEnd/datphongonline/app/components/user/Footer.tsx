"use client";

import Link from "next/link";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="relative bg-[#FCFAF7] pt-24 pb-12 overflow-hidden border-t border-stone-100">
      {/* Organic Decorative Background Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4E9E2]/30 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F1DEB4]/20 rounded-full blur-[80px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Social */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-serif font-bold text-[#1E3932] tracking-tight">
                DatPhong<span className="text-[#C9A96A]">Online</span>
              </h3>
              <p className="text-stone-500 leading-relaxed text-sm max-w-sm font-light">
                Hệ thống đặt phòng trực tuyến hiện đại, mang đến trải nghiệm lưu
                trú tiện lợi – sang trọng – đáng tin cậy cho mọi hành trình của
                bạn.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: <FacebookFilled />, href: "#" },
                { icon: <InstagramFilled />, href: "#" },
                { icon: <YoutubeFilled />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-stone-100 text-[#1E3932] shadow-sm hover:bg-[#1E3932] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3932] pb-2 border-b border-[#D4E9E2] w-fit">
              Khám phá
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/rooms", label: "Danh sách phòng" },
                { href: "/amenities", label: "Tiện nghi" },
                { href: "/contact", label: "Liên hệ" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-500 text-sm font-medium hover:text-[#C9A96A] hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9A96A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Info */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3932] pb-2 border-b border-[#D4E9E2] w-fit">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#D4E9E2]/50 flex items-center justify-center text-[#1E3932] group-hover:bg-[#1E3932] group-hover:text-white transition-colors duration-300">
                  <PhoneOutlined />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-300 uppercase">
                    Hotline 24/7
                  </p>
                  <p className="text-sm font-bold text-stone-700">1900 9999</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#D4E9E2]/50 flex items-center justify-center text-[#1E3932] group-hover:bg-[#1E3932] group-hover:text-white transition-colors duration-300">
                  <MailOutlined />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-300 uppercase">
                    Email
                  </p>
                  <p className="text-sm font-bold text-stone-700">
                    support@datphongonline.vn
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#D4E9E2]/50 flex items-center justify-center text-[#1E3932] group-hover:bg-[#1E3932] group-hover:text-white transition-colors duration-300">
                  <ClockCircleOutlined />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-300 uppercase">
                    Giờ làm việc
                  </p>
                  <p className="text-sm font-bold text-stone-700">
                    08:00 – 22:00
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Location */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3932] pb-2 border-b border-[#D4E9E2] w-fit">
              Vị trí của chúng tôi
            </h4>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C9A96A] rounded-2xl translate-x-2 translate-y-2 -z-10 opacity-20 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-stone-100 shadow-sm grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.605615609093!2d105.76342907502973!3d20.968347380665918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452d897f46f43%3A0xefb65b8d416c8432!2zROG7i2NoIFbhu6UgWMOieSBE4buxbmcgSMOgIE7hu5lp!5e0!3m2!1sen!2s!4v1770110605686!5m2!1sen!2s"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-4 text-[11px] text-stone-400 italic flex items-center gap-2">
                <EnvironmentOutlined /> Hà Nội, Việt Nam
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-stone-400 uppercase tracking-widest">
            © {new Date().getFullYear()} DatPhongOnline. Crafted for relaxation.
          </p>
          <div className="flex gap-8 text-[11px] font-bold text-stone-400 uppercase tracking-tighter">
            <a href="#" className="hover:text-[#1E3932] transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-[#1E3932] transition-colors">
              Bảo mật
            </a>
            <a href="#" className="hover:text-[#1E3932] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
