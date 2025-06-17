import { PurchaseItemRequest } from "@/gen";

/**
 * For storage information about purchase item and the details information
 * like name of product, supplier for display in main purchase creation page
 */
export type PurchaseItemDetails = PurchaseItemRequest & {
  productName: string;
  supplierName: string;
  productImage: string;
};
