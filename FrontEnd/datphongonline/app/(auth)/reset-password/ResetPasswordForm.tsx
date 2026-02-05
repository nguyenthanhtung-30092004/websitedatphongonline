"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { message, ConfigProvider } from "antd";
import {
  LockOutlined,
  SafetyOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.resetPassword({
        email,
        code,
        newPassword,
      });

      message.success("Đổi mật khẩu thành công");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data || "Mã xác nhận không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FCFAF7] overflow-hidden px-6">
      {/* Organic Nature-inspired Decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[120px] opacity-30 -z-0" />
      <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-[#1E3932]/5 rounded-full blur-xl -z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Navigation Link */}
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1E3932] mb-8 font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
          Quay lại nhập email
        </Link>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(30,57,50,0.08)] border border-white p-10 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E3932]/5 rounded-2xl mb-6">
              <CheckCircleOutlined className="text-[#1E3932] text-3xl" />
            </div>
            <h1 className="text-3xl font-serif text-[#1E3932] font-bold mb-3">
              Đặt lại mật khẩu
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed font-medium">
              Thiết lập mật khẩu mới cho tài khoản{" "}
              <span className="text-[#1E3932] font-bold">{email}</span> để bảo
              mật thông tin của bạn.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 rounded-2xl bg-rose-50 text-rose-700 px-5 py-3 text-sm border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Code Field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                Mã xác nhận (OTP)
              </label>
              <div className="relative">
                <SafetyOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="text"
                  placeholder="Nhập mã 6 chữ số"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-4 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all tracking-[0.1em]"
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-4 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-[#1E3932]/5 focus:border-[#1E3932] transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group w-full rounded-2xl bg-[#1E3932] hover:bg-[#2D4F3C] text-white py-4 font-bold tracking-widest shadow-xl shadow-green-900/10 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "ĐỔI MẬT KHẨU"
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="mt-10 text-center border-t border-stone-50 pt-8">
            <p className="text-sm text-stone-500 font-medium">
              Bạn không nhận được mã?{" "}
              <button
                type="button"
                className="text-[#C9A96A] font-bold hover:text-[#1E3932] transition-colors"
                onClick={() => router.push("/forgot-password")}
              >
                Gửi lại mã
              </button>
            </p>
          </div>
        </div>

        {/* Branding Subtext */}
        <p className="text-center mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">
          DatPhongOnline • Trải nghiệm an nhiên
        </p>
      </div>
    </div>
  );
}
