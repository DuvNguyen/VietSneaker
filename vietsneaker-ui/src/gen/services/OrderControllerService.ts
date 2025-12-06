/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { OrderSummaryResponse } from '../models/OrderSummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderControllerService {
    /**
     * @param status
     * @returns OrderSummaryResponse OK
     * @throws ApiError
     */
    public static getAllOrders(
        status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'RETURNING' | 'RETURNED' | 'CANCELLED' | 'COMPLETED',
    ): CancelablePromise<Array<OrderSummaryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/order',
            query: {
                'status': status,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static createOrder(
        requestBody: CreateOrderRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/order',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param orderId
     * @returns string OK
     * @throws ApiError
     */
    public static cancelOrder(
        orderId: number,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/order/{orderId}/cancel',
            path: {
                'orderId': orderId,
            },
        });
    }
}
