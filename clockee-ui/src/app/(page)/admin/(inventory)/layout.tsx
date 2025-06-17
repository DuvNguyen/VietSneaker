import { InventoryManagerRoute } from "@/app/components/route/protected";
import { ReactNode } from "react";

const InventoryManagerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <InventoryManagerRoute>{children}</InventoryManagerRoute>
    </>
  );
};

export default InventoryManagerLayout;
