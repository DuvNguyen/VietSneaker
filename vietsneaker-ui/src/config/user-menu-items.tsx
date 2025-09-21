import { UserMenuItem } from "@/model/UserMenuItem";
import { User, ShoppingBag, Key, LogOut } from "lucide-react";

export const userMenuItems: UserMenuItem[] = [
  {
    label: "Thông tin cá nhân",
    href: "/me",
    icon: User,
  },
  {
    label: "Đơn hàng của tôi",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "Đổi mật khẩu",
    href: "/me/change-password",
    icon: Key,
  },
  {
    label: "Đăng xuất",
    href: "/logout",
    icon: LogOut,
  },
];
