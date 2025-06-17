import ClockeeModal from "@/app/components/modal/modal";
import ErrorText from "@/app/components/typography/error-text";
import { AdminSupplierControllerService, SupplierDTO } from "@/gen";
import { mapApiErrorsToForm } from "@/util/form";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
const EditSupplierModal = ({
  isOpen,
  onClose,
  refreshCallBack,
  model,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshCallBack: () => void;
  model: SupplierDTO;
}) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierDTO>({
    defaultValues: model,
  });
  const onSubmit: SubmitHandler<SupplierDTO> = async (data) => {
    // TODO: handle server validation
    if (!model.supplierId) {
      // TODO: error mesgage
      return;
    }
    try {
      await AdminSupplierControllerService.updateSupplier(
        model.supplierId,
        data,
      );
      onClose();
      refreshCallBack();
      toast("Cập nhập thành công");
    } catch (e) {
      mapApiErrorsToForm(e, setError);
    }
  };
  return (
    <ClockeeModal isOpen={isOpen} onClose={onClose}>
      <form
        className="flex items-center justify-center flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <fieldset className="fieldset w-xs">
            <h1 className="font-bold text-lg">Chỉnh sửa nhà cung cấp</h1>

            {/* Form input  */}
            <label className="fieldset-label">Tên</label>
            <input
              autoFocus={true}
              className="input validator"
              {...register("name", { required: "Tên không được trống" })}
            />

            <label className="fieldset-label">Địa chỉ</label>
            <input
              className="input validator"
              {...register("address", { required: "Địa chỉ không được trống" })}
            />

            <label className="fieldset-label">Số điện thoại</label>
            <input
              className="input validator"
              {...register("phone", {
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Số điện thoại phải là số",
                },
              })}
            />

            <label className="fieldset-label">Email</label>
            <input
              className="input validator"
              {...register("email", {
                required: "Email không được trống",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Giá trị email không đúng định dạng",
                },
              })}
            />
          </fieldset>

          {/* Validation error message */}
          <div className="flex items-center gap-2">
            <div className="validator-hint">
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
              {errors.address && (
                <ErrorText>{errors.address.message}</ErrorText>
              )}
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
              {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
            </div>
          </div>
          {/* Save & cancel button  */}
          <div className="modal-action">
            <button
              className="btn bg-primary rounded-lg text-white"
              onClick={refreshCallBack}
              style={{ marginRight: "10px" }}
            >
              Lưu
            </button>
            <button type="submit" className="btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </form>
    </ClockeeModal>
  );
};

export default EditSupplierModal;
