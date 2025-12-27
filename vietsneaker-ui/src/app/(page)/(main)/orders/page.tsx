"use client";

import { OrderStatusDict } from "@/model/OrderStatus";
import { ChangeEvent, useState } from "react";
import { OrderStatus as OrderStatusType } from "@/gen/backend";
import AdminMainCard from "@/app/components/card/admin-card";
import { getOrderStatusLabel } from "@/util/order-utils";
import {
  AdminOrderControllerService,
  AdminOrderSummaryResponse,
  PageResponseAdminOrderSummaryResponse,
} from "@/gen";
import PageController from "@/app/components/common/page-controller";
import { usePage } from "@/lib/hooks/use-page-search";
import Link from "next/link"; 

const OrderSummaryPage = () => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatusType>();

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value as OrderStatusType);
  };

  const fetchOrderByStatus = async () => {
    try {
      const resp = await AdminOrderControllerService.getOrderSummary(
        currentStatus,
        page - 1
      );
      if (resp) setPageInfo(resp);
      return resp;
    } catch (error) {
      console.warn(error);
    }
  };

  const { pageInfo, setPage, page, setPageInfo } =
    usePage<PageResponseAdminOrderSummaryResponse>({
      fetchData: fetchOrderByStatus,
      dependencies: [currentStatus],
    });

  // 🛠 Helper format tiền tệ
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // 🎨 Helper màu sắc badge trạng thái
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "DELIVERING": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AdminMainCard title="DANH SÁCH ĐƠN HÀNG" goBack={false}>
      {/* Container chính: Nền trắng, bóng đổ, bo góc */}
      <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">
        
        {/* 🧭 Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center text-sm font-semibold text-gray-700 mr-2 uppercase tracking-wide h-9">
              <i className="fa fa-filter mr-2"></i> Lọc theo:
            </span>

            {/* Tab Tất cả */}
            <label className="cursor-pointer select-none">
              <input
                type="radio"
                name="status"
                className="hidden"
                onChange={() => setCurrentStatus(undefined)}
                checked={currentStatus === undefined}
              />
              <div
                className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  currentStatus === undefined
                    ? "bg-[#e20000] text-white border-[#e20000] shadow-md"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tất cả
              </div>
            </label>

            {/* Các tab trạng thái */}
            {Object.entries(OrderStatusDict).map(([status, value]) => {
              const isActive = currentStatus === value;
              return (
                <label key={status} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    value={value}
                    onChange={handleStatusChange}
                    checked={isActive}
                  />
                  <div
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      isActive
                        ? "bg-[#e20000] text-white border-[#e20000] shadow-md"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {getOrderStatusLabel(status as OrderStatusType)}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 📋 TABLE Dữ Liệu */}
        <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full border-collapse table-auto text-left text-[14px]">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-4 border-b border-gray-300 font-semibold w-[10%]">Mã đơn</th>
                <th className="p-4 border-b border-gray-300 font-semibold">Khách hàng</th>
                <th className="p-4 border-b border-gray-300 font-semibold">Ngày đặt</th>
                <th className="p-4 border-b border-gray-300 font-semibold text-right">Tổng tiền</th>
                <th className="p-4 border-b border-gray-300 font-semibold text-center">Trạng thái</th>
                <th className="p-4 border-b border-gray-300 font-semibold text-center w-[10%]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageInfo?.content && pageInfo.content.length > 0 ? (
                pageInfo.content.map((order: AdminOrderSummaryResponse) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                    {/* ✅ Mã đơn: orderId */}
                    <td className="p-4 font-medium text-gray-900">#{order.orderId}</td>
                    
                    {/* ✅ Khách hàng: customerName & phone */}
                    <td className="p-4 text-gray-600">
                        <div className="font-medium text-gray-800">{order.customerName || "Khách lẻ"}</div>
                        <div className="text-xs text-gray-500">{order.phone || "Không có SĐT"}</div>
                    </td>

                    {/* ✅ Ngày đặt: createdAt */}
                    <td className="p-4 text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "-"}
                    </td>

                    {/* ✅ Tổng tiền: totalPrice */}
                    <td className="p-4 text-right font-bold text-[#e20000]">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    {/* ✅ Trạng thái: status */}
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(order.status)}`}>
                        {getOrderStatusLabel(order.status as OrderStatusType)}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <Link href={`/admin/order/${order.orderId}`}>
                        <button className="text-gray-500 hover:text-[#e20000] transition-colors" title="Xem chi tiết">
                          <i className="fa fa-eye text-lg"></i>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 italic bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                        <i className="fa fa-box-open text-4xl mb-3 text-gray-300"></i>
                        <span>Không có đơn hàng nào ở trạng thái này.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Phân trang */}
        <div className="w-full mt-8 flex justify-center items-center">
          <PageController setPage={setPage} page={pageInfo} />
        </div>
      </div>
    </AdminMainCard>
  );
};

export default OrderSummaryPage;