/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Brand } from './Brand';
export type Product = {
    productId?: number;
    name?: string;
    description?: string;
    imageUrl?: string;
    actualPrice?: number;
    sellPrice?: number;
    type?: string;
    shoeSize?: string;
    stock?: number;
    brand?: Brand;
    isActive?: boolean;
    visible?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
};

