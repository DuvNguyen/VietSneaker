"use client";
import { useCart } from "@/lib/hooks/use-cart";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const OrderSummary = () => {
  const { selectedItems, subtotal } = useCart();

  const formatVND = (value?: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value ?? 0);
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3">
        {selectedItems.map((item, index) => {
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-semibold">
                {formatVND(Number(item.quantity) * Number(item.price))}
              </span>
            </div>
          );
        })}

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-semibold">{formatVND(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Giảm giá</span>
          {/*
          <span className="font-semibold text-shop-discount">
            -{formatVND(discount)}
          </span>
            */}
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng cộng</span>
            <span className="font-bold text-lg">{formatVND(subtotal)}</span>
          </div>
        </div>
      </div>

      {subtotal > 0 ? (
        <Link href={"/checkout/shippping"}>
          <button
            className={`btn bg-red-600  text-white w-full mt-4 rounded-lg `}
          >
            Tiến hành thanh toán
          </button>
        </Link>
      ) : (
        <button
          className="btn bg-red-600 hover:bg-red-700 text-white w-full mt-4 rounded-lg"
          onClick={() => {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán");
          }}
        >
          Tiến hành thanh toán
        </button>
      )}
    </div>
  );
};

export default OrderSummary;
