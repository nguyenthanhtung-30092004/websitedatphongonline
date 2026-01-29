"use client";

import Link from "next/link";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-gray-300">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">
            DatPhongOnline
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Hệ thống đặt phòng trực tuyến hiện đại, mang đến trải nghiệm lưu trú
            tiện lợi – sang trọng – đáng tin cậy.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Khám phá</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-[#b8955a]">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#b8955a]">
                Danh sách phòng
              </Link>
            </li>
            <li>
              <Link href="/amenities" className="hover:text-[#b8955a]">
                Tiện nghi
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#b8955a]">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h4>
          <ul className="space-y-3">
            <li>Hotline: 1900 9999</li>
            <li>Email: support@datphongonline.vn</li>
            <li>Giờ làm việc: 08:00 – 22:00</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Kết nối với chúng tôi
          </h4>
          <div className="flex gap-4 text-2xl">
            <a className="hover:text-[#b8955a]" href="#">
              <FacebookFilled />
            </a>
            <a className="hover:text-[#b8955a]" href="#">
              <InstagramFilled />
            </a>
            <a className="hover:text-[#b8955a]" href="#">
              <YoutubeFilled />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} DatPhongOnline. All rights reserved.
      </div>
    </footer>
  );
}
