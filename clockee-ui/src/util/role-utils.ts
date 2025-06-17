import { RoleName } from "@/gen/backend";
import { RoleNameDict } from "@/model/RoleNameDict";

export const roleNameDescription = (status: string) => {
  const normalized = status?.toUpperCase();
  return Object.values(RoleNameDict).find((s) => s === normalized);
};

export function getRoleNameLabel(role: string | RoleName): string {
  const roleString = String(role);
  switch (String(roleString)) {
    case String(RoleNameDict.PRODUCT_ADMIN):
    case "ROLE_" + String(RoleNameDict.PRODUCT_ADMIN):
      return "Quản lý sản phẩm";
    case String(RoleNameDict.INVENTORY_MANAGER):
    case "ROLE_" + String(RoleNameDict.INVENTORY_MANAGER):
      return "Quản lý kho";
    case String(RoleNameDict.CUSTOMER):
    case "ROLE_" + String(RoleNameDict.CUSTOMER):
      return "Khác hàng";
    case String(RoleName.SYS_ADMIN):
    case "ROLE_" + String(RoleNameDict.SYS_ADMIN):
      return "Quản lý hệ thống";
    default:
      return roleString;
    // return "Không xác định";
  }
}
