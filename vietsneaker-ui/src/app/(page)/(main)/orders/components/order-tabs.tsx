import React from "react";
import { OrderSummaryResponse } from "@/gen";
import OrderRow from "./user-order-table-row";

const OrderTab: React.FC<{
  orders: OrderSummaryResponse[];
  onOrdersChange: (updatedOrders: OrderSummaryResponse[]) => void;
}> = ({ orders, onOrdersChange }) => {

  // Hàm xử lý khi một đơn hàng con thay đổi
  const handleSingleOrderChange = (updatedOrder: OrderSummaryResponse) => {
    // Tạo mảng mới: tìm order cũ bằng ID và thay thế bằng order mới
    const updatedList = orders.map((o) => 
      o.orderId === updatedOrder.orderId ? updatedOrder : o
    );
    // Gửi mảng mới này lên page cha (OrderHistoryPage)
    onOrdersChange(updatedList);
  };

  return (
    <div className="tab-content bg-base-100 border-base-300 p-6">
      {orders.length ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Mã đơn</th>
                <th>Mặt hàng</th>
                <th>Trạng thái vận chuyển</th>
                <th>Địa chỉ giao hàng</th>
                <th>Tổng giá</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order.orderId}
                  order={order}
                  onOrderChange={handleSingleOrderChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-10">
          <p className="text-gray-500">Hiện không có đơn hàng nào</p>
        </div>
      )}
    </div>
  );
};

export default OrderTab;