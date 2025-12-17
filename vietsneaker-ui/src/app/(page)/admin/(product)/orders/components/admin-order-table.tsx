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
  // --- GIỮ NGUYÊN LOGIC CODE ---
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
      // Clone mảng để React nhận diện thay đổi state
      onOrdersChange([...orders]); 
      toast.success("Cập nhật trạng thái thành công");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleClick = (order: AdminOrderSummaryResponse) => {
    sessionStorage.setItem("selectedOrder", JSON.stringify(order));
  };
  // -----------------------------

  // Helper màu sắc badge (UI Only)
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-700 border border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border border-red-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border border-blue-200";
      case "PROCESSING": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    // Wrapper Style giống Supplier: border, shadow-sm, rounded-xl
    <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="min-w-full border-collapse table-auto text-left text-[14px]">
        {/* Header xám chuẩn chỉ */}
        <thead className="bg-gray-100 text-gray-700 sticky top-0 font-semibold">
          <tr>
            <th className="p-4 border-b border-gray-300 text-center w-[8%]">Mã đơn</th>
            <th className="p-4 border-b border-gray-300 text-left w-[15%]">Khách hàng</th>
            <th className="p-4 border-b border-gray-300 text-center w-[10%]">SĐT</th>
            <th className="p-4 border-b border-gray-300 text-left w-[20%]">Địa chỉ</th>
            <th className="p-4 border-b border-gray-300 text-center w-[10%]">Ngày đặt</th>
            <th className="p-4 border-b border-gray-300 text-right w-[10%]">Tổng giá</th>
            <th className="p-4 border-b border-gray-300 text-center w-[10%]">Trạng thái</th>
            <th className="p-4 border-b border-gray-300 text-center w-[17%]">Hành động</th>
          </tr>
        </thead>
        
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.orderId}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
              >
                {/* Mã đơn */}
                <td className="p-4 text-center font-medium text-gray-900">
                  #{order.orderId}
                </td>

                {/* Khách hàng */}
                <td className="p-4 text-left font-medium text-gray-800">
                  {order.customerName}
                </td>

                {/* SĐT */}
                <td className="p-4 text-center text-gray-600">
                  {order.phone}
                </td>

                {/* Địa chỉ (Truncate nếu quá dài) */}
                <td className="p-4 text-left text-gray-600 max-w-[200px]" title={order.address}>
                  <div className="truncate">{order.address}</div>
                </td>

                {/* Ngày đặt */}
                <td className="p-4 text-center text-gray-600">
                  {order.createdAt
                    ? format(new Date(order.createdAt), "dd/MM/yyyy")
                    : "-"}
                </td>

                {/* Tổng giá (Màu đỏ chủ đạo) */}
                <td className="p-4 text-right font-bold text-[#e20000]">
                  {formatVND(order.totalPrice)}
                </td>

                {/* Trạng thái */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusLabel(order.status as OrderStatusType)}
                  </span>
                </td>

                {/* Hành động & Chi tiết */}
                <td className="p-4 text-center">
                  <div className="flex flex-col gap-2 items-center justify-center">
                    {/* Nút Chi tiết */}
                    <Link href={`/admin/orders/${order.orderId}`} className="w-full">
                      <button
                        onClick={() => handleClick(order)}
                        className="w-full text-gray-600 border border-gray-300 text-xs px-3 py-1.5 rounded hover:bg-gray-100 hover:text-[#e20000] transition-colors font-medium flex items-center justify-center gap-1"
                      >
                         <i className="fa fa-eye"></i> Chi tiết
                      </button>
                    </Link>

                    {/* Các nút hành động Logic */}
                    <div className="flex flex-wrap justify-center gap-1 w-full">
                      {canApprove(order.status) && (
                        <button
                          className="flex-1 min-w-[70px] text-white bg-[#e20000] text-xs px-2 py-1.5 rounded hover:bg-[#c10000] transition shadow-sm"
                          onClick={() =>
                            setOrderStatus(order, OrderStatusType.PROCESSING)
                          }
                        >
                          Duyệt
                        </button>
                      )}
                      {canStartShipping(order.status) && (
                        <button
                          className="flex-1 min-w-[70px] text-white bg-blue-500 text-xs px-2 py-1.5 rounded hover:bg-blue-600 transition shadow-sm"
                          onClick={() =>
                            setOrderStatus(order, OrderStatusType.SHIPPED)
                          }
                        >
                          Giao
                        </button>
                      )}
                      {canCompleteShipping(order.status) && (
                        <button
                          className="flex-1 min-w-[70px] text-white bg-green-600 text-xs px-2 py-1.5 rounded hover:bg-green-700 transition shadow-sm"
                          onClick={() =>
                            setOrderStatus(order, OrderStatusType.COMPLETED)
                          }
                        >
                          Hoàn tất
                        </button>
                      )}
                      {canCancel(order.status) && (
                        <button
                          className="flex-1 min-w-[70px] text-white bg-gray-500 text-xs px-2 py-1.5 rounded hover:bg-gray-600 transition shadow-sm"
                          onClick={() =>
                            setOrderStatus(order, OrderStatusType.CANCELLED)
                          }
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
             // Empty state
            <tr>
              <td colSpan={8} className="text-center py-10 text-gray-500 italic bg-gray-50">
                 Không có dữ liệu đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;