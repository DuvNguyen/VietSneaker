/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminProductRequest } from "../models/AdminProductRequest";
import type { AdminProductResponse } from "../models/AdminProductResponse";
import type { PageAdminProductResponse } from "../models/PageAdminProductResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminProductControllerService {
  /**
   * @param id
   * @returns AdminProductResponse OK
   * @throws ApiError
   */
  public static getProductById(
    id: number,
  ): CancelablePromise<AdminProductResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/products/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id
   * @param requestBody
   * @returns AdminProductResponse OK
   * @throws ApiError
   */
  public static updateProduct(
    id: number,
    requestBody: AdminProductRequest,
  ): CancelablePromise<AdminProductResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/admin/products/{id}",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteProduct(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/admin/products/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param page
   * @param size
   * @param name
   * @param sortBy
   * @param direction
   * @returns PageAdminProductResponse OK
   * @throws ApiError
   */
  public static getAllProducts(
    page?: number,
    size: number = 10,
    name: string = "",
    sortBy?: string,
    direction?: string,
  ): CancelablePromise<PageAdminProductResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/products",
      query: {
        page: page,
        size: size,
        name: name,
        sortBy: sortBy,
        direction: direction,
      },
    });
  }
  /**
   * @param requestBody
   * @returns AdminProductResponse OK
   * @throws ApiError
   */
  public static createProduct(
    requestBody: AdminProductRequest,
  ): CancelablePromise<AdminProductResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/admin/products",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param productId
   * @param formData
   * @returns any OK
   * @throws ApiError
   */
  public static uploadProductImage(
    productId: number,
    formData?: {
      /**
       * Image file to upload
       */
      file: Blob;
    },
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/admin/products/image/{productId}",
      path: {
        productId: productId,
      },
      formData: formData,
      mediaType: "multipart/form-data",
    });
  }
}
