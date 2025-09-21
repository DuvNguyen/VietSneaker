/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemSummary } from "./OrderItemSummary";
export type OrderSummaryResponse = {
  orderId?: number;
  createdAt?: string;
  orderItems?: Array<OrderItemSummary>;
  totalPrice?: number;
  status?: string;
  address?: string;
};
