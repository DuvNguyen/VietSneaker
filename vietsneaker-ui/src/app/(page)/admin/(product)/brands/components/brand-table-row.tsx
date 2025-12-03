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
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const handleDelete = async () => {
    if (!item.brandId) return;
    try {
      await AdminBrandControllerService.deleteBrand(item.brandId);
      setIsOpenConfirmModal(false);
      refreshCallBack();
      toast.success("Xóa thành công");
    } catch (e) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-center text-[15px]">
      {/* Modal sửa */}
      <EditBrandModal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        refreshCallBack={refreshCallBack}
        model={item}
      />
      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        onConfirm={handleDelete}
        title="Xác nhận"
        content="Bạn có muốn xóa nhãn hàng này?"
      />

      {/* Cột mã thương hiệu */}
      <td className="py-3 px-4 border-b border-gray-200 font-medium text-gray-800">
        {item.brandId}
      </td>

      {/* Cột tên thương hiệu */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {item.name}
      </td>

      {/* Cột chỉnh sửa */}
      <td
        onClick={() => setIsEditModal(true)}
        className="py-3 px-4 border-b border-gray-200 cursor-pointer text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150"
      >
        <i className="fa fa-edit"></i>
      </td>

      {/* Cột xóa */}
      <td
        onClick={() => setIsOpenConfirmModal(true)}
        className="py-3 px-4 border-b border-gray-200 cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-150"
      >
        <i className="fa fa-trash"></i>
      </td>
    </tr>
  );
};

export default BrandTableRow;
