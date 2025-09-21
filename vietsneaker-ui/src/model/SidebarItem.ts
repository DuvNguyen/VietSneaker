import { RoleName } from "@/gen/backend";

export interface SidebarItem {
  title: string;
  href: string;
  subItems?: Array<SidebarItem>;
  roles?: Array<RoleName>;
}
