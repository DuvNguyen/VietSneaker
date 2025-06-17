/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageBrandDTO } from "../models/PageBrandDTO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class BrandControllerService {
  /**
   * @param page
   * @param size
   * @param name
   * @returns PageBrandDTO OK
   * @throws ApiError
   */
  public static getAllBrands1(
    page?: number,
    size: number = 10,
    name: string = "",
  ): CancelablePromise<PageBrandDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/brands",
      query: {
        page: page,
        size: size,
        name: name,
      },
    });
  }
  /**
   * @param size
   * @returns any OK
   * @throws ApiError
   */
  public static getPopularBrand(
    size: number = 10,
  ): CancelablePromise<Array<any>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/brands/popular",
      query: {
        size: size,
      },
    });
  }
}
