import PrimaryButton from "@/app/components/button/button";
import Link from "next/link";
import React from "react";

const ForbiddenPage = () => {
  return (
    <>
      <div className="py-10 mx-auto max-w-7xl">
        {/* Go back to homepage link */}
        <div className="mb-6"></div>

        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">403</h2>
          <p className="text-gray-500 mb-8">
            Bạn không có quyền truy cập vào trang này
          </p>
          <div className="flex items-center justify-center">
            <Link href="/">
              <PrimaryButton className="bg-red-500 hover:bg-red-700">Quay lại trang chủ</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForbiddenPage;
