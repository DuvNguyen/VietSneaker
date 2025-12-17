/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageProductSummaryResponse } from '../models/PageProductSummaryResponse';
import type { PageResponseProductSummaryResponse } from '../models/PageResponseProductSummaryResponse';
import type { ProductDetailsResponse } from '../models/ProductDetailsResponse';
import type { ProductSummaryResponse } from '../models/ProductSummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProductControllerService {
    /**
     * @param page
     * @param size
     * @param name
     * @param type
     * @param shoeSize
     * @param maxPrice
     * @param brandId
     * @param sortBy
     * @returns PageProductSummaryResponse OK
     * @throws ApiError
     */
    public static getAllProducts1(
        page?: number,
        size: number = 10,
        name: string = '',
        type: string = '',
        shoeSize: string = '',
        maxPrice?: number,
        brandId?: number,
        sortBy: string = '',
    ): CancelablePromise<PageProductSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/products',
            query: {
                'page': page,
                'size': size,
                'name': name,
                'type': type,
                'shoeSize': shoeSize,
                'maxPrice': maxPrice,
                'brandId': brandId,
                'sortBy': sortBy,
            },
        });
    }
    /**
     * @param id
     * @returns ProductDetailsResponse OK
     * @throws ApiError
     */
    public static getProductById1(
        id: number,
    ): CancelablePromise<ProductDetailsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/products/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns PageResponseProductSummaryResponse OK
     * @throws ApiError
     */
    public static getLatestProducts(
        page?: number,
        size: number = 10,
    ): CancelablePromise<PageResponseProductSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/products/latest',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ProductSummaryResponse OK
     * @throws ApiError
     */
    public static getBestSellingProducts(
        page?: number,
        size: number = 10,
    ): CancelablePromise<Array<ProductSummaryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/products/best-selling',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
}
