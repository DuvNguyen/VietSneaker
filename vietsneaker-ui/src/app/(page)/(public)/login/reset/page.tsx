"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: { target: { value: string } }) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValid(isValidEmail(inputEmail));
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Form Reset Password */}
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-lg border border-red-300">
        {/* Tiêu đề */}
        <div className="flex items-center border-b border-red-200 h-[70px] px-4 bg-white">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center mr-2"
          >
            <img src="/goBack.svg" className="w-5 h-5" alt="go back" />
          </button>
          <h2 className="text-lg font-bold text-[#ef4444] mx-auto">
            Đặt lại mật khẩu
          </h2>
        </div>

        {/* Nội dung */}
        <div className="px-8 py-6">
          <input
            type="text"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
          />
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">Email không hợp lệ</p>
          )}

          <button
            className={`w-full text-white p-3 rounded-md mt-5 font-semibold shadow-md transition-all duration-200 ${
              isValidEmail(email)
                ? "bg-[#ef4444] hover:bg-[#b91c1c]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!email.trim()}
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
}
