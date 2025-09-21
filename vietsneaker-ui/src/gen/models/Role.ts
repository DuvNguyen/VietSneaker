/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from "./User";
export type Role = {
  roleId?: number;
  roleName?: Role.roleName;
  users?: Array<User>;
  authority?: string;
};
export namespace Role {
  export enum roleName {
    CUSTOMER = "CUSTOMER",
    PRODUCT_ADMIN = "PRODUCT_ADMIN",
    INVENTORY_MANAGER = "INVENTORY_MANAGER",
    SYS_ADMIN = "SYS_ADMIN",
  }
}
