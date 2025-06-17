/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandDTO } from "./BrandDTO";
export type AdminProductResponse = {
  productId?: number;
  name?: string;
  description?: string;
  actualPrice?: number;
  sellPrice?: number;
  type?: string;
  stock?: number;
  brand?: BrandDTO;
  isActive?: boolean;
  visible?: boolean;
  image?: string;
};
