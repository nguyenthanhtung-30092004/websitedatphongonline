"use client";

import { useEffect, useState } from "react";
import { Avatar, Spin, ConfigProvider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  StarFilled,
} from "@ant-design/icons";

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
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />
          <p className="text-[#1E3932] font-medium italic animate-pulse">
            Đang tải không gian của bạn...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAF7] py-20 relative overflow-hidden">
      {/* Organic Decorative Shapes */}
      <div className="absolute top-0 right-0 w-[40%] h-[500px] bg-[#D4E9E2]/30 rounded-bl-[200px] -z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#F1DEB4]/20 rounded-full blur-3xl -z-0" />
      <div className="absolute top-[20%] left-[5%] w-24 h-24 bg-[#1E3932]/5 rounded-full blur-xl -z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-stone-400 hover:text-[#1E3932] transition-colors mb-10 font-bold text-xs uppercase tracking-widest group"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
          Trở về trang chủ
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-green-900/5 overflow-hidden border border-stone-100/50">
          {/* Cover Header */}
          <div className="h-40 bg-[#1E3932] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>
          </div>

          <div className="px-8 md:px-16 py-20 relative">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#D4E9E2] rounded-full scale-110 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Avatar
                  size={140}
                  icon={<UserOutlined />}
                  className="bg-white border-[6px] border-white shadow-xl text-[#1E3932] relative z-10"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#C9A96A] rounded-full border-4 border-white flex items-center justify-center z-20">
                  <StarFilled className="text-white text-[10px]" />
                </div>
              </div>

              <div className="text-center md:text-left md:pb-4 flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-4xl font-serif text-[#1E3932]">
                    {user?.fullName || "Thành viên"}
                  </h1>
                  <CheckCircleFilled className="text-[#C9A96A] text-lg" />
                </div>
                <p className="text-stone-400 font-medium tracking-wide flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4E9E2]" />
                  Khách hàng thân thiết
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#FCFAF7] p-8 rounded-[2rem] border border-stone-100 transition-all hover:shadow-lg hover:shadow-green-900/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#C9A96A] group-hover:bg-[#1E3932] group-hover:text-white transition-all duration-500">
                    <MailOutlined className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-1">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-[#1E3932] tracking-tight">
                      {user?.email || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FCFAF7] p-8 rounded-[2rem] border border-stone-100 transition-all hover:shadow-lg hover:shadow-green-900/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#C9A96A] group-hover:bg-[#1E3932] group-hover:text-white transition-all duration-500">
                    <PhoneOutlined className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-1">
                      Phone Number
                    </p>
                    <p className="text-lg font-semibold text-[#1E3932] tracking-tight">
                      {user?.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Banner */}
            <div className="mt-12 bg-[#1E3932] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 transition-transform group-hover:scale-150 duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-serif mb-2">
                    Đặc quyền nghỉ dưỡng
                  </h3>
                  <p className="text-[#D4E9E2] text-sm font-light max-w-sm">
                    Bạn đang là thành viên của chúng tôi. Hãy tiếp tục đặt phòng
                    để nhận thêm nhiều ưu đãi và dịch vụ cao cấp.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/rooms")}
                  className="px-8 py-3 bg-[#C9A96A] hover:bg-[#B8955A] text-[#1E3932] rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  Khám phá phòng ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-center mt-10 text-stone-400 text-xs font-light">
          Nếu có bất kỳ thắc mắc nào về thông tin cá nhân, vui lòng <br />
          liên hệ với đội ngũ hỗ trợ của chúng tôi tại{" "}
          <span className="text-[#C9A96A] font-medium cursor-pointer hover:underline">
            support@datphong.vn
          </span>
        </p>
      </div>
    </main>
  );
}
