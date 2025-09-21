"use client";
import AdminMainCard from "@/app/components/card/admin-card";
import React, { MouseEvent, useState } from "react";
import AddPurchaseItemModal from "./components/add-purchase-item-modal";
import {
  AdminPurchaseControllerService,
  CreatePurchaseRequest,
  PurchaseItemRequest,
} from "@/gen";
import DataTable from "@/app/components/common/data-table";
import PurchaseTableRow from "./components/purchase-table-row";
import { PurchaseItemDetails } from "./components/model";
import { logger } from "@/util/logger";
import { useRouter } from "next/navigation";

/*
 * Store information about product and supplier that purchase for product
 * And details information for human readable supplier details and products details
 * in purchase item information
 */
type PurchaseDetails = Omit<CreatePurchaseRequest, "items"> & {
  items: Array<PurchaseItemDetails>;
};

const CreatePurchasePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(true);
  const router = useRouter();
  const [purchase, setPurchase] = useState<PurchaseDetails>({
    items: [],
  });
  /**
   * Add new purchase or update quantity and other information if exists before.
   */
  const handleAddItem = (item: PurchaseItemDetails) => {
    // Add new purchase item
    setPurchase((p) => {
      const updatedItem = p.items.map((existsItem) => {
        if (
          existsItem.productId === item.productId &&
          existsItem.supplierId === item.supplierId
        ) {
          return {
            ...item,
            quantity: Number(existsItem.quantity) + Number(item.quantity),
          };
        } else {
          return existsItem;
        }
      });

      const newItemExists = p.items.some(
        (i) =>
          i.productId === item.productId && i.supplierId === item.supplierId,
      );
      return {
        ...p,
        items: newItemExists ? updatedItem : [...updatedItem, item],
      };
    });
  };
  const handleRemoveItem = (item: PurchaseItemDetails): void => {
    // Add new purchase item
    setPurchase((p) => {
      return {
        ...p,
        items: p.items?.filter((p) => p !== item),
      };
    });
  };

  const handleUpdateItem = (
    oldItem: PurchaseItemDetails,
    newItem: PurchaseItemDetails,
  ) => {
    handleRemoveItem(oldItem);
    handleAddItem(newItem);
  };

  function handleCreatePurchase(): void {
    const reducePurchaseDetails = (
      item: PurchaseItemDetails,
    ): PurchaseItemRequest => {
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        supplierId: item.supplierId,
      };
    };
    try {
      const purchaseRequest = {
        ...purchase,
        items: purchase.items.map(reducePurchaseDetails),
      };
      AdminPurchaseControllerService.addPurchase(purchaseRequest);
      router.push("/admin/purchases");
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <>
      <AdminMainCard title="Nhập hàng" goBack={true}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`btn px-4 py-2 rounded-md flex items-center ml-3  shadow-sm `}
        >
          <i className="fa fa-add"></i>
          Thêm sản phẩm
        </button>
        <AddPurchaseItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          handleAddItem={handleAddItem}
        />
        <div className="flex flex-col w-full mt-2">
          <div className="flex flex-col gap-2 items-center overflow-y-auto flex-grow">
            <DataTable<PurchaseItemDetails>
              data={purchase?.items || []}
              emptyMessage="Chưa có sản phẩm nào được nhập"
              headers={[
                "Hình ảnh", // Image
                "Sản phẩm",
                "Nhà cung cấp",
                "Số lượng",
                "Giá",
              ]}
              renderRow={(item, index) => (
                <PurchaseTableRow
                  key={index}
                  item={item}
                  onDelete={handleRemoveItem}
                  onChange={handleUpdateItem}
                />
              )}
            />
          </div>

          <div className="shrink-0 mt-2">
            {purchase.items.length > 0 && (
              <div className="flex flex-row justify-center">
                <button
                  onClick={handleCreatePurchase}
                  className="btn bg-primary rounded-lg text-white"
                  type="submit"
                  style={{ marginRight: "10px" }}
                >
                  Nhập hàng
                </button>
                <button type="submit" className="btn">
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </AdminMainCard>
    </>
  );
};

export default CreatePurchasePage;
