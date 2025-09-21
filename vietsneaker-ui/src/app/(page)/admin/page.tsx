"use client";
import { LoadingScreen } from "@/app/components/common/loading";
import { RoleName } from "@/gen/backend";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
const AdminPage = () => {
  const { containRole } = useAuth();
  const router = useRouter();

  const redirectDefaultPage = () => {
    if (containRole(RoleName.PRODUCT_ADMIN)) {
      router.push("admin/dashboard");
    } else if (containRole(RoleName.INVENTORY_MANAGER)) {
      router.push("admin/suppliers");
    } else if (containRole(RoleName.SYS_ADMIN)) {
      router.push("admin/accounts");
    } else {
      router.push("forbidden");
    }
  };
  useEffect(() => {
    redirectDefaultPage();
  }, []);
  return <LoadingScreen />;
};

export default AdminPage;
