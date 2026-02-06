"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api/axios";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
              <Input
                label="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                icon={<UserOutlined />}
              />

              <Input
                label="Email liên hệ"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="abc@gmail.com"
                icon={<MailOutlined />}
              />

              <Input
                label="Mật khẩu bảo mật"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                icon={<LockOutlined />}
              />

              <Input
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="0876423445"
                icon={<PhoneOutlined />}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              icon={<ArrowRightOutlined />}
              className="mt-4 active:scale-95"
            >
              ĐĂNG KÝ NGAY
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500 font-medium">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-[#1E3932] font-bold hover:underline underline-offset-4 decoration-[#C9A96A] decoration-2 transition-all"
              >
                Đăng nhập ngay
              </Link>
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
