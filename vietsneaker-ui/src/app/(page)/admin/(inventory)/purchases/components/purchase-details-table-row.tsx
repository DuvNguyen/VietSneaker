/**
 * Display purchase details information as an row table for each item
 * View only not modify any information
 */

"use client";
import React, { useState } from "react";
import Thumbnail from "@/app/components/common/thumbnail";
import { ProductImage } from "@/app/components/common/base-64-image";
import { formatVND } from "@/util/currency";
import { PurchaseItemDetails } from "@/gen";

type PurchaseTableRowProps = {
  item: PurchaseItemDetails;
};

const PurchaseDetailsTableRow = ({ item }: PurchaseTableRowProps) => {
  return (
    <tr>
      <td>
        <Thumbnail className="size-[4rem]">
          <ProductImage data={item.productImage} />
        </Thumbnail>
      </td>
      <td>{item.productName}</td>
      <td>{item.supplierName}</td>
      <td>{item.quantity}</td>
      <td>{formatVND(item.price)}</td>
      <td className="hover:bg-gray-200"></td>
    </tr>
  );
};
export default PurchaseDetailsTableRow;
