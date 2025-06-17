/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseUserDetailResponse } from "../models/PageResponseUserDetailResponse";
import type { Role } from "../models/Role";
import type { UserDetailResponse } from "../models/UserDetailResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AdminUserControllerService {
  /**
   * @param id
   * @param isDeleted
   * @returns string OK
   * @throws ApiError
   */
  public static updateUserEnableStatus(
    id: number,
    isDeleted: boolean,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/admin/users/{id}/enabled",
      path: {
        id: id,
      },
      query: {
        isDeleted: isDeleted,
      },
    });
  }
  /**
   * @param page
   * @param size
   * @returns PageResponseUserDetailResponse OK
   * @throws ApiError
   */
  public static getAllUsers(
    page?: number,
    size: number = 10,
  ): CancelablePromise<PageResponseUserDetailResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/users",
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id
   * @returns UserDetailResponse OK
   * @throws ApiError
   */
  public static getUserById(id: number): CancelablePromise<UserDetailResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/users/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id
   * @returns Role OK
   * @throws ApiError
   */
  public static getRoleById(id: number): CancelablePromise<Array<Role>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/users/{id}/roles",
      path: {
        id: id,
      },
    });
  }
}
