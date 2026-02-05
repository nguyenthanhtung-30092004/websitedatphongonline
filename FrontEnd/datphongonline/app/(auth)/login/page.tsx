"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { useAuths } from "@/hooks/useAuths";
import {
  LockOutlined,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const GoogleLogin = dynamic(
  () => import("@react-oauth/google").then((mod) => mod.GoogleLogin),
  { ssr: false },
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { fetchUser } = useAuths();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login({ email, password });
      const user = await fetchUser();

      if (user?.role === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      let message = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (err.response) {
        message =
          err.response.data?.message || "Email hoặc mật khẩu không đúng";
      } else if (err.request) {
        message = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setError("");
    setGoogleLoading(true);

    try {
      await authApi.googleLogin({ idToken: credential });
      const user = await fetchUser();

      router.push(user?.role === "Admin" ? "/admin/dashboard" : "/");
    } catch (err: any) {
      let message = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (err.response) {
        const status = err.response.status;
        const backendMessage = err.response.data?.message;

        if (status === 403 || status === 423) {
          message = backendMessage || "Tài khoản của bạn đã bị khóa";
        } else {
          message = backendMessage || "Email hoặc mật khẩu không đúng";
        }
      } else if (err.request) {
        message = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      }

      setError(message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FCFAF7] overflow-hidden">
      {/* Decorative Organic Blobs */}
      <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-[#D4E9E2] rounded-full blur-[100px] opacity-40 animate-pulse" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[500px] h-[500px] bg-[#F1DEB4] rounded-full blur-[120px] opacity-30" />

      <div className="relative w-full max-w-md mx-4">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(30,57,50,0.1)] border border-white p-10">
          {/* Logo/Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E3932] rounded-2xl mb-6 shadow-lg rotate-3">
              <img
                src="/logo-icon.png"
                alt="Logo"
                className="w-10 h-10 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-3xl font-serif text-[#1E3932] font-bold">
              Chào mừng trở lại
            </h1>
            <p className="text-stone-500 mt-2 font-medium">
              Đăng nhập để tiếp tục kỳ nghỉ của bạn
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl bg-rose-50 text-rose-700 px-5 py-3 text-sm border border-rose-100 flex items-center gap-3 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em] ml-2">
                Địa chỉ Email
              </label>
              <div className="relative">
                <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@gmail.com"
                  className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3932]/10 focus:border-[#1E3932] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em]">
                  Mật khẩu
                </label>
                <a
                  href="/forgot-password"
                  className="text-[10px] uppercase font-bold text-[#C9A96A] hover:text-[#1E3932] transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3932]/10 focus:border-[#1E3932] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-2xl bg-[#1E3932] hover:bg-[#2D4F3C] text-white py-4 font-bold tracking-widest shadow-xl shadow-green-900/10 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ĐĂNG NHẬP{" "}
                  <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                Hoặc tiếp tục với
              </span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            {/* Google Login Wrapper */}
            <div className="flex justify-center transition-opacity hover:opacity-90">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setError("Đăng nhập Google thất bại");
                }}
                theme="outline"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500 font-medium">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-[#1E3932] font-bold hover:underline underline-offset-4"
              >
                Đăng ký thành viên ngay
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Small Note */}
        <p className="text-center mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          © 2024 DatPhongOnline • Trải nghiệm an nhiên
        </p>
      </div>
    </div>
  );
}
