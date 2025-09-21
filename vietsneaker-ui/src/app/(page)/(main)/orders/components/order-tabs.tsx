import React from "react";
import { OrderSummaryResponse } from "@/gen";
import OrderRow from "./user-order-table-row";
/**
 * Filter tab for order by status: PENDING, SHIPPED, etc
 *
 */
const OrderTab: React.FC<{
  orders: OrderSummaryResponse[];
  onOrdersChange: (updatedOrders: OrderSummaryResponse[]) => void;
}> = ({ orders, onOrdersChange }) => {
  function onOrderChange() {
    onOrdersChange(orders);
  }

  return (
    <>
      <div className="tab-content bg-base-100 border-base-300 p-6">
        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th>{/* View detail */}</th>
                  <th>Mã đơn</th>
                  <th>Mặt hàng</th>
                  <th>Trạng thái vận chuyển</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Tổng giá</th>
                  <th>{/* Return order button */}</th>
                  <th>{/* Cancel order button */}</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {orders.map((order) => (
                  <OrderRow
                    key={order.orderId}
                    order={order}
                    onOrderChange={onOrderChange}
                  />
                ))}
              </tbody>
              {/* foot */}
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p>Hiện không có đơn hàng nào</p>
          </div>
        )}
      </div>
    </>
  );
};
export default OrderTab;
