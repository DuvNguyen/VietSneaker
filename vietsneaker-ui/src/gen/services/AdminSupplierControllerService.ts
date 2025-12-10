/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageSupplierDTO } from '../models/PageSupplierDTO';
import type { SupplierDTO } from '../models/SupplierDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSupplierControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns SupplierDTO OK
     * @throws ApiError
     */
    public static updateSupplier(
        id: number,
        requestBody: SupplierDTO,
    ): CancelablePromise<SupplierDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/suppliers/{id}',
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
    public static deleteSupplier(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/suppliers/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @param name
     * @returns PageSupplierDTO OK
     * @throws ApiError
     */
    public static getAllSuppliers(
        page?: number,
        size: number = 10,
        name: string = '',
    ): CancelablePromise<PageSupplierDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/suppliers',
            query: {
                'page': page,
                'size': size,
                'name': name,
            },
        });
    }
    /**
     * @param requestBody
     * @returns SupplierDTO OK
     * @throws ApiError
     */
    public static addSupplier(
        requestBody: SupplierDTO,
    ): CancelablePromise<SupplierDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/suppliers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
