/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SupplierDTO = {
    supplierId?: number;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    supplierType?: SupplierDTO.supplierType;
    zalo?: string;
    facebook?: string;
    rating?: number;
    totalTransactions?: number;
    notes?: string;
};
export namespace SupplierDTO {
    export enum supplierType {
        PERSON = 'PERSON',
        SHOP = 'SHOP',
        WHOLESALE = 'WHOLESALE',
        CONSIGN = 'CONSIGN',
    }
}

