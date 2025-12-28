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

// Định nghĩa màu sắc badge tách biệt để dễ quản lý
const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20",
  CANCELLED: "bg-red-50 text-red-700 border-red-200 ring-red-500/20",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
  WAITING: "bg-gray-100 text-gray-700 border-gray-200 ring-gray-500/20", // Mặc định cho chờ xác nhận
};

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
      
      // Update local state optimistic UI
      const updatedOrder = { ...order, status: status };
      const newOrders = orders.map((o) => 
        o.orderId === order.orderId ? updatedOrder : o
      );
      
      onOrdersChange(newOrders);
      toast.success(`Đã cập nhật đơn #${order.orderId} sang ${getOrderStatusLabel(status)}`);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleClick = (order: AdminOrderSummaryResponse) => {
    sessionStorage.setItem("selectedOrder", JSON.stringify(order));
  };

  const getStatusBadgeClass = (status?: string) => {
    return STATUS_STYLES[status || ""] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-[80px]">
                Mã đơn
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                SĐT
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[200px]">
                Địa chỉ
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tổng giá
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-[180px]">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50 transition-colors duration-150 group"
                >
                  {/* Mã đơn */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900 font-medium">
                    #{order.orderId}
                  </td>

                  {/* Khách hàng */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customerName || "Khách lẻ"}</div>
                  </td>

                  {/* SĐT */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 font-mono">
                    {order.phone}
                  </td>

                  {/* Địa chỉ - Có truncate */}
                  <td className="px-6 py-4 text-gray-500">
                    <div className="truncate max-w-[220px]" title={order.address}>
                      {order.address}
                    </div>
                  </td>

                  {/* Ngày đặt */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy") : "-"}
                  </td>

                  {/* Tổng giá */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-[#e20000]">
                    {formatVND(order.totalPrice)}
                  </td>

                  {/* Trạng thái - ĐÃ FIX GÃY DÒNG */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status as OrderStatusType)}
                    </span>
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col space-y-2 items-center">
                      <Link href={`/admin/orders/${order.orderId}`} className="w-full">
                        <button
                          onClick={() => handleClick(order)}
                          className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                        >
                          <i className="fa fa-eye mr-1.5 text-gray-400 group-hover:text-gray-600"></i>
                          Chi tiết
                        </button>
                      </Link>

                      {/* Các nút logic trạng thái */}
                      <div className="flex w-full space-x-1">
                        {canApprove(order.status) && (
                          <button
                            className="flex-1 bg-[#e20000] hover:bg-[#c10000] text-white text-xs px-2 py-1.5 rounded shadow-sm transition-colors"
                            onClick={() => setOrderStatus(order, OrderStatusType.PROCESSING)}
                          >
                            Duyệt
                          </button>
                        )}
                        {canStartShipping(order.status) && (
                          <button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1.5 rounded shadow-sm transition-colors"
                            onClick={() => setOrderStatus(order, OrderStatusType.SHIPPED)}
                          >
                            Giao
                          </button>
                        )}
                        {canCompleteShipping(order.status) && (
                          <button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-1.5 rounded shadow-sm transition-colors"
                            onClick={() => setOrderStatus(order, OrderStatusType.COMPLETED)}
                          >
                            Hoàn tất
                          </button>
                        )}
                        {canCancel(order.status) && (
                          <button
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1.5 rounded shadow-sm transition-colors"
                            onClick={() => setOrderStatus(order, OrderStatusType.CANCELLED)}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State đẹp hơn
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <i className="fa fa-inbox text-4xl text-gray-300 mb-3"></i>
                    <p className="text-base font-medium text-gray-600">Chưa có đơn hàng nào</p>
                    <p className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau hoặc thay đổi bộ lọc.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderTable;