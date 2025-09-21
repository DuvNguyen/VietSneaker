import ClockeeModal from "@/app/components/modal/modal";
import ErrorText from "@/app/components/typography/error-text";
import { AdminBrandControllerService, BrandDTO } from "@/gen";
import { mapApiErrorsToForm } from "@/util/form";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
const CreateBrandModal = ({
  isOpen,
  onClose,
  refreshCallBack,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshCallBack: () => void;
}) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandDTO>();
  const onSubmit: SubmitHandler<BrandDTO> = async (data: BrandDTO) => {
    try {
      await AdminBrandControllerService.addBrand(data);
      onClose();
      refreshCallBack();
      toast("Thêm thành công");
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
            <h1 className="font-bold text-lg">Thêm mới nhãn hàng</h1>

            <label className="fieldset-label">Tên</label>
            <input
              autoFocus={true}
              className="input validator"
              {...register("name", { required: "Tên không được trống" })}
            />
          </fieldset>

          {/* Validation error message */}
          <div className="flex items-center gap-2">
            <div className="validator-hint">
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
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

export default CreateBrandModal;
