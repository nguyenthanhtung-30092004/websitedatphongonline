"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        fullName,
        email,
        password,
        phone,
      });

      setSuccess("Đăng ký thành công! Đang chuyển sang đăng nhập...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FCFAF7] overflow-hidden py-12 px-6">
      {/* Nature-inspired Organic Background Shapes */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#D4E9E2] rounded-full blur-[120px] opacity-40 -z-0" />
      <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-[#F1DEB4] rounded-full blur-[100px] opacity-30 -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Registration Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(30,57,50,0.08)] border border-white p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1E3932]/5 rounded-2xl mb-6">
              <SafetyCertificateOutlined className="text-[#1E3932] text-2xl" />
            </div>
            <h1 className="text-3xl font-serif text-[#1E3932] font-bold">
              Tạo tài khoản mới
            </h1>
            <p className="text-stone-500 mt-2 font-medium">
              Bắt đầu hành trình nghỉ dưỡng của bạn
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 rounded-2xl bg-rose-50 text-rose-700 px-5 py-3 text-sm border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-2xl bg-[#D4E9E2]/40 text-[#1E3932] px-5 py-3 text-sm border border-[#2D4F3C]/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3932] shrink-0 animate-pulse" />
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                  Email liên hệ
                </label>
                <div className="relative">
                  <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="abc@gmail.com"
                    className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                  Mật khẩu bảo mật
                </label>
                <div className="relative">
                  <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <PhoneOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0876423445"
                    className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="group w-full rounded-2xl bg-[#1E3932] hover:bg-[#2D4F3C] text-white py-4 font-bold tracking-widest shadow-xl shadow-green-900/10 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-4 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ĐĂNG KÝ NGAY{" "}
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500 font-medium">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-[#1E3932] font-bold hover:underline underline-offset-4 decoration-[#C9A96A] decoration-2 transition-all"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>

        {/* Small decorative text */}
        <p className="text-center mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">
          DatPhongOnline • Trải nghiệm nghỉ dưỡng xanh
        </p>
      </div>
    </div>
  );
}
