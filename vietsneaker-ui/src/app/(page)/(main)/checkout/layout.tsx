"use client";

import { ProtectedRoute } from "@/app/components/route/protected";
import { UserControllerService } from "@/gen";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";
import { logger } from "@/util/logger";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { selectedItems } = useCart();
  const router = useRouter();

  const { user } = useAuth();
  useEffect(() => {
    const refuteUserNotVerfied = async () => {
      if (user === null || !user.verified) {
        // Retry validate in server
        try {
          const resp = await UserControllerService.currentUserDetails();
          if (!resp.verified) {
            toast.warn("Bạn cần xác thực email để thực hiện đặt hàng");
            redirect("/me");
          }
        } catch (error) {
          logger.error(error);
        }
      }
    };
    refuteUserNotVerfied();
  }, [user]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      router.push("/cart");
    }
  }, []);

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
