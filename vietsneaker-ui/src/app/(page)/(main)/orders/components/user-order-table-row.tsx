"use client";
import React, { useState } from "react";
import ConfirmModal from "@/app/components/modal/confirm-modal";
import { OrderControllerService, OrderSummaryResponse } from "@/gen";
// Import ProductImage để đồng bộ với trang chi tiết
import { ProductImage } from "@/app/components/common/ProductImage";

import { OrderStatus as OrderStatusType } from "@/gen/backend";
import { logger } from "@/util/logger";
import { enableCancelOrder, getOrderStatusLabel } from "@/util/order-utils";
import { formatVND } from "@/util/currency";
import Link from "next/link";
import { toast } from "react-toastify";

const OrderRow = ({
  order,
  onOrderChange,
}: {
  order: OrderSummaryResponse;
  onOrderChange: (updatedOrder: OrderSummaryResponse) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const handleConfirmCancelOrder = async () => {
    try {
      if (!order.orderId) {
        logger.error("Unknown order id");
        return;
      }
      await OrderControllerService.cancelOrder(order.orderId);
      toast.success("Đơn hàng đã được hủy");
      
      // Cập nhật state với object mới để React nhận biết sự thay đổi
      onOrderChange({
        ...order,
        status: OrderStatusType.CANCELLED
      });
    } catch (error) {
      logger.error(String(error));
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
    closeModal();
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">
          <i className="fa fa-external-link-alt cursor-pointer text-gray-400 hover:text-blue-500"></i>
        </td>
        <td className="font-semibold text-gray-700">#{order.orderId}</td>
        <td className="p-4">
          <div className="flex flex-col gap-3 max-w-sm">
            {order.orderItems?.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                
                {/* Khung ảnh: Copy logic từ ProductDetailsPage nhưng thu nhỏ */}
                <div className="w-20 h-20 flex-shrink-0 bg-white border rounded-md flex items-center justify-center overflow-hidden shadow-sm">
                  {item.image ? (
                    <ProductImage src={item.image} />
                  ) : (
                    <span className="text-[10px] text-gray-400 italic text-center">
                      No image
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-sm font-bold text-gray-800 hover:text-red-600 truncate transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex flex-col text-xs mt-1 text-gray-500">
                    <span>Số lượng: <span className="font-medium text-gray-900">x{item.quantity}</span></span>
                    <span>Giá: <span className="font-medium text-red-600">{formatVND(item.price)}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </td>
        <td>
          <span className="badge badge-md font-medium badge-soft badge-neutral">
            {getOrderStatusLabel(order.status as OrderStatusType)}
          </span>
        </td>
        <td className="max-w-64 text-sm text-gray-600 leading-snug">
          {order.address}
        </td>
        <td className="font-bold text-gray-900">
          {formatVND(order.totalPrice)}
        </td>
        <td>
          {/* Chỗ trống cho các nút chức năng khác như Trả hàng */}
        </td>
        <td className="p-4">
          {enableCancelOrder(order.status as OrderStatusType) && (
            <button 
              onClick={openModal} 
              className="btn btn-sm btn-error"
            >
              Hủy đơn
            </button>
          )}

          <ConfirmModal
            isOpen={isOpen}
            onClose={closeModal}
            onConfirm={handleConfirmCancelOrder}
            title={"Xác nhận hủy đơn"}
            content={"Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác."}
          />
        </td>
      </tr>
    </>
  );
};

export default OrderRow;