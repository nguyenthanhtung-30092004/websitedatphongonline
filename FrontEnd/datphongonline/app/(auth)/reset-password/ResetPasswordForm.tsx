"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { message } from "antd";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
      >
        <h1 className="text-xl font-semibold mb-6 text-center">
          Đặt lại mật khẩu
        </h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Mã xác nhận (OTP)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 mb-3"
        />

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-[#c8a46a] text-white py-2 rounded-lg"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
