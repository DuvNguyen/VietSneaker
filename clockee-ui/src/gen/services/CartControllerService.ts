/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CartDetailsResponse } from "../models/CartDetailsResponse";
import type { CartItemRequest } from "../models/CartItemRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class CartControllerService {
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static updateItem(
    requestBody: CartItemRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/user/cart/items",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static addItem(
    requestBody: CartItemRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/user/cart/items",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @returns CartDetailsResponse OK
   * @throws ApiError
   */
  public static getAllItems(): CancelablePromise<CartDetailsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/user/cart",
    });
  }
  /**
   * @param productId
   * @returns any OK
   * @throws ApiError
   */
  public static removeItem(
    productId: number,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/user/cart/items/{productId}",
      path: {
        productId: productId,
      },
    });
  }
}
