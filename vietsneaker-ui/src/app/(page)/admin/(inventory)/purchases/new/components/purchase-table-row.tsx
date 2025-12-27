"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Thumbnail from "@/app/components/common/thumbnail";
import { ProductImage } from "@/app/components/common/ProductImage";
import { PurchaseItemDetails } from "./model";
import EditPurchaseItemModal from "./edit-purchase-item-modal";
import { formatVND } from "@/util/currency";

type PurchaseTableRowProps = {
  item: PurchaseItemDetails;
  onDelete: (item: PurchaseItemDetails) => void;
  onChange: (
    oldItem: PurchaseItemDetails,
    newItem: PurchaseItemDetails,
  ) => void;
};

const PurchaseTableRow = ({
  item,
  onDelete,
  onChange,
}: PurchaseTableRowProps) => {
  const handleDelete = async () => {
    try {
      onDelete(item);
      toast("Xóa thành công");
    } catch (e) {
      toast(e as string);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleChange = async (newItemValue: PurchaseItemDetails) => {
    onChange(item, newItemValue);
  };

  return (
    <>
      <tr className="whitespace-nowrap text-center">
        <td>
          <Thumbnail className="size-[4rem]">
            <ProductImage src={item.productImage} />
          </Thumbnail>
        </td>
        <td>{item.productName}</td>
        <td>{item.supplierName}</td>
        <td>{item.quantity}</td>
        <td>{formatVND(item.price)}</td>
        <td
          onClick={() => {
            setIsEditModalOpen(true);
          }}
          className={`hover:bg-gray-200`}
        >
          {/* Action edit */}
          <i className="fa fa-edit cursor-pointer"></i>
        </td>
        <td onClick={handleDelete} className={`hover:bg-gray-200`}>
          {/* Action delete */}
          <i className="fa fa-trash cursor-pointer"></i>
        </td>

        <EditPurchaseItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          handleAddItem={handleChange}
          model={item}
        />
      </tr>
    </>
  );
};
export default PurchaseTableRow;
