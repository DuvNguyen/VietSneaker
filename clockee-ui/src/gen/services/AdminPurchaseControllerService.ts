/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePurchaseRequest } from "../models/CreatePurchaseRequest";
import type { PageResponsePurchaseSummary } from "../models/PageResponsePurchaseSummary";
import type { PurchaseDetails } from "../models/PurchaseDetails";
import type { PurchaseResponse } from "../models/PurchaseResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminPurchaseControllerService {
  /**
   * @param page
   * @param size
   * @param startDate
   * @param endDate
   * @returns PageResponsePurchaseSummary OK
   * @throws ApiError
   */
  public static getPurchaseHistory(
    page?: number,
    size: number = 10,
    startDate?: string,
    endDate?: string,
  ): CancelablePromise<PageResponsePurchaseSummary> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/purchase",
      query: {
        page: page,
        size: size,
        startDate: startDate,
        endDate: endDate,
      },
    });
  }
  /**
   * @param requestBody
   * @returns PurchaseResponse OK
   * @throws ApiError
   */
  public static addPurchase(
    requestBody: CreatePurchaseRequest,
  ): CancelablePromise<PurchaseResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/purchase",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Get purchase details
   * Show a list of item assosiate with purchase
   * @param purchaseId
   * @returns PurchaseDetails OK
   * @throws ApiError
   */
  public static getPurchaseDetails(
    purchaseId: number,
  ): CancelablePromise<PurchaseDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/purchase/purchase/{purchaseId}",
      path: {
        purchaseId: purchaseId,
      },
    });
  }
}
