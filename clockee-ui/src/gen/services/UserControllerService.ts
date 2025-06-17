/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangePasswordRequest } from "../models/ChangePasswordRequest";
import type { CurrentUserDetails } from "../models/CurrentUserDetails";
import type { UpdateUserDetailsRequest } from "../models/UpdateUserDetailsRequest";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UserControllerService {
  /**
   * @returns CurrentUserDetails OK
   * @throws ApiError
   */
  public static currentUserDetails(): CancelablePromise<CurrentUserDetails> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/me",
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static updateUserDetails(
    requestBody: UpdateUserDetailsRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/me",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static resendVerificationEmail(): CancelablePromise<
    Record<string, any>
  > {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/me/resend-verification",
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static changePassword(
    requestBody: ChangePasswordRequest,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/me/change-password",
      body: requestBody,
      mediaType: "application/json",
    });
  }
}
