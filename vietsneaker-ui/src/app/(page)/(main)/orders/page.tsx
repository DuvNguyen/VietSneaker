"use client";
import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { OrderControllerService, OrderSummaryResponse } from "@/gen";
import { OrderStatus as OrderStatusType } from "@/gen/backend";
import { OrderStatusDict } from "@/model/OrderStatus";
import { logger } from "@/util/logger";
import { getOrderStatusLabel } from "@/util/order-utils";
import OrderTab from "./components/order-tabs";
import { ProtectedRoute } from "@/app/components/route/protected";

const OrderHistoryPage = () => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatusType>();
  const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);
  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value as OrderStatusType);
  };

  const fetchOrderByStatus = async (status: OrderStatusType | undefined) => {
    try {
      const userOrders = await OrderControllerService.getAllOrders(status);
      setOrders(userOrders);
    } catch (error) {
      logger.warn(error);
    }
  };
  const handleOrdersChange = (updatedOrders: OrderSummaryResponse[]) => {
    setOrders(updatedOrders);
  };
  useEffect(() => {
    fetchOrderByStatus(currentStatus);
  }, [currentStatus]);
  return (
    <>
      <ProtectedRoute>
        <div className="container mx-auto p-10">
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
            <OrderTab orders={orders} onOrdersChange={handleOrdersChange} />

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
                  <OrderTab
                    key={status}
                    orders={orders}
                    onOrdersChange={handleOrdersChange}
                  />
                </Fragment>
              ))
            }
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default OrderHistoryPage;