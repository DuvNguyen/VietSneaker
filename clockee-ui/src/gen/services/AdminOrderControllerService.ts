/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MonthlyRevenueDTO } from "../models/MonthlyRevenueDTO";
import type { OrderDTO } from "../models/OrderDTO";
import type { PageResponseAdminOrderSummaryResponse } from "../models/PageResponseAdminOrderSummaryResponse";
import type { UpdateOrderStatusRequest } from "../models/UpdateOrderStatusRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminOrderControllerService {
  /**
   * @param orderId
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static updateOrderStatus(
    orderId: number,
    requestBody: UpdateOrderStatusRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/admin/order/{orderId}",
      path: {
        orderId: orderId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param status
   * @param page
   * @param size
   * @returns PageResponseAdminOrderSummaryResponse OK
   * @throws ApiError
   */
  public static getOrderSummary(
    status?:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "RETURNING"
      | "RETURNED"
      | "CANCELLED"
      | "COMPLETED",
    page?: number,
    size: number = 10,
  ): CancelablePromise<PageResponseAdminOrderSummaryResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/order",
      query: {
        status: status,
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param year
   * @returns OrderDTO OK
   * @throws ApiError
   */
  public static getYearlyOrder(year: number): CancelablePromise<OrderDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/order/order-by-year",
      query: {
        year: year,
      },
    });
  }
  /**
   * @returns MonthlyRevenueDTO OK
   * @throws ApiError
   */
  public static getMonthlyRevenue(): CancelablePromise<
    Array<MonthlyRevenueDTO>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/order/monthly",
    });
  }
  /**
   * @param year
   * @returns number OK
   * @throws ApiError
   */
  public static getMonthlyRevenueInYear(
    year: number,
  ): CancelablePromise<Array<number>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/order/by-year",
      query: {
        year: year,
      },
    });
  }
  /**
   * @param year
   * @param month
   * @returns number OK
   * @throws ApiError
   */
  public static getRevenueByMonthAndYear(
    year: number,
    month: number,
  ): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/order/by-month-year",
      query: {
        year: year,
        month: month,
      },
    });
  }
}
