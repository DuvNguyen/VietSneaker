"use client";
import React, { useState } from "react";
import ConfirmModal from "@/app/components/modal/confirm-modal";
import { OrderControllerService, OrderSummaryResponse } from "@/gen";
import Thumbnail from "@/app/components/common/thumbnail";
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
        logger.error("Unknow order id");
        return;
      }
      await OrderControllerService.cancelOrder(order.orderId);
      toast.success("Đơn hàng đã được hủy");
      order.status = OrderStatusType.CANCELLED;
      onOrderChange(order);
    } catch (error) {
      logger.error(String(error));
    }
    closeModal();
  };

  return (
    <>
      <tr>
        <td>
          <i className="fa fa-external-link-alt  cursor-pointer"></i>
        </td>
        <td>{order.orderId}</td>
        <td>
          <div className="flex items-start flex-col gap-3  text-wrap max-w-96">
            {order.orderItems?.map((item) => (
              <div key={item.productId} className="flex items-start gap-4">
                <Thumbnail className="size-[6rem]">
                  <ProductImage data={item.image} />
                </Thumbnail>
                <div className="flex-1">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-bold font-medium mb-2">{item.name}</h3>
                  </Link>
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
        </td>
        <td>
          <br />
          <span className="badge badge-md font-medium  badge-soft badge-neutral">
            {getOrderStatusLabel(order.status as OrderStatusType)}
          </span>
        </td>

        <td className="max-w-64">{order.address}</td>
        <td>{formatVND(order.totalPrice)}</td>
        <td>
          {/*
          <button
            className={`btn  btn-sm ${disableReturnOrder(order.status as OrderStatusType) ? "hidden" : ""}`}
          >
            Trả hàng
          </button>
            *
            */}
        </td>
        <td>
          {enableCancelOrder(order.status as OrderStatusType) && (
            <button onClick={openModal} className={`btn  btn-sm btn-error`}>
              Hủy đơn
            </button>
          )}

          {/* Confirm message for cancel order action */}
          <div>
            <ConfirmModal
              isOpen={isOpen}
              onClose={closeModal}
              onConfirm={handleConfirmCancelOrder}
              title={"Xác nhận"}
              content={"Bạn có muốn hủy đơn hàng này?"}
            />
          </div>
        </td>
      </tr>
    </>
  );
};
export default OrderRow;
