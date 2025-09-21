"use client";

import { useEffect } from "react";
import PrimaryButton from "./components/button/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-10 mx-auto max-w-7xl">
      {/*
       * Go back to hompage link
       */}
      <div className="mb-6"></div>

      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">404</h2>
        <p className="text-gray-500 mb-8">
          Có lỗi xảy ra trong quá trình xử lý. Vui lòng tải lại trang hoặc thử
          lại sau
        </p>
        <div className="flex items-center justify-center">
          <Link href="/">
            <PrimaryButton>Quay lại trang chủ</PrimaryButton>
          </Link>
        </div>
        <button className="btn mt-10" onClick={() => reset()}>
          Thử lại
        </button>
      </div>
    </div>
  );
}
