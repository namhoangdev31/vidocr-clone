"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const {
    accessToken,
    loginWithGoogle,
    loginWithCredentials,
    loading,
    error,
    checkSession,
  } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkSession();
    }
  }, [checkSession]);

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(email, password);
  };

  const btnBase =
    "w-full h-12 rounded-lg px-4 inline-flex items-center justify-center gap-3 font-medium text-white disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-gray-800 py-2 px-4">
        <div className="flex justify-center items-center">
          <p className="text-white text-xs md:text-sm text-center">
            Đăng nhập bằng Google để nhận ngay Voucher 200.000 Point
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Section (ẩn trên mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-pink-100 justify-center items-center p-12">
          <div className="w-full max-w-md">
            <div className="flex flex-col space-y-8">
              <div className="w-12 h-12 rounded flex items-center justify-center">
                <Image
                  src="/icons/home-icon.svg"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>

              <div className="space-y-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 text-center leading-tight">
                  Phá vỡ mọi rào cản ngôn ngữ với dịch thuật AI.
                </h2>

                <div className="w-full max-w-sm h-96 bg-gray-200 rounded-lg border overflow-hidden">
                  <Image
                    src="/images/demo-image.png"
                    alt="Demo"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (full width trên mobile) */}
        <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-6 md:p-8">
          <div className="w-full max-w-md">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Đăng nhập một chạm
                </h1>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                {/* Facebook */}
                <button
                  type="button"
                  className={`${btnBase} bg-blue-600 hover:bg-blue-700`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center shrink-0">
                    <Image
                      src="/icons/facebook-icon.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="h-5 w-5 align-middle"
                    />
                  </span>
                  <span className="whitespace-nowrap leading-none">
                    Login with Facebook
                  </span>
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`${btnBase} bg-red-500 hover:bg-red-600`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center shrink-0">
                    <Image
                      src="/icons/google-icon.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="h-5 w-5 align-middle"
                    />
                  </span>
                  <span className="whitespace-nowrap leading-none">
                    {loading ? "Đang xử lý..." : "Login with Google"}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center">
                <span className="text-gray-500 text-sm">Hoặc</span>
              </div>

              {/* Form */}
              <form onSubmit={handleCredentialsLogin} className="space-y-6">
                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                </div>

                <button
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </button>
              </form>

              {/* Footer Links */}
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Đăng ký ngay
                  </a>
                </p>
                <a
                  href="#"
                  className="block text-sm text-gray-500 hover:text-gray-700"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Content */}
    </div>
  );
}
