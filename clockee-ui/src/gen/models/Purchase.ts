/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseItem } from "./PurchaseItem";
import type { User } from "./User";
export type Purchase = {
  purchaseId?: number;
  items?: Array<PurchaseItem>;
  createdAt?: string;
  totalPrice?: number;
  createdBy?: User;
};
