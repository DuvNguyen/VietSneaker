"use client";
import { OrderStatusDict } from "@/model/OrderStatus";
import { ChangeEvent, Fragment, useState } from "react";
import { OrderStatus as OrderStatusType } from "@/gen/backend";
import AdminMainCard from "@/app/components/card/admin-card";
import { getOrderStatusLabel } from "@/util/order-utils";
import {
  AdminOrderControllerService,
  AdminOrderSummaryResponse,
  PageResponseAdminOrderSummaryResponse,
} from "@/gen";
import PageController from "@/app/components/common/page-controller";
import AdminOrderTable from "./components/admin-order-table";
import { usePage } from "@/lib/hooks/use-page-search";

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
      if (pageInfo) setPageInfo(resp);
      return pageInfo;
    } catch (error) {
      console.warn(error);
    }
  };

  const { pageInfo, setPage, page, setPageInfo } =
    usePage<PageResponseAdminOrderSummaryResponse>({
      fetchData: fetchOrderByStatus,
      dependencies: [currentStatus],
    });

  function handleOrdersChange(newOrders: AdminOrderSummaryResponse[]): void {
    setPageInfo({
      ...pageInfo,
      content: newOrders,
    });
  }

  return (
    <AdminMainCard title="DANH SÁCH ĐƠN HÀNG" goBack={false}>
      <div className="w-full min-h-screen flex flex-col items-center bg-white px-10 py-8">
        {/* 🧭 Tabs hiển thị trạng thái đơn hàng */}
        <div className="w-full flex flex-wrap justify-center gap-3 mb-6">
          {/* Tab “Tất cả” */}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="status"
              className="hidden"
              onChange={() => setCurrentStatus(undefined)}
              defaultChecked
            />
            <div
              className={`px-5 py-2 text-sm font-medium rounded-full border ${
                currentStatus === undefined
                  ? "bg-[#e20000] text-white border-[#e20000]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              Tất cả
            </div>
          </label>

          {/* Các tab trạng thái khác */}
          {Object.entries(OrderStatusDict).map(([status, value]) => {
            const isActive = currentStatus === value;
            return (
              <label key={status} className="cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  className="hidden"
                  value={value}
                  onChange={handleStatusChange}
                />
                <div
                  className={`px-5 py-2 text-sm font-medium rounded-full border ${
                    isActive
                      ? "bg-[#e20000] text-white border-[#e20000]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  } transition-colors duration-200`}
                >
                  {getOrderStatusLabel(status as OrderStatusType)}
                </div>
              </label>
            );
          })}
        </div>

        {/* 🧾 Giữ nguyên cấu trúc gốc — logic cũ hoạt động */}
        <div className="container mx-auto p-10 overflow-x-auto">
          <div className="tabs tabs-lift tabs-xl">
            {/* Tab “Tất cả” */}
            <input
              type="radio"
              name="status-table"
              className="tab hidden"
              aria-label="Tất cả"
              defaultChecked
            />
            <AdminOrderTable
              orders={pageInfo.content || []}
              onOrdersChange={handleOrdersChange}
            />

            {/* Các tab trạng thái khác */}
            {Object.entries(OrderStatusDict).map(([status, value]) => (
              <Fragment key={status}>
                <input
                  type="radio"
                  name="status-table"
                  className="tab hidden"
                  value={value}
                  aria-label={getOrderStatusLabel(status as OrderStatusType)}
                />
                <AdminOrderTable
                  key={status}
                  orders={pageInfo.content || []}
                  onOrdersChange={handleOrdersChange}
                />
              </Fragment>
            ))}
          </div>
        </div>

        {/* 📄 Bộ phân trang */}
        <div className="flex justify-center mt-6">
          <PageController setPage={setPage} page={pageInfo} />
        </div>
      </div>
    </AdminMainCard>
  );
};

export default OrderSummaryPage;
