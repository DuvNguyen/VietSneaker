/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
import type { SupplierDTO } from './SupplierDTO';
export type PageSupplierDTO = {
    totalElements?: number;
    totalPages?: number;
    pageable?: PageableObject;
    size?: number;
    content?: Array<SupplierDTO>;
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
};

