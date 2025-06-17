import AdminMainCard from "@/app/components/card/admin-card";
import React from "react";
import CreateProductForm from "./components/create-product-form";

/**
 * Page for add new product for admin
 */
const NewProductPage = ({}) => {
  return (
    <>
      <AdminMainCard title="Sản phẩm mới" goBack={true}>
        <CreateProductForm />
      </AdminMainCard>
    </>
  );
};

export default NewProductPage;
