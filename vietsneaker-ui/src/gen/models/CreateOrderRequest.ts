/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CartItemRequest } from "./CartItemRequest";
export type CreateOrderRequest = {
  phone?: string;
  address: string;
  items?: Array<CartItemRequest>;
};
