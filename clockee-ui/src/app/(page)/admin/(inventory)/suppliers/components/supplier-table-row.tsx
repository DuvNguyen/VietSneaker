import ConfirmModal from "@/app/components/modal/confirm-modal";
import { AdminSupplierControllerService, SupplierDTO } from "@/gen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import EditSupplierModal from "./edit-supplier-modal";
const SupplierTableRow = ({
  item,
  refreshCallBack,
}: {
  item: SupplierDTO;
  refreshCallBack: () => void;
}) => {
  const handleDelete = async () => {
    if (!item.supplierId) {
      return;
    }
    try {
      await AdminSupplierControllerService.deleteSupplier(item.supplierId);
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
      <EditSupplierModal
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
        content={"Bạn có muốn xóa nhà cung cấp này?"}
      />
      <td>{item.supplierId}</td>
      <td className={``}>{item.name}</td>
      <td className={``}>{item.address}</td>
      <td className={``}>{item.phone}</td>
      <td className={``}>{item.email}</td>
      <td onClick={() => setIsEditModal(true)} className={`hover:bg-gray-200 `}>
        {/* Action edit */}
        <i className="fa fa-edit cursor-pointer"></i>
      </td>
      <td
        onClick={() => setIsOpenConfirmModal(true)}
        className={`hover:bg-gray-200  `}
      >
        {/* Action delete */}
        <i className="fa fa-trash cursor-pointer"></i>
      </td>
    </tr>
  );
};
export default SupplierTableRow;
