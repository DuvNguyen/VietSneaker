import DataTable from "@/app/components/common/data-table";
import React from "react";
import PurchaseDetailsTableRow from "./purchase-details-table-row";
import { PurchaseDetails, PurchaseItemDetails } from "@/gen";
import VietSneakerModal from "@/app/components/modal/modal";

/**
 * For user to add single purchase item in a list
 * Before purchase creation
 */
const PurchaseDetailsModal = ({
  isOpen,
  onClose,
  model,
  // handleAddItem = () => {},
  // model = {} as PurchaseItemResponse[], // Default value if modify instead of add new one
}: {
  isOpen: boolean;
  onClose: () => void;
  model?: PurchaseDetails;
}) => {
  return (
    <VietSneakerModal isOpen={isOpen} onClose={onClose} width={"40rem"}>
      <fieldset className="fieldset w-full p-4 rounded-box space-y-4 text-left">
        <div className="flex flex-col gap-2 items-center overflow-y-auto flex-grow">
          <DataTable<PurchaseItemDetails>
            data={model?.items || []}
            emptyMessage="Không có thông tin sản phẩm"
            headers={[
              "", // Image
              "Sản phẩm",
              "Nhà cung cấp",
              "Số lượng",
              "Giá",
              "", // Edit
              "", // Delete
            ]}
            renderRow={(item, index) => (
              <PurchaseDetailsTableRow key={index} item={item} />
            )}
          />
        </div>

        <button
          onClick={() => {
            onClose();
          }}
          className="btn tex-white"
        >
          Thoát
        </button>
      </fieldset>
    </VietSneakerModal>
  );
};

export default PurchaseDetailsModal;
