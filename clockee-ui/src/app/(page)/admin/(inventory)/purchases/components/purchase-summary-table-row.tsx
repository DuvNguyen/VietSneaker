/**
 * Summary the purchase product history
 *
 */
"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { formatVND } from "@/util/currency";
import {
  AdminPurchaseControllerService,
  PurchaseDetails,
  PurchaseSummary,
} from "@/gen";
import PurchaseDetailsModal from "./view-purchase-modal";
import { logger } from "@/util/logger";

type PurchaseTableRowProps = {
  item: PurchaseSummary;
  onDelete: (item: PurchaseSummary) => void;
  onChange: (oldItem: PurchaseSummary, newItem: PurchaseSummary) => void;
};

// Just fetch details information on click only

const PurchaseSummaryTableRow = ({
  item,
  onDelete,
  onChange,
}: PurchaseTableRowProps) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState({} as PurchaseDetails);

  const handleViewPurchaseDetails = async () => {
    try {
      if (!item.purchaseId) {
        return;
      }
      const resp = await AdminPurchaseControllerService.getPurchaseDetails(
        item.purchaseId,
      );
      setPurchaseDetails(resp);
    } catch (error) {
      logger.info(error);
      toast("Có lỗi xảy ra");
    }
    setIsViewModalOpen(true);
  };

  return (
    <tr>
      <td>{item.purchaseId}</td>
      <td>{item.createdAt}</td>
      <td>{item.createdByUsername}</td>
      <td>{formatVND(item.totalPrice)}</td>
      <td onClick={handleViewPurchaseDetails} className="hover:bg-gray-200">
        {/* Action to view details */}
        <i className="fa fa-external-link-alt"></i>
      </td>

      <PurchaseDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        // handleAddItem={handleChange}
        model={purchaseDetails}
        // model={item.purchaseId}
      />
    </tr>
  );
};
export default PurchaseSummaryTableRow;
