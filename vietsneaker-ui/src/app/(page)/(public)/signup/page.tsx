"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AuthControllerService, CreateUserRequest } from "@/gen";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_PATTERN } from "@/config/pattern";
import { getPasswordError } from "@/util/validate";
import { mapApiErrorsToForm } from "@/util/form";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateUserRequest>();

  const password = watch("password");
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateUserRequest> = async (data) => {
    try {
      await AuthControllerService.register(data);
      toast.success("Đăng ký tài khoản thành công, vui lòng kiểm tra email!");
      router.push("/login");
    } catch (error) {
      mapApiErrorsToForm(error, setError);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-10 rounded-2xl border border-[rgba(255,62,62,0.25)] shadow-[0_8px_30px_rgba(255,62,62,0.15)] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ĐĂNG KÝ</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <input
            type="text"
            placeholder="Email"
            autoFocus
            {...register("email", {
              required: "Email không được để trống",
              pattern: { value: EMAIL_PATTERN, message: "Email không hợp lệ" },
            })}
            className="w-full border border-gray-300 bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-base transition-all focus:outline-none focus:border-[#e03a00] focus:ring-2 focus:ring-[#ff3e3e]/30 focus:bg-white placeholder-gray-400"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Họ và tên"
            {...register("name", { required: "Tên không được để trống" })}
            className="w-full border border-gray-300 bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-base transition-all focus:outline-none focus:border-[#e03a00] focus:ring-2 focus:ring-[#ff3e3e]/30 focus:bg-white placeholder-gray-400"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            {...register("password", {
              required: "Mật khẩu không được để trống",
              validate: () => getPasswordError(password) ?? true,
            })}
            className="w-full border border-gray-300 bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-base transition-all focus:outline-none focus:border-[#e03a00] focus:ring-2 focus:ring-[#ff3e3e]/30 focus:bg-white placeholder-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#e03a00] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            {...register("passwordConfirmation", {
              required: "Vui lòng xác nhận lại mật khẩu",
              validate: (val) =>
                val === password || "Mật khẩu xác nhận không khớp",
            })}
            className="w-full border border-gray-300 bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-base transition-all focus:outline-none focus:border-[#e03a00] focus:ring-2 focus:ring-[#ff3e3e]/30 focus:bg-white placeholder-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#e03a00] transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.passwordConfirmation && (
            <p className="text-red-600 text-sm mt-1">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#ff3e3e] text-white font-semibold py-3 rounded-lg shadow-[0_4px_12px_rgba(255,62,62,0.4)] hover:bg-[#e03a00] hover:shadow-[0_6px_18px_rgba(224,58,0,0.45)] active:translate-y-[1px] transition-all duration-150"
        >
          Đăng ký
        </button>
      </form>

      <div className="mt-5 text-center text-gray-600 text-sm">
        Bạn đã có tài khoản?
        <Link
          href="/login"
          className="text-[#e03a00] font-semibold ml-1 hover:text-[#c73200] transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default function RegisterUser() {
  return (
    <div className="w-full min-h-screen bg-[#ff3e3e] flex justify-center items-center relative overflow-hidden">
      {/* Banner */}
      <div className="relative w-full min-h-screen bg-[linear-gradient(135deg,#666,#666,#666)] flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.05)_100%)]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-[90%] max-w-[1100px] gap-8 md:gap-12">
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/body.png"
              alt="banner"
              className="w-full max-w-[280px] h-auto object-contain animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
          <RegisterForm />
        </div>
      </div>

      {/* Animation keyframes */}
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
