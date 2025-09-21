import Link from "next/link";
import React from "react";
import PrimaryButton from "./components/button/button";
const NotFound = () => {
  return (
    <>
      <div className="py-10 mx-auto max-w-7xl">
        {/*
         * Go back to hompage link
         */}
        <div className="mb-6"></div>

        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">404</h2>
          <p className="text-gray-500 mb-8">Trang bạn tìm kiếm không tồn tại</p>
          <div className="flex items-center justify-center">
            <Link href="/">
              <PrimaryButton>Quay lại trang chủ</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
