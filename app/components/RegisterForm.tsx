"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useReferralCode } from "../hooks/useReferralCode";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();
  const {
    accessToken,
    loginWithGoogle,
    loginWithCredentials, // Tạm thời dùng này, sẽ cần thêm registerWithCredentials
    loading,
    error,
    checkSession,
  } = useAuthStore();

  const {
    referralCode,
    isValidReferralCode,
    getFormattedReferralCode,
    getReferralInfo,
    clearReferralCode,
  } = useReferralCode();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.firstName) {
      newErrors.firstName = "Tên là bắt buộc";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Họ là bắt buộc";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        referralCode: getFormattedReferralCode(), // Include referral code if exists
      };

      // TODO: Cần implement registerWithCredentials method trong authStore
      // Tạm thời comment out để tránh lỗi compile
      // await registerWithCredentials(registerData);
      console.log("Register data:", registerData);
      alert(
        "Chức năng đăng ký sẽ được implement sau. Dữ liệu: " +
          JSON.stringify(registerData)
      );

      // Clear referral code after successful registration
      if (isValidReferralCode) {
        clearReferralCode();
      }

      // Redirect will be handled by useEffect when accessToken changes
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Store referral code temporarily before Google OAuth
      const refCode = getFormattedReferralCode();
      if (refCode) {
        sessionStorage.setItem("pending_referral_code", refCode);
      }

      await loginWithGoogle();

      // Clear referral code after successful Google registration
      if (isValidReferralCode) {
        clearReferralCode();
      }
    } catch (err) {
      console.error("Google registration error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const referralInfo = getReferralInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-6 h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Tạo tài khoản mới
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Tham gia cùng chúng tôi để trải nghiệm dịch vụ tuyệt vời
              </p>

              {/* Referral Code Display */}
              {referralInfo && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-300">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <span className="text-sm">
                      Bạn được giới thiệu bởi:{" "}
                      <span className="font-mono font-bold">
                        {referralInfo.code}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-blue-400 mt-1">
                    Bạn sẽ nhận được ưu đãi đặc biệt khi đăng ký!
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
              {error && (
                <div className="mb-4 rounded-lg bg-red-900/20 border border-red-800 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Google Register Button */}
              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-medium rounded-xl text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Image
                    src="/icons/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </span>
                Đăng ký với Google
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Hoặc</span>
                  </div>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      Tên
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="relative block w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Tên"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      Họ
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="relative block w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="Họ"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="relative block w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Địa chỉ email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Password Fields */}
                <div>
                  <label htmlFor="password" className="sr-only">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="relative block w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Mật khẩu"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="sr-only">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="relative block w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Xác nhận mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      điều khoản sử dụng
                    </a>{" "}
                    và{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      chính sách bảo mật
                    </a>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-xs text-red-400">{errors.acceptTerms}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </button>
              </form>

              {/* Footer Links */}
              <div className="space-y-4 text-center mt-6">
                <p className="text-sm text-gray-400">
                  Đã có tài khoản?{" "}
                  <a
                    href="/dang-nhap"
                    className="text-blue-400 font-medium hover:text-blue-300"
                  >
                    Đăng nhập ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Content */}
    </div>
  );
}
