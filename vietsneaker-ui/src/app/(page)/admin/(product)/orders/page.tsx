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
        page - 1,
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
    <AdminMainCard title="Danh sách đơn hàng" goBack={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto p-10 overflow-x-auto">
          <div className="tabs tabs-lift tabs-xl">
            {/* All status order */}
            <input
              type="radio"
              name="status"
              className="tab"
              aria-label="Tất cả"
              onChange={() => {
                setCurrentStatus(undefined);
              }}
              defaultChecked
            />
            <AdminOrderTable
              orders={pageInfo.content || []}
              onOrdersChange={handleOrdersChange}
            />

            {
              // Filter for each order status
              Object.entries(OrderStatusDict).map(([status, value]) => (
                <Fragment key={status}>
                  <input
                    type="radio"
                    name="status"
                    className="tab"
                    value={value}
                    aria-label={getOrderStatusLabel(status as OrderStatusType)}
                    onChange={handleStatusChange}
                  />
                  <AdminOrderTable
                    key={status}
                    orders={pageInfo.content || []}
                    onOrdersChange={handleOrdersChange}
                  />
                </Fragment>
              ))
            }
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <PageController setPage={setPage} page={pageInfo} />
      </div>
    </AdminMainCard>
  );
};

export default OrderSummaryPage;
