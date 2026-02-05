"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import {
  MailOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess("Đã gửi mã xác nhận về email");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data || "Không thể gửi mã xác nhận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FCFAF7] overflow-hidden px-6">
      {/* Organic Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 -z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[120px] opacity-30 -z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-[#1E3932] mb-8 font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
          Quay lại đăng nhập
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(30,57,50,0.08)] border border-white p-10 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E3932]/5 rounded-2xl mb-6">
              <SafetyCertificateOutlined className="text-[#1E3932] text-3xl" />
            </div>
            <h1 className="text-3xl font-serif text-[#1E3932] font-bold mb-3">
              Quên mật khẩu?
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed font-medium">
              Đừng lo lắng, hãy nhập email của bạn. Chúng tôi sẽ gửi mã xác nhận
              để bạn đặt lại mật khẩu mới.
            </p>
          </div>

          {/* Feedback Messages */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                Địa chỉ Email của bạn
              </label>
              <div className="relative">
                <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <>
                  GỬI MÃ XÁC NHẬN{" "}
                  <SendOutlined className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-xs" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-10 text-center border-t border-stone-50 pt-8">
            <p className="text-sm text-stone-500 font-medium">
              Bạn vẫn gặp sự cố?{" "}
              <a
                href="/contact"
                className="text-[#C9A96A] font-bold hover:text-[#1E3932] transition-colors"
              >
                Liên hệ hỗ trợ
              </a>
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
