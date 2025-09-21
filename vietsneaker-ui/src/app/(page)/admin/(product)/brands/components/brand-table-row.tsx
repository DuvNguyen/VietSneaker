import ConfirmModal from "@/app/components/modal/confirm-modal";
import { AdminBrandControllerService, BrandDTO } from "@/gen";
import React, { useState } from "react";
import EditBrandModal from "./edit-brand-modal";
import { toast } from "react-toastify";

type BrandRowProps = {
  item: BrandDTO;
  refreshCallBack: () => void;
};

const BrandTableRow = ({ item, refreshCallBack }: BrandRowProps) => {
  const handleDelete = async () => {
    if (!item.brandId) {
      return;
    }
    try {
      await AdminBrandControllerService.deleteBrand(item.brandId);
      setIsOpenConfirmModal(false);
      refreshCallBack();
      toast("Xóa thành công");
    } catch (e) {
      toast(e as string);
    }
  };
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const [isEditModal, setIsEditModal] = useState(false);
  return (
    <tr className="whitespace-nowrap text-center">
      <EditBrandModal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        refreshCallBack={refreshCallBack}
        model={item}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        onConfirm={handleDelete}
        title={"Xác nhận"}
        content={"Bạn có muốn xóa nhãn hàng này?"}
      />
      <td>{item.brandId}</td>
      <td>{item.name}</td>
      <td onClick={() => setIsEditModal(true)} className={`hover:bg-gray-200 `}>
        {/* Action edit */}
        <i className="fa fa-edit cursor-pointer"></i>
      </td>
      <td
        onClick={() => setIsOpenConfirmModal(true)}
        className={`hover:bg-gray-200`}
      >
        {/* Action delete */}
        <i className={`fa fa-trash cursor-pointer `}></i>
      </td>
    </tr>
  );
};
export default BrandTableRow;
