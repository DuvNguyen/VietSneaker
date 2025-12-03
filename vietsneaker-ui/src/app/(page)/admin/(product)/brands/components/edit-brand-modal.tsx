import VietSneakerModal from "@/app/components/modal/modal";
import ErrorText from "@/app/components/typography/error-text";
import { AdminBrandControllerService, BrandDTO } from "@/gen";
import { mapApiErrorsToForm } from "@/util/form";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
const EditBrandModal = ({
  isOpen,
  onClose,
  refreshCallBack,
  model,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshCallBack: () => void;
  model: BrandDTO;
}) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandDTO>({
    defaultValues: model,
  });
  const onSubmit: SubmitHandler<BrandDTO> = async (data) => {
    if (!model.brandId) {
      // TODO: error mesgage
      return;
    }
    try {
      await AdminBrandControllerService.updateBrand(model.brandId, data);
      onClose();
      refreshCallBack();
      toast("Cập nhập thành công");
    } catch (e) {
      mapApiErrorsToForm(e, setError);
    }
  };
  return (
    <VietSneakerModal isOpen={isOpen} onClose={onClose}>
      <form
        className="flex items-center justify-center flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <fieldset className="fieldset w-xs">
            <h1 className="font-bold text-lg">Chỉnh sửa nhãn hàng</h1>

            <label className="fieldset-label">Tên</label>
            <input
              autoFocus={true}
              className="input validator rounded-none"
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
              type="submit"
              className="btn bg-red-500 rounded-none text-white"
              onClick={refreshCallBack}
              style={{ marginRight: "10px" }}
            >
              Lưu
            </button>
            <button className="btn rounded-none" onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </form>
    </VietSneakerModal>
  );
};

export default EditBrandModal;
