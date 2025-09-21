"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: { target: { value: string } }) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValid(isValidEmail(inputEmail));
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white ">
      {/* Header */}
      <div className="bg-[#FFDA3E]  w-full max-w-6xl flex justify-between items-center border-b-4"></div>
      {/* Main Content */}
      <div className="bg-white w-[1040px] h-[500px] flex justify-center items-center">
        {/* Form Reset Password */}
        <div className="w-full md:w-[380px] h-[250px] p-0 bg-white rounded-lg shadow-lg border border-yellow-300">
          {/* Tiêu đề */}
          <div className="flex  items-center bg-White rounded-md h-[80px]">
            <button
              onClick={() => router.push("/login")}
              className="px-[10px] py-[1px]"
            >
              <img src="/goBack.svg" />
            </button>
            <div className="flex justify-center w-[300px]">
              <h2 className="text-xl font-bold text-black inte">
                Đặt lại mật khẩu
              </h2>
            </div>
          </div>
          {/* Form Đăng ký */}
          <div className="px-10 ">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-3 rounded"
            />
            {!isValid && (
              <p className="text-red-500 text-sm pt-3">Email không hợp lệ</p>
            )}
            <button
              className={`w-full bg-yellow-400 text-white p-3 rounded mt-5 font-semibold shadow-md ${
                isValidEmail(email)
                  ? "bg-yellow-400 hover:opacity-75"
                  : "bg-yellow-230 cursor-not-allowed "
              }`}
              disabled={!email.trim()}
            >
              Tiếp theo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
