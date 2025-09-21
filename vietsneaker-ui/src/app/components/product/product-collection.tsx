import { ProductSummaryResponse } from "@/gen";
import React from "react";
import ProductSummaryCard, {
  ProductSummaryPreload,
} from "./product-summary-card";
const ProductCollection = ({
  products,
}: {
  products: ProductSummaryResponse[];
}) => {
  return (
    products && (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-auto">
        {products.map((product) => (
          <ProductSummaryCard key={product.productId} product={product} />
        ))}
      </div>
    )
  );
};
export const ProductCollectionPreload = ({
  size: { size = 8 } = {},
}: {
  size?: { size?: number };
}) => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-auto">
      {[...Array(size)].map((_, index) => (
        <ProductSummaryPreload key={index} />
      ))}
    </div>
  );
};

export default ProductCollection;
