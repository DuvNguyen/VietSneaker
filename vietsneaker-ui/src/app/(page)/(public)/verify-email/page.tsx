"use client";
import PrimaryButton from "@/app/components/button/button";
import { LoadingScreen } from "@/app/components/common/loading";
import { AuthControllerService, UserControllerService } from "@/gen";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const verifyEmail = () => {
      try {
        setIsLoading(true);
        if (!token || !userId) {
          setIsValid(false);
          return;
        }
        AuthControllerService.verifyEmail(Number(userId), Number(token));
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
      setIsLoading(false);
    };
    verifyEmail();
  }, [token, userId]);
  if (isLoading) return <LoadingScreen />;
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">
              {isValid
                ? "Xác thực email thành công🎉"
                : "Xác thực email không thành công❌"}
            </h1>
            <p className="py-6">
              {isValid
                ? "Chúc mừng! Email của bạn đã được xác thực thành công. Bạn có thể bắt đầu sử dụng ứng dụng ngay bây giờ."
                : "Rất tiếc, xác thực email của bạn không thành công. Vui lòng kiểm tra lại liên kết xác thực hoặc thử lại sau."}
            </p>
            <div className="flex items-center justify-center">
              {isValid ? (
                <Link href="/">
                  <PrimaryButton>
                    <ShoppingBag />
                    Đi đến trang chính
                  </PrimaryButton>
                </Link>
              ) : (
                <Link href="/resend-verification">
                  <PrimaryButton>Gửi lại liên kết xác thực</PrimaryButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;
