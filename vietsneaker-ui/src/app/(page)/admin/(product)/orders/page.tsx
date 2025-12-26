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
// 👇 IMPORT COMPONENT BẢNG ĐÃ CÓ NÚT BẤM
import AdminOrderTable from "./components/admin-order-table"; 

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

  // Hàm này sẽ được gọi khi AdminOrderTable cập nhật trạng thái đơn hàng thành công
  function handleOrdersChange(newOrders: AdminOrderSummaryResponse[]): void {
    setPageInfo({
      ...pageInfo,
      content: newOrders,
    });
  }

  return (
    <AdminMainCard title="DANH SÁCH ĐƠN HÀNG" goBack={false}>
      {/* Wrapper chính */}
      <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">
        
        {/* 🛠️ Bộ lọc trạng thái */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center text-sm font-semibold text-gray-700 mr-2 uppercase h-9">
              <i className="fa fa-filter mr-2"></i> Trạng thái:
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

            {/* Các tab trạng thái khác */}
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

        <AdminOrderTable 
            orders={pageInfo.content || []} 
            onOrdersChange={handleOrdersChange} 
        />

        {/* 📄 Phân trang */}
        <div className="w-full mt-8 flex justify-center items-center">
          <PageController setPage={setPage} page={pageInfo} />
        </div>
      </div>
    </AdminMainCard>
  );
};

export default OrderSummaryPage;