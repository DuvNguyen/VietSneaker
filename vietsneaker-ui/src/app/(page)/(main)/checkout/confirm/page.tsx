"use client";
import { MapPin, CreditCard } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import React, { MouseEvent } from "react";
import { formatVND } from "@/util/currency";
import { OrderControllerService } from "@/gen";
import { logger } from "@/util/logger";
import { ProductImage } from "@/app/components/common/base-64-image";
import Thumbnail from "@/app/components/common/thumbnail";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const CheckoutAddressPage = () => {
  const {
    selectedItems,
    subtotal,
    shippingPrice,
    totalPrice,
    deliveryDetails,
    fetchCart,
  } = useCart();
  const router = useRouter();

  const createOrderHanler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      OrderControllerService.createOrder({
        phone: deliveryDetails.phone,
        address: String(deliveryDetails.address),
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      router.push("/checkout/success");
    } catch (error) {
      logger.error(error);
      toast.error("Có lỗi xảy ra vui lòng thử lại");
    }
    // Refresh cart details
    fetchCart();
  };

  return (
    <div className="py-8">
      <div className="flex items-center flex-col">
        <ul className="steps steps-vertical lg:steps-horizontal mb-20">
          <li className="step step-primary">Giỏ hàng</li>
          <li className="step step-primary">Thông tin nhận hàng</li>
          <li className="step step-primary">Xác nhận</li>
        </ul>
      </div>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-xl font-medium mb-4">CHI TIẾT ĐƠN HÀNG</h1>

        {/* Shipping address */}
        <div className="bg-white rounded-lg shadow mb-4 p-4 border">
          <div className="flex items-start gap-2">
            <MapPin className="text-yellow-500 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-sm">Địa chỉ nhận hàng</h3>
              <p className="text-sm mt-1">
                {deliveryDetails.name} - {deliveryDetails.phone} -{" "}
                {deliveryDetails.address}
              </p>
            </div>
          </div>
        </div>

        {/* CartItem list */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h3 className="font-medium text-sm mb-3">Sản phẩm đã chọn</h3>
          {selectedItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-start gap-4 border-b py-4 last:border-none"
            >
              {/*
                *
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                */}
              <Thumbnail className="size-[8rem]">
                <ProductImage data={item.image} />
              </Thumbnail>
              <div className="flex-1">
                <h3 className="text-bold font-medium mb-2">{item.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm">Số lượng:</span>
                  <div className="flex items-center">
                    <span className="px-2">x{item.quantity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm">Giá:</span>
                  <div className="flex items-center">
                    <div className="text-sm">{formatVND(item.price)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-lg shadow mb-4 p-4 space-y-3">
          <h3 className="font-medium text-sm">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>
              {shippingPrice == 0 ? "Miễn phí" : formatVND(shippingPrice)}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Tổng tiền</span>
            <span className="font-bold text-base">{formatVND(totalPrice)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} />
            <h3 className="font-medium text-sm">Phương thức thanh toán</h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              id="cod"
              className="accent-red-600"
              defaultChecked
            />
            <label htmlFor="cod" className="text-sm">
              Thanh toán khi nhận hàng
            </label>
          </div>
        </div>

        <button
          onClick={createOrderHanler}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-sm"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutAddressPage;
