import PrimaryButton from "@/app/components/button/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
const CheckoutSuccessPage = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">Đặt hàng thành công🎉</h1>
          <p className="py-6">
            Cảm ơn bạn đã đồng hành cùng vietsneaker
            <br />
            Thông tin đơn hàng của bạn sẽ được chúng tôi cập nhập thông qua
            email
          </p>
          <div className="flex items-center justify-center">
            <Link href="/orders">
              <PrimaryButton>
                <ShoppingBag />
                Quản lý đơn hàng
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
