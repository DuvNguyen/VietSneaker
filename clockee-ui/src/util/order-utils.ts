import { OrderStatusDict } from "@/model/OrderStatus";

import { OrderStatus as OrderStatusType } from "@/gen/backend";
import { AdminOrderSummaryResponse } from "@/gen";
export const orderStatusDescription = (status: string) => {
  const normalized = status?.toUpperCase();
  return Object.values(OrderStatusDict).find((s) => s === normalized);
};

export function getOrderStatusLabel(status: OrderStatusType): string {
  switch (status) {
    case OrderStatusDict.PENDING:
      return "Chờ xác nhận";
    case OrderStatusDict.PROCESSING:
      return "Đang xử lý";
    case OrderStatusDict.SHIPPED:
      return "Đang vận chuyển";
    case OrderStatusDict.RETURNING:
      return "Đang hoàn trả";
    case OrderStatusDict.RETURNED:
      return "Đã hoàn trả";
    case OrderStatusDict.CANCELLED:
      return "Đã hủy";
    case OrderStatusDict.COMPLETED:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
}

export const disableReturnOrder = (status: string) => {
  return orderStatusDescription(status) === OrderStatusDict.SHIPPED;
};

export const enableCancelOrder = (status: string) => {
  const normalized = orderStatusDescription(status);
  return (
    normalized === OrderStatusDict.PENDING ||
    normalized === OrderStatusDict.PROCESSING
  );
};

// Xác định hành động cho phép duyệt, giao hàng, hoàn tất
export const canApprove = (status: AdminOrderSummaryResponse["status"]) => {
  return status === "PENDING"; // Chỉ có thể duyệt đơn khi là PENDING
};

export const canStartShipping = (
  status: AdminOrderSummaryResponse["status"],
) => {
  return status === "PROCESSING"; // Chỉ có thể bắt đầu vận chuyển khi là PROCESSING
};

export const canCompleteShipping = (
  status: AdminOrderSummaryResponse["status"],
) => {
  return status === "SHIPPED"; // Chỉ có thể hoàn tất khi là SHIPPED
};

export const canCancel = (status: AdminOrderSummaryResponse["status"]) => {
  return status === "PENDING" || status === "PROCESSING"; // Chỉ có thể hủy khi là PENDING hoặc PROCESSING
};
