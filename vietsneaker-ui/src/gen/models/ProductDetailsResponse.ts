/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandDTO } from "./BrandDTO";
export type ProductDetailsResponse = {
  productId?: number;
  name?: string;
  image?: string;
  sellPrice?: number;
  description?: string;
  brand?: BrandDTO;
  type?: string;
  shoeSize?: String; // add shoeSize
  isActive?: boolean;
  stock?: number;
};
