import { ProductSummaryResponse, SupplierDTO } from "@/gen";
import { SelectOption } from "@/model/SelectOption";

export type ProductSelectOption = SelectOption & ProductSummaryResponse & {};

/**
 * Make search label for display as select option (combobox)
 * Value storage for api will be value aka product id
 */
export const mapProductSummaryToSelectOption = (
  product: ProductSummaryResponse,
) => {
  const option: ProductSelectOption = {
    ...product,
    label: String(product.name),
    value: Number(product.productId),
  };
  return option;
};

/**
 * Make search label for display as select option (combobox)
 * Value storage for api will be value aka supplier id
 */
export const mapSupplierSummaryToSelectOption = (item: SupplierDTO) => {
  const option: ProductSelectOption = {
    label: String(item.name),
    value: Number(item.supplierId),
  };
  return option;
};
