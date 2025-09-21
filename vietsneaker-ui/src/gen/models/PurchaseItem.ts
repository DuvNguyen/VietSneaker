/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from "./Product";
import type { Purchase } from "./Purchase";
import type { Supplier } from "./Supplier";
export type PurchaseItem = {
  purchaseItemId?: number;
  product?: Product;
  supplier?: Supplier;
  price?: number;
  quantity?: number;
  createdAt?: string;
  purchase?: Purchase;
  totalPrice?: number;
};
