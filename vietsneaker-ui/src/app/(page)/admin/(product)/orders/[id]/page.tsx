"use client";
import AdminMainCard from "@/app/components/card/admin-card";
import {
  AdminOrderSummaryResponse,
  AdminProductControllerService,
  OrderSummaryResponse,
  ProductDetailsResponse,
} from "@/gen";
import { formatVND } from "@/util/currency";
import { useEffect, useState } from "react";
import { mockDetailOrderItems, OrderItem } from "./mock/order_item";
import { promises } from "dns";
import { set } from "date-fns";
import Thumbnail from "@/app/components/common/thumbnail";
import { ProductImage } from "@/app/components/common/ProductImage";

const OrderDetail = () => {
  const [order, setOrder] = useState<AdminOrderSummaryResponse>();
  // Lấy product_id từ mock -> xong rồi fetch các sản phẩm tương ứng -> trả về 1 Array product tương ứng
  const [products, setProducts] = useState<ProductDetailsResponse[]>([]);
  const fetchProduct = async (Ids: number[]) => {
    const productPromises = Ids.map((id) =>
      AdminProductControllerService.getProductById(id),
    );
    return await Promise.all(productPromises);
  };
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedOrder");
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const foundOrder = mockDetailOrderItems.find(
      (o) => o.order_id === order?.orderId,
    );
    if (foundOrder) {
      setOrderItem(foundOrder.items);

      const productIds = foundOrder.items.map((i) => i.product_id);
      fetchProduct(productIds).then(setProducts);
    }
  }, [order]);
  // Dùng State orderItem để lưu dữ liệu chi tiết đơn đặt hàng có order_id lưu trong sessionStorage
  const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
  return (
    <AdminMainCard goBack={true} title="CHI TIẾT ĐƠN HÀNG">
      {order ? (
        <div className="bg-gray grid grid-row-3 gap-4">
          {/* Thông tin khách hàng đặt */}
          <div className="w-full grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xl font-medium">Khách hàng</label>
              <input
                value={order.customerName || ""}
                disabled
                className="w-full border p-2 rounded mt-2 "
              />
            </div>
            <div>
              <label className="block text-xl font-medium">Địa chỉ</label>
              <input
                value={order.address || ""}
                disabled
                className="w-full border p-2 rounded mt-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium">
                Thời gian đặt hàng
              </label>
              <input
                value={order.createdAt || ""}
                disabled
                className="w-full border p-2 rounded mt-2 "
              />
            </div>
          </div>
          {/* Trạng thái đơn hàng - total */}
          <div className="w-ful grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-medium">
                Trạng thái đơn hàng
              </label>
              <input
                value={order.status || ""}
                disabled
                className="w-full border p-2 rounded mt-2 "
              />
            </div>
            <div className="mb-4">
              <label className="block text-xl font-medium">
                Tổng giá trị đơn hàng
              </label>
              <input
                value={formatVND(order.totalPrice) || ""}
                disabled
                className="w-full border p-2 rounded mt-2 "
              />
            </div>
          </div>
          {/* Chi tiết đơn hàng */}
          <div>
            <table className="table table-zebra w-full text-left ">
              <thead>
                <tr className="border-b text-xl text-black">
                  <th className="p-2">STT</th>
                  <th className="p-2">Sản phẩm</th>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">Số lượng</th>
                  <th className="p-2">Đơn giá</th>
                  <th className="p-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderItem.map((item, index) => {
                  const product: ProductDetailsResponse | undefined =
                    products.find((p) => p?.productId === item.product_id);
                  const unitPrice = product?.sellPrice ?? 0;
                  const total = unitPrice * item.quantity;
                  if (!product) return null;
                  return (
                    <tr key={item.order_item_id} className="border-b text-lg">
                      <td className="p-2">{index + 1}</td>
                      <td>
                        {product.image && (
                          <Thumbnail className="h-[100px] w-[100px]">
                            <ProductImage src={product.image} />
                          </Thumbnail>
                        )}
                        ;
                      </td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">x{item.quantity}</td>
                      <td className="p-2">{formatVND(unitPrice)}</td>
                      <td className="p-2">{formatVND(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>Đang tải dữ liệu ...</div>
      )}
    </AdminMainCard>
  );
};

export default OrderDetail;
