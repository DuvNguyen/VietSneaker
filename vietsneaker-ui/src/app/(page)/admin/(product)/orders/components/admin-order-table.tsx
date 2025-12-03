"use client";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { formatVND } from "@/util/currency";
import Link from "next/link";
import { OrderStatus as OrderStatusType } from "@/gen/backend";
import {
  canApprove,
  canCancel,
  canCompleteShipping,
  canStartShipping,
  getOrderStatusLabel,
} from "@/util/order-utils";
import {
  AdminOrderControllerService,
  AdminOrderSummaryResponse,
  UpdateOrderStatusRequest,
} from "@/gen";

const AdminOrderTable = ({
  orders,
  onOrdersChange,
}: {
  orders: AdminOrderSummaryResponse[];
  onOrdersChange: (newOrders: AdminOrderSummaryResponse[]) => void;
}) => {
  const setOrderStatus = async (
    order: AdminOrderSummaryResponse,
    status: OrderStatusType
  ) => {
    try {
      if (!order.orderId) return;
      await AdminOrderControllerService.updateOrderStatus(order.orderId, {
        status: String(status) as UpdateOrderStatusRequest.status,
      });
      order.status = status;
      onOrdersChange(orders);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleClick = () => {
    sessionStorage.setItem("selectedOrder", JSON.stringify(orders));
  };

  return (
    <div className="tab-content bg-white border border-gray-200 rounded-md shadow-sm p-6">
      <table className="w-full border-collapse table-fixed text-left text-[15px]">
        <thead className="bg-[#ffcccc] text-gray-800">
          <tr>
            <th className="p-3 border-b border-gray-300 text-center w-[8%]">Mã đơn</th>
            <th className="p-3 border-b border-gray-300 text-center w-[15%]">Khách hàng</th>
            <th className="p-3 border-b border-gray-300 text-center w-[10%]">SĐT</th>
            <th className="p-3 border-b border-gray-300 text-center w-[25%]">Địa chỉ</th>
            <th className="p-3 border-b border-gray-300 text-center w-[10%]">Ngày đặt</th>
            <th className="p-3 border-b border-gray-300 text-center w-[10%]">Tổng giá</th>
            <th className="p-3 border-b border-gray-300 text-center w-[10%]">Trạng thái</th>
            <th className="p-3 border-b border-gray-300 text-center w-[6%]"></th>
            <th className="p-3 border-b border-gray-300 text-center w-[6%]"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className="hover:bg-gray-50 transition border-b border-gray-200"
            >
              <td className="p-3 text-center font-medium text-gray-700">
                {order.orderId}
              </td>
              <td className="p-3 text-center text-gray-700">
                {order.customerName}
              </td>
              <td className="p-3 text-center text-gray-700">{order.phone}</td>
              <td className="p-3 text-center text-gray-600 max-w-[250px] truncate">
                {order.address}
              </td>
              <td className="p-3 text-center text-gray-700">
                {order.createdAt
                  ? format(new Date(order.createdAt), "dd/MM/yyyy")
                  : ""}
              </td>
              <td className="p-3 text-center font-semibold text-gray-800">
                {formatVND(order.totalPrice)}
              </td>

              {/* Trạng thái */}
              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : order.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {getOrderStatusLabel(order.status as OrderStatusType)}
                </span>
              </td>

              {/* Cột chi tiết */}
              <td className="p-3 text-center">
                <Link href={`/admin/orders/${order.orderId}`}>
                  <button
                    onClick={() =>
                      sessionStorage.setItem(
                        "selectedOrder",
                        JSON.stringify(order)
                      )
                    }
                    className="text-[#e20000] border border-[#e20000] text-sm px-3 py-1 rounded-sm font-medium hover:bg-[#e20000] hover:text-white transition-colors"
                  >
                    Chi tiết
                  </button>
                </Link>
              </td>

              {/* Cột hành động */}
              <td className="p-3 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {canApprove(order.status) && (
                    <button
                      className="text-white bg-[#e20000] text-xs px-3 py-1 rounded-sm hover:bg-[#c10000] transition"
                      onClick={() =>
                        setOrderStatus(order, OrderStatusType.PROCESSING)
                      }
                    >
                      Duyệt
                    </button>
                  )}
                  {canStartShipping(order.status) && (
                    <button
                      className="text-white bg-blue-500 text-xs px-3 py-1 rounded-sm hover:bg-blue-600 transition"
                      onClick={() =>
                        setOrderStatus(order, OrderStatusType.SHIPPED)
                      }
                    >
                      Vận chuyển
                    </button>
                  )}
                  {canCompleteShipping(order.status) && (
                    <button
                      className="text-white bg-green-600 text-xs px-3 py-1 rounded-sm hover:bg-green-700 transition"
                      onClick={() =>
                        setOrderStatus(order, OrderStatusType.COMPLETED)
                      }
                    >
                      Hoàn tất
                    </button>
                  )}
                  {canCancel(order.status) && (
                    <button
                      className="text-white bg-red-600 text-xs px-3 py-1 rounded-sm hover:bg-red-700 transition"
                      onClick={() =>
                        setOrderStatus(order, OrderStatusType.CANCELLED)
                      }
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminOrderTable;
