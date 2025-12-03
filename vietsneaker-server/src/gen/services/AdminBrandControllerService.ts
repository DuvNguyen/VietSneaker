/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandDTO } from '../models/BrandDTO';
import type { PageBrandDTO } from '../models/PageBrandDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminBrandControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns BrandDTO OK
     * @throws ApiError
     */
    public static updateBrand(
        id: number,
        requestBody: BrandDTO,
    ): CancelablePromise<BrandDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/brands/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteBrand(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/brands/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @param name
     * @returns PageBrandDTO OK
     * @throws ApiError
     */
    public static getAllBrands(
        page?: number,
        size: number = 10,
        name: string = '',
    ): CancelablePromise<PageBrandDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/brands',
            query: {
                'page': page,
                'size': size,
                'name': name,
            },
        });
    }
    /**
     * @param requestBody
     * @returns BrandDTO OK
     * @throws ApiError
     */
    public static addBrand(
        requestBody: BrandDTO,
    ): CancelablePromise<BrandDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/brands',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
