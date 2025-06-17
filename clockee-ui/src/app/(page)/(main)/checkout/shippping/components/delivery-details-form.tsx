"use client";
import { UserControllerService } from "@/gen";
import ErrorText from "@/app/components/typography/error-text";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DeliverDetailsType, useCart } from "@/lib/hooks/use-cart";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { mapApiErrorsToForm } from "@/util/form";

const DeliveryDetailsForm = () => {
  const { deliveryDetails, setDeliveryDetails, selectedItems } = useCart();
  const router = useRouter();

  const fetchDeliveryDetails = async () => {
    setDeliveryDetails(await UserControllerService.currentUserDetails());
  };
  // Get user information as default delivery information
  useEffect(() => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      router.push("/cart");
    }
    if (!deliveryDetails.name && !deliveryDetails.phone) {
      fetchDeliveryDetails();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeliverDetailsType>({
    defaultValues: deliveryDetails,
  });
  const onSubmit: SubmitHandler<DeliverDetailsType> = async (data) => {
    try {
      setDeliveryDetails({
        ...data,
        name: deliveryDetails?.name,
      });
      router.push("/checkout/confirm");
    } catch (error) {
      mapApiErrorsToForm(error, setError);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Địa chỉ:
          </label>
          <input
            type="text"
            id="address"
            autoFocus
            {...register("address", { required: "Địa chỉ không được trống" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại:
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("phone", {
              required: "Số điện thoại không được trống",
              maxLength: {
                value: 11,
                message: "Số điện thoại chỉ được tối đa 11 ký tự",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Số điện thoại phải là số",
              },
            })}
          />
        </div>

        {/* Validation error message */}
        <div className="flex items-center gap-2">
          <div className="validator-hint">
            {errors.address && <ErrorText>{errors.address.message}</ErrorText>}
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
          </div>
        </div>
        {/* Save & cancel button  */}
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="text-white btn btn-md px-4 py-2 rounded bg-primary shadow"
          >
            Tiếp tục →
          </button>
        </div>
      </fieldset>
    </form>
  );
};
export default DeliveryDetailsForm;
