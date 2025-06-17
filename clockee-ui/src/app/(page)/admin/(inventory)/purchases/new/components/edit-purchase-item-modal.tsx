import { ProductImage } from "@/app/components/common/base-64-image";
import Thumbnail from "@/app/components/common/thumbnail";
import ClockeeModal from "@/app/components/modal/modal";
import ErrorText from "@/app/components/typography/error-text";
import {
  AdminProductControllerService,
  AdminSupplierControllerService,
  ProductSummaryResponse,
  SupplierDTO,
} from "@/gen";
import { useLazyPage } from "@/lib/hooks/use-lazy-load";
import { SelectOption } from "@/model/SelectOption";
import { mapApiErrorsToForm } from "@/util/form";
import React, { KeyboardEvent } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { PurchaseItemDetails } from "./model";
import {
  mapProductSummaryToSelectOption,
  mapSupplierSummaryToSelectOption,
  ProductSelectOption,
} from "./purchase-item-utils";
import { useDebounceCallback } from "usehooks-ts";

/**
 * For user to add single purchase item in a list
 * Before purchase creation
 */
const EditPurchaseItemModal = ({
  isOpen,
  onClose,
  handleAddItem = () => {},
  model = {} as PurchaseItemDetails, // Default value if modify instead of add new one
}: {
  isOpen: boolean;
  onClose: () => void;
  handleAddItem?: (item: PurchaseItemDetails) => void;
  model?: PurchaseItemDetails;
}) => {
  const {
    setError,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseItemDetails>({
    defaultValues: model,
  });
  const onSubmit: SubmitHandler<PurchaseItemDetails> = async (
    data: PurchaseItemDetails,
  ) => {
    try {
      onClose();
      const selectProduct =
        productPage?.content.filter(
          (prod) => prod.productId === data.productId,
        )[0] || {};
      const selectSupplier =
        supplierPage?.content.filter(
          (supl) => supl.supplierId === data.supplierId,
        )[0] || {};
      const purchaseItemWithDetails = {
        ...data,
        productName: String(selectProduct?.name),
        productImage: String(selectProduct?.image),
        supplierName: String(selectSupplier?.name),
      };
      handleAddItem(purchaseItemWithDetails);
      toast("Thay đổi thành công");
    } catch (e) {
      mapApiErrorsToForm(e, setError);
    }
  };

  /*
   * Manage lazy load for product search/select
   */
  const {
    fetchMore: fetchMoreProduct,
    setQuery: setProductQuery,
    query: productQuery,
    pageInfo: productPage,
  } = useLazyPage<ProductSummaryResponse>({
    fetchData: async (page, query) => {
      return await AdminProductControllerService.getAllProducts(
        page,
        undefined,
        query,
        "stock",
        "asc",
      );
    },
  });

  let selectProductIndex = 0;
  /**
   * Load more product name when user narrow down to the and of select list
   */
  const handleMenuInputKeyDown = useDebounceCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Stimulate catch user change narrow select menu with a track variable
      if (!productPage?.size) {
        selectProductIndex = 0;
      } else {
        if (event.key === "ArrowUp") {
          selectProductIndex =
            selectProductIndex === 0
              ? productPage.size - 1
              : selectProductIndex - 1;
        } else if (event.key === "ArrowDown") {
          selectProductIndex =
            selectProductIndex === productPage.size - 1
              ? 0
              : selectProductIndex + 1;
        }
      }
      if (!productPage?.content) {
        return;
      }
      if (selectProductIndex === productPage.size - 1) {
        fetchMoreProduct();
      }
    },
    300,
  );

  /*
   * Manage lazy load for supplier search/select
   */
  const {
    fetchMore: fetchMoreSupplier,
    setQuery: setSupplierQuery,
    query: supplierQuery,
    pageInfo: supplierPage,
  } = useLazyPage<SupplierDTO>({
    fetchData: async (page, query) => {
      return await AdminSupplierControllerService.getAllSuppliers(
        page,
        undefined,
        query,
      );
    },
  });

  let selectSupplierIndex = 0;
  /**
   * Load more product name when user narrow down to the and of select list
   */
  const handleMenuSupplierInputKeyDown = useDebounceCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Stimulate catch user change narrow select menu with a track variable
      if (!supplierPage?.size) {
        selectSupplierIndex = 0;
      } else {
        if (event.key === "ArrowUp") {
          selectSupplierIndex =
            selectSupplierIndex === 0
              ? supplierPage.size - 1
              : selectSupplierIndex - 1;
        } else if (event.key === "ArrowDown") {
          selectSupplierIndex =
            selectSupplierIndex === supplierPage.size - 1
              ? 0
              : selectSupplierIndex + 1;
        }
      }
      if (!supplierPage?.content) {
        return;
      }
      if (selectSupplierIndex === supplierPage.size - 1) {
        fetchMoreSupplier();
      }
    },
    300,
  );

  return (
    <ClockeeModal isOpen={isOpen} onClose={onClose} width={"40rem"}>
      <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset w-full p-4 rounded-box space-y-4 text-left">
          <div>
            <label className="label">
              <span className="label-text">Sản phẩm</span>
            </label>

            {/**
             * Controller select product with combobox
             * Support lazy loading, search filter
             * Display product preview
             * Set input value is productId on select
             */}
            <Controller
              control={control}
              render={function ({
                field,
              }: {
                field: ControllerRenderProps<PurchaseItemDetails>;
              }): React.ReactElement {
                function handleQueryProductChange(newValue: string): void {
                  if (newValue != productQuery) {
                    setProductQuery(newValue);
                  }
                }
                function setInputValueAsSelectValue(
                  newOption: SingleValue<ProductSelectOption>,
                ): void {
                  field.onChange(newOption?.value);
                }

                return (
                  <Select
                    className="w-full validator"
                    options={
                      productPage?.content?.map(
                        mapProductSummaryToSelectOption,
                      ) || []
                    }
                    onInputChange={handleQueryProductChange}
                    onChange={setInputValueAsSelectValue}
                    onMenuScrollToBottom={() => {
                      fetchMoreProduct();
                    }}
                    formatOptionLabel={(option) => {
                      return (
                        <div className="flex items-center px-5 space-10">
                          <Thumbnail className="size-[4rem]">
                            <ProductImage data={option.image} />
                          </Thumbnail>
                          <div className="text-bold font-medium px-10">
                            <h3>{option.name}</h3>
                            <p>Còn lại: {option.stock}</p>
                          </div>
                        </div>
                      );
                    }}
                    onKeyDown={handleMenuInputKeyDown}
                    value={(
                      productPage?.content?.map(
                        mapProductSummaryToSelectOption,
                      ) || []
                    ).find((opt) => opt.value === field.value)}
                    placeholder="Chọn sản phẩm..."
                    // Fix hydration mismatch
                    instanceId="product-select"
                  />
                );
              }}
              {...register("productId", { required: "Vui lòng chọn sản phẩm" })}
            />
          </div>

          {/**
           * Controller select suppler with combobox
           * Set input value is supplierId on select
           */}
          <Controller
            control={control}
            render={function ({
              field,
            }: {
              field: ControllerRenderProps<PurchaseItemDetails>;
            }): React.ReactElement {
              function handleQuerySupplierChange(newValue: string): void {
                if (newValue != supplierQuery) {
                  setSupplierQuery(newValue);
                }
              }
              function setInputSupplierAsSelectValue(
                newOption: SingleValue<SelectOption>,
              ): void {
                field.onChange(newOption?.value);
              }

              return (
                <Select
                  className="w-full validator"
                  options={
                    supplierPage?.content?.map(
                      mapSupplierSummaryToSelectOption,
                    ) || []
                  }
                  onInputChange={handleQuerySupplierChange}
                  defaultValue={{
                    label: String(model.supplierName),
                    value: Number(model.supplierId),
                  }}
                  onChange={setInputSupplierAsSelectValue}
                  onMenuScrollToBottom={() => {
                    fetchMoreSupplier();
                  }}
                  onKeyDown={handleMenuSupplierInputKeyDown}
                  value={(
                    productPage?.content?.map(
                      mapSupplierSummaryToSelectOption,
                    ) || []
                  ).find((opt) => opt.value === field.value)}
                  placeholder="Chọn nhà cung cấp..."
                  // Fix hydration mismatch
                  instanceId="supplier-select"
                />
              );
            }}
            {...register("supplierId", {
              required: "Vui lòng chọn nhà cung cấp",
            })}
          />

          <div>
            <label className="label">
              <span className="label-text">Giá</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="2000000"
              {...register("price", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Giá không được âm",
                },
                required: "Giá không được để trống",
              })}
            />
          </div>

          <label className="label">
            <span className="label-text">Số lượng</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="0"
            {...register("quantity", {
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Số lượng không phải lớn hơn 0",
              },
              required: "Số lượng không được để trống",
            })}
          />

          {/* Validation error message */}
          <div className="flex items-center gap-2">
            <div className="validator-hint">
              {errors.productId && (
                <ErrorText>{errors.productId.message}</ErrorText>
              )}
              {errors.supplierId && (
                <ErrorText>{errors.supplierId.message}</ErrorText>
              )}
              {errors.quantity && (
                <ErrorText>{errors.quantity.message}</ErrorText>
              )}
              {errors.price && <ErrorText>{errors.price.message}</ErrorText>}
              {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary tex-white">
            Lưu
          </button>
        </fieldset>
      </form>
    </ClockeeModal>
  );
};

export default EditPurchaseItemModal;
