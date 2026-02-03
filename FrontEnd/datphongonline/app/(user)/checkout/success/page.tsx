"use client";

import Link from "next/link";
import { Button, Result, Divider } from "antd";
import { HomeOutlined, CalendarOutlined, PrinterOutlined } from "@ant-design/icons";

export default function CheckoutSuccessPage() {
  return (
    <main className="bg-[#f3f1ee] min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-[32px] p-12 shadow-sm text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <Result
              status="success"
              title={
                <h2 className="text-3xl font-bold text-slate-900 mt-4">
                  Đặt phòng thành công!
                </h2>
              }
              subTitle={
                <div className="text-gray-600 mt-4 space-y-2">
                  <p>Cảm ơn bạn đã tin tưởng chúng tôi.</p>
                  <p>Xác nhận sẽ được gửi đến email của bạn trong vài phút tới.</p>
                </div>
              }
            />
          </div>

          <Divider />

          {/* Booking Details */}
          <div className="text-left bg-slate-50 rounded-2xl p-8 my-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Chi tiết đặt phòng</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#e6e1d8]">
                <span className="text-gray-600 font-medium">Mã đơn</span>
                <span className="font-semibold text-slate-900">#BK20250203001</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-[#e6e1d8]">
                <span className="text-gray-600 font-medium">Trạng thái</span>
                <span className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                  ✓ Đã xác nhận
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-[#e6e1d8]">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <CalendarOutlined /> Check-in
                </span>
                <span className="font-semibold text-slate-900">03/02/2025</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-[#e6e1d8]">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <CalendarOutlined /> Check-out
                </span>
                <span className="font-semibold text-slate-900">05/02/2025</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Tổng tiền</span>
                <span className="text-2xl font-bold text-[#b89655]">₫2,000,000</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
            <h4 className="font-semibold text-blue-900 mb-4">Bước tiếp theo</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Bạn sẽ nhận được email xác nhận</li>
              <li>✓ Chuẩn bị các thông tin cần thiết cho check-in</li>
              <li>✓ Liên hệ chúng tôi nếu có bất kỳ câu hỏi</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="large"
              className="flex-1 h-12 rounded-xl font-semibold border-[#b89655] text-[#b89655]"
              icon={<PrinterOutlined />}
            >
              In hoá đơn
            </Button>

            <Link href="/rooms" className="flex-1">
              <Button
                type="primary"
                size="large"
                className="w-full h-12 rounded-xl font-semibold"
                icon={<HomeOutlined />}
                style={{ backgroundColor: "#b89655" }}
              >
                Khám phá thêm
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 text-gray-600">
          <p>Cần giúp đỡ? <Link href="#" className="text-[#b89655] font-semibold hover:underline">Liên hệ hỗ trợ</Link></p>
        </div>
      </div>
    </main>
  );
}
