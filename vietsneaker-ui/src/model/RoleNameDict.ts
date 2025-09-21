export const RoleNameDict = {
  CUSTOMER: "CUSTOMER",
  PRODUCT_ADMIN: "PRODUCT_ADMIN",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  SYS_ADMIN: "SYS_ADMIN",
} as const;

export type RolenameType = (typeof RoleNameDict)[keyof typeof RoleNameDict];
