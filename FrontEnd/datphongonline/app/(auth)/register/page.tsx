"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-8">
        <h1 className="text-2xl font-semibold text-[#1f1f1f] text-center mb-6 tracking-wide">
          Đăng ký tài khoản
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-1">
              Họ và tên
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Nguyễn Văn A"
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-1">
              Số điện thoại
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="0876423445"
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

          <button
            disabled={loading}
            className="
              w-full rounded-lg hover:cursor-pointer
              bg-gradient-to-r from-[#c8a46a] to-[#b8955a]
              text-white py-2.5 font-semibold tracking-wide
              hover:from-[#b8955a] hover:to-[#a8844d]
              transition-all duration-300
              disabled:opacity-60
            "
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-[#b8955a] font-medium hover:underline"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
