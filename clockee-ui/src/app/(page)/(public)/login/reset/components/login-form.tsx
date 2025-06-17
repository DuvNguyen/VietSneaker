"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/hooks/use-auth";
import { ApiError, AuthControllerService, LoginRequest } from "@/gen";
import { Eye, EyeOff } from "lucide-react";
import { logger } from "@/util/logger";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorText from "@/app/components/typography/error-text";
import { mapApiErrorsToForm } from "@/util/form";
import { HttpErrorResponse } from "@/model/HttpErrorResponse";
import { HttpStatusCode } from "axios";
import { EMAIL_PATTERN } from "@/config/pattern";
export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { saveUserDetails, isAuthenticated, logout } = useAuth();
  const params = useSearchParams();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, []);

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      const res = await AuthControllerService.login(data);
      saveUserDetails(res);
      toast("Đăng nhập thành công");
      const redirectUrl = params.get("redirect");
      logger.info("redirect to", redirectUrl);
      if (redirectUrl && redirectUrl != "/login") {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (e) {
      mapApiErrorsToForm(e, setError);
      if (e instanceof ApiError && e.body) {
        const errorResponse = e.body as HttpErrorResponse;
        if (
          errorResponse.status === HttpStatusCode.BadRequest ||
          errorResponse.status === HttpStatusCode.Unauthorized
        ) {
          setError("root", {
            message: "Tài khoản hoặc mật khẩu không chính xác",
          });
        }
      }
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <input
          autoFocus
          type="text"
          placeholder="Email"
          className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-7 rounded"
          {...register("email", {
            // required: "Email không được trống",
            pattern: {
              value: EMAIL_PATTERN,
              message: "Email không hợp lệ",
            },
          })}
        />
        <div className="absolute text-red-500 mt-1 text-sm ml-1">
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </div>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          className="w-full border border-yellow-400 bg-transparent text-gray-700 p-2 mt-7 rounded"
          {...register("password", {
            required: "Mật khẩu không được để trống",
          })}
        />
        <button
          className="absolute inset-y-0 right-3 top-6 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <div className="absolute text-red-500 mt-1 ml-1 text-sm">
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
        </div>
      </div>
      <button
        type="submit"
        className={`w-full bg-yellow-400 text-white p-3 rounded mt-7 font-semibold shadow-md hover:opacity-75"`}
      >
        Tiếp theo
      </button>
    </form>
  );
};
