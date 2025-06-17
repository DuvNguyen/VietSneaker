import React from "react";
import Thumbnail from "../common/thumbnail";
import { ProductImage } from "../common/base-64-image";
import { formatVND } from "@/util/currency";
import { OrderItemSummary } from "@/gen";

const ProductItemList = ({ item }: { item: OrderItemSummary }) => {
  return (
    <>
      <Thumbnail className="size-[4rem]">
        <ProductImage data={item.image} />
      </Thumbnail>
      <div className="flex-1">
        <h3 className="text-bold font-medium mb-2">{item.name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm">Số lượng:</span>
          <div className="flex items-center">
            <span className="px-2">x{item.quantity}</span>
          </div>
        </div>
        {item.price && (
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">Giá:</span>
            <div className="flex items-center">
              <div className="text-sm">{formatVND(item.price)}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductItemList;
