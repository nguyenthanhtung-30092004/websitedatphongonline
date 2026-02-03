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
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-white mb-4">
            DatPhongOnline
          </h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Hệ thống đặt phòng trực tuyến hiện đại, mang đến trải nghiệm lưu trú
            tiện lợi – sang trọng – đáng tin cậy.
          </p>

          {/* Social */}
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

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Khám phá</h4>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/rooms", label: "Danh sách phòng" },
              { href: "/amenities", label: "Tiện nghi" },
              { href: "/contact", label: "Liên hệ" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[#b8955a] transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h4>
          <ul className="space-y-3 text-gray-400">
            <li>📞 Hotline: 1900 9999</li>
            <li>📧 support@datphongonline.vn</li>
            <li>⏰ 08:00 – 22:00</li>
          </ul>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold text-white mb-4">
            Vị trí của chúng tôi
          </h4>
          <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.605615609093!2d105.76342907502973!3d20.968347380665918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452d897f46f43%3A0xefb65b8d416c8432!2zROG7i2NoIFbhu6UgWMOieSBE4buxbmcgSMOgIE7hu5lp!5e0!3m2!1sen!2s!4v1770110605686!5m2!1sen!2s"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} DatPhongOnline. All rights reserved.
      </div>
    </footer>
  );
}
