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
import styles from "./RegisterUser.module.scss";

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
    <div className={styles.signupBox}>
      <div className={styles.header}>
        <h2>ĐĂNG KÝ</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          type="text"
          placeholder="Email"
          autoFocus
          {...register("email", {
            required: "Email không được để trống",
            pattern: { value: EMAIL_PATTERN, message: "Email không hợp lệ" },
          })}
        />
        {errors.email && (
          <p className={styles.errorText}>{errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="Họ và tên"
          {...register("name", { required: "Tên không được để trống" })}
        />
        {errors.name && (
          <p className={styles.errorText}>{errors.name.message}</p>
        )}

        <div className={styles.relativeInput}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            {...register("password", {
              required: "Mật khẩu không được để trống",
              validate: () => getPasswordError(password) ?? true,
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}

        <div className={styles.relativeInput}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            {...register("passwordConfirmation", {
              required: "Vui lòng xác nhận lại mật khẩu",
              validate: (val) =>
                val === password || "Mật khẩu xác nhận không khớp",
            })}
          />
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.passwordConfirmation && (
          <p className={styles.errorText}>
            {errors.passwordConfirmation.message}
          </p>
        )}
        {errors.root && (
          <p className={styles.errorText}>{errors.root.message}</p>
        )}

        <button type="submit">Đăng ký</button>
      </form>

      <div className={styles.links}>
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className={styles.loginLink}>
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default function RegisterUser() {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.banner}>
        <div className={styles.overlay}></div>
        <div className={styles.contentWrapper}>
          <div className={styles.left}>
            <img src="/body.png" className={styles.bannerImage} />
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
