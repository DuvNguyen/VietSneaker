import { RoleName } from "@/gen/backend";
import { SidebarItem } from "@/model/SidebarItem";

export const adminMenuItems: Array<SidebarItem> = [
  {
    title: "Sản phẩm",
    href: "#",
    subItems: [
      {
        title: "Danh sách đơn hàng",
        href: "/admin/orders/",
        roles: [RoleName.PRODUCT_ADMIN],
      },
      {
        title: "Người dùng",
        href: "/admin/users/",
        roles: [RoleName.PRODUCT_ADMIN],
      },
      {
        title: "Sản phẩm",
        href: "/admin/products",
        roles: [RoleName.PRODUCT_ADMIN],
      },
      {
        title: "Thương hiệu",
        href: "/admin/brands",
        roles: [RoleName.PRODUCT_ADMIN],
      },
      {
        title: "Thống kê",
        href: "/admin/dashboard",
        roles: [RoleName.PRODUCT_ADMIN],
      },
    ],
  },
  {
    title: "Kho hàng",
    href: "#",
    subItems: [
      {
        title: "Nhà cung cấp",
        href: "/admin/suppliers/",
        roles: [RoleName.INVENTORY_MANAGER],
      },
      {
        title: "Nhập hàng",
        href: "/admin/purchases/",
        roles: [RoleName.INVENTORY_MANAGER],
      },
    ],
  },
  {
    title: "Hệ thống",
    href: "#",
    subItems: [
      {
        title: "Quản trị cộng tác viên",
        href: "/admin/accounts/",
        roles: [RoleName.SYS_ADMIN],
      },
      {
        title: "Đăng xuất",
        href: "/logout",
        subItems: [],
      },
    ],
  },
];
