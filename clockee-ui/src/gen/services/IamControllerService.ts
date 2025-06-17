/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateLoginRequest } from "../models/CreateLoginRequest";
import type { PageResponseUserAccessDetailsResponse } from "../models/PageResponseUserAccessDetailsResponse";
import type { SetPasswordRequest } from "../models/SetPasswordRequest";
import type { UserAccessDetailsResponse } from "../models/UserAccessDetailsResponse";
import type { UserRoleRequest } from "../models/UserRoleRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class IamControllerService {
  /**
   * Set password for user
   * @param userId
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static setPassword(
    userId: number,
    requestBody: SetPasswordRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/admin/iam/{userId}/set-password",
      path: {
        userId: userId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Add user role
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static addRole(
    requestBody: UserRoleRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/admin/iam/roles",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Remove user role
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static removeRole(
    requestBody: UserRoleRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/admin/iam/roles",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Create new login with roles like: CUSTOMER, ADMIN_PRODUCT, etc for system
   * @param requestBody
   * @returns UserAccessDetailsResponse OK
   * @throws ApiError
   */
  public static addLoginAccess(
    requestBody: CreateLoginRequest,
  ): CancelablePromise<UserAccessDetailsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/admin/iam/login",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * Change enable status of user (block user)
   * @param userId
   * @returns boolean OK
   * @throws ApiError
   */
  public static toggleUserEnableStatus(
    userId: number,
  ): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/admin/iam/{userId}/enabled",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * Get user access information for all user
   * @param page
   * @param size
   * @returns PageResponseUserAccessDetailsResponse OK
   * @throws ApiError
   */
  public static getAllAccess(
    page?: number,
    size: number = 10,
  ): CancelablePromise<PageResponseUserAccessDetailsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/iam",
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * Get user access information for specific user
   * @param userId
   * @returns UserAccessDetailsResponse OK
   * @throws ApiError
   */
  public static getUserAccess(
    userId: number,
  ): CancelablePromise<UserAccessDetailsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/iam/{userId}",
      path: {
        userId: userId,
      },
    });
  }
}
