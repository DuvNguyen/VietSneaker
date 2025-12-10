/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Supplier = {
    supplierId?: number;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    isDeleted?: boolean;
    supplierType?: Supplier.supplierType;
    zalo?: string;
    facebook?: string;
    rating?: number;
    totalTransactions?: number;
    notes?: string;
};
export namespace Supplier {
    export enum supplierType {
        PERSON = 'PERSON',
        SHOP = 'SHOP',
        WHOLESALE = 'WHOLESALE',
        CONSIGN = 'CONSIGN',
    }
}

