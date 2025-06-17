/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class FinancialReportControllerService {
  /**
   * @param year
   * @returns number OK
   * @throws ApiError
   */
  public static geFinancialReport(
    year: number,
  ): CancelablePromise<Array<number>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/financial-report/by-year",
      query: {
        year: year,
      },
    });
  }
}
