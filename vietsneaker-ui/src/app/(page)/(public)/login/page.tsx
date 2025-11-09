"use client";
import Link from "next/link";
import { LoginForm } from "./reset/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center relative overflow-hidden">
      {/* 🌆 Banner Section */}
      <div className="relative w-full min-h-screen bg-gradient-to-tr from-gray-600 via-gray-500 to-gray-700 flex justify-center items-center overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.05)_100%)]"></div>

        {/* 🧱 Content Wrapper */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-[90%] max-w-[1100px] gap-8 md:gap-12">
          {/* 🖼️ Left Banner Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/body.png"
              alt="banner"
              className="w-full max-w-[280px] h-auto object-contain animate-[float_3s_ease-in-out_infinite]"
            />
          </div>

          {/* 📦 Login Box */}
          <div className="w-full max-w-[400px] bg-white/90 backdrop-blur-md p-10 rounded-2xl border border-red-400/25 shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-transform hover:-translate-y-1">
            {/* 🎯 Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.5rem] font-bold text-[#ef4444]">
                Đăng nhập
              </h2>
            </div>

            {/* 🧾 Form */}
            <div className="flex flex-col gap-4">
              <LoginForm />
            </div>

            {/* 🔗 Links */}
            <div className="mt-5 text-center text-sm text-gray-600">
              <span>Chưa có tài khoản?</span>
              <Link
                href="/signup"
                className="text-red-700 font-semibold ml-1 hover:text-red-800 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🌊 Animation Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
