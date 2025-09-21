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
    status: OrderStatusType,
  ) => {
    try {
      if (!order.orderId) {
        return;
      }
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
    <div className="tab-content bg-base-100 border-base-300 p-6">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tên khách hàng</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Ngày đặt</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td className="max-w-[250px] truncate">{order.address}</td>
              <td>
                {order.createdAt
                  ? format(new Date(order.createdAt), "dd/MM/yyyy")
                  : ""}
              </td>
              <td>{formatVND(order.totalPrice)}</td>
              <td>
                <span className="badge badge-md font-medium  badge-soft badge-neutral">
                  {getOrderStatusLabel(order.status as OrderStatusType)}
                </span>
              </td>
              <td className="flex gap-2">
                <Link href={`/admin/orders/${order.orderId}`}>
                  <button
                    onClick={() => {
                      sessionStorage.setItem(
                        "selectedOrder",
                        JSON.stringify(order),
                      );
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    Chi tiết
                  </button>
                </Link>
              </td>
              <td className="flex gap-1">
                {canApprove(order.status) && (
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setOrderStatus(order, OrderStatusType.PROCESSING)
                    }
                  >
                    Duyệt đơn
                  </button>
                )}
                {canStartShipping(order.status) && (
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setOrderStatus(order, OrderStatusType.SHIPPED)
                    }
                  >
                    Bắt đầu vận chuyển
                  </button>
                )}
                {canCompleteShipping(order.status) && (
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setOrderStatus(order, OrderStatusType.COMPLETED)
                    }
                  >
                    Giao thành công
                  </button>
                )}
                {canCancel(order.status) && (
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() =>
                      setOrderStatus(order, OrderStatusType.CANCELLED)
                    }
                  >
                    Hủy đơn
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminOrderTable;
