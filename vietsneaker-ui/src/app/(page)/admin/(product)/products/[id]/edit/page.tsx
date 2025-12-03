"use client";
import React, { useEffect, useState } from "react";
import AdminMainCard from "@/app/components/card/admin-card";
import { AdminProductControllerService, AdminProductResponse } from "@/gen";
import { logger } from "@/util/logger";
import EditProductForm from "./components/edit-product-form";

function EditProductPage() {
  const [product, setProduct] = useState<AdminProductResponse>();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await AdminProductControllerService.getProductById(1);
        setProduct(res);
      } catch (error) {
        logger.warn(error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <AdminMainCard title="CHI TIẾT SẢN PHẨM" goBack={true}>
      {product && <EditProductForm model={product} />}
    </AdminMainCard>
  );
}

export default EditProductPage;
