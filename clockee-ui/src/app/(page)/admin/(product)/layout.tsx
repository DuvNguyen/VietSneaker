import { ProductAdminRoute } from "@/app/components/route/protected";
import { ReactNode } from "react";

const AdminProductLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ProductAdminRoute>{children}</ProductAdminRoute>
    </>
  );
};

export default AdminProductLayout;
