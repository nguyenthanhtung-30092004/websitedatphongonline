"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { useAuths } from "@/hooks/useAuths";

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
    } catch (err) {
      setError("Đăng nhập Google thất bại");
      setGoogleLoading(false); // chỉ reset khi fail
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-8">
        <h1 className="text-2xl font-semibold text-[#1f1f1f] text-center mb-6 tracking-wide">
          Đăng nhập
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="
                w-full rounded-lg border border-gray-300 px-4 py-2
                text-[#1f1f1f]
                focus:outline-none
                focus:ring-2 focus:ring-[#c8a46a]
                focus:border-[#c8a46a]
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full rounded-lg border border-gray-300 px-4 py-2
                text-[#1f1f1f]
                focus:outline-none
                focus:ring-2 focus:ring-[#c8a46a]
                focus:border-[#c8a46a]
                transition
              "
            />
          </div>
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-[#b8955a] hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-lg
              bg-gradient-to-r from-[#c8a46a] to-[#b8955a]
              text-white py-2.5 font-semibold tracking-wide
              hover:from-[#b8955a] hover:to-[#a8844d]
              transition-all duration-300
              disabled:opacity-60
            "
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          {/* GOOGLE LOGIN */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">hoặc</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-[#b8955a] font-medium hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
