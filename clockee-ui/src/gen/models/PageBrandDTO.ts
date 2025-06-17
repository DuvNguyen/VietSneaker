/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandDTO } from "./BrandDTO";
import type { PageableObject } from "./PageableObject";
import type { SortObject } from "./SortObject";
export type PageBrandDTO = {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  size?: number;
  content?: Array<BrandDTO>;
  number?: number;
  sort?: SortObject;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};
