import {
  ProductAdminRoute,
  SysAdminRoute,
} from "@/app/components/route/protected";
import { ReactNode } from "react";

const SysAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SysAdminRoute>{children}</SysAdminRoute>
    </>
  );
};

export default SysAdminLayout;
