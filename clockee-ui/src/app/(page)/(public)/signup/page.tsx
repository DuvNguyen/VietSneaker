"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AuthControllerService, CreateUserRequest } from "@/gen";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_PATTERN } from "@/config/pattern";
import ErrorText from "@/app/components/typography/error-text";
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
      toast.success(
        "Đăng ký tài khoản thành công vui lòng kiểm tra email để xác nhận tài khoản",
      );
      router.push("/login");
    } catch (error) {
      mapApiErrorsToForm(error, setError);
    }
  };
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full md:w-[380px] bg-white p-8 rounded-lg shadow-lg border border-yellow-300">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center bg-White rounded-md">
          <h2 className="text-xl font-bold text-black">ĐĂNG KÝ</h2>
        </div>
        {/* Form Đăng ký */}
        <input
          type="text"
          placeholder="Email"
          autoFocus
          className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-3 rounded"
          {...register("email", {
            required: "Email không được để trống",
            pattern: {
              value: EMAIL_PATTERN,
              message: "Email không hợp lệ",
            },
          })}
        />
        <p className="text-red-500 mt-2 text-sm">
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </p>
        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-3 rounded"
          {...register("name", {
            required: "Tên không được để trống",
          })}
        />
        <div className="text-red-500 mt-2 text-sm">
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            {...register("password", {
              required: "Mật khẩu không được để trống",
              validate: () => getPasswordError(password) ?? true,
            })}
            className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-3 rounded"
          />
          <button
            type="button"
            className="absolute top-3 inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="text-red-500 mt-2 text-sm">
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-3 rounded"
            {...register("passwordConfirmation", {
              required: "Vui lòng xác nhận lại mật khẩu",
              validate: (val) =>
                val === password || "Mật khẩu xác nhận không khớp",
            })}
          />
          <div className="text-red-500 mt-2 text-sm">
            {errors.passwordConfirmation && (
              <ErrorText>{errors.passwordConfirmation.message}</ErrorText>
            )}
            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
          </div>
          <button
            type="button"
            className="absolute top-3 inset-y-0 right-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button className="w-full bg-yellow-400 text-white p-3 rounded mt-3 font-semibold shadow-md disabled:opacity-50">
          Đăng Ký
        </button>

        <div className="flex justify-center text-sm text-gray-600 mt-3 border-t border-gray-300 pt-4">
          <span className="text-gray-600 pr-2 ">Bạn đã có tài khoản?</span>
          <Link
            href={"/login"}
            className="text-yellow-700 cursor-pointer hover:text-yellow-900"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </form>
  );
};

export default function RegisterUser() {
  return (
    <div className="w-full flex flex-col items-center bg-white">
      {/* Header */}
      {/* Main Content */}
      <div className="bg-[#FFDA3E] w-full h-[604px] flex justify-center items-center ">
        <main className="w-full max-w-5xl flex flex-col  md:flex-row items-center bg-[#FFDA3E]">
          {/* Banner */}
          <div className="flex-1 p-5">
            <img src="/body.png" className="w-full rounded-lg" />
          </div>
          {/* Form Register */}
          <RegisterForm />
        </main>
      </div>
    </div>
  );
}
