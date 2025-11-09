"use client";
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
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const handleDelete = async () => {
    if (!item.supplierId) return;
    try {
      await AdminSupplierControllerService.deleteSupplier(item.supplierId);
      setIsOpenConfirmModal(false);
      refreshCallBack();
      toast("Xóa thành công");
    } catch (e) {
      toast(e as string);
    }
  };

  return (
    <tr
      className="
        border-b border-gray-200
        odd:bg-white even:bg-gray-50
        hover:bg-[#fff0f0]
        transition-colors duration-200
        text-center text-[15px] text-gray-700
      "
    >
      {/* 🧩 Modals */}
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
        title="Xác nhận"
        content="Bạn có muốn xóa nhà cung cấp này?"
      />

      {/* 🧾 Cột ID */}
      <td className="p-3 font-medium text-gray-800 w-[8%] whitespace-nowrap">
        {item.supplierId}
      </td>

      {/* 🏷️ Cột Tên */}
      <td className="p-3 w-[20%] truncate" title={item.name}>
        {item.name}
      </td>

      {/* 🏠 Cột Địa chỉ (giới hạn chiều rộng để tránh tràn) */}
      <td className="p-3 w-[28%] max-w-[250px] truncate" title={item.address}>
        {item.address}
      </td>

      {/* 📞 Cột SĐT */}
      <td className="p-3 w-[15%] whitespace-nowrap">{item.phone}</td>

      {/* ✉️ Cột Email */}
      <td className="p-3 w-[20%] truncate" title={item.email}>
        {item.email}
      </td>

      {/* ✏️ Cột sửa */}
      <td
        onClick={() => setIsEditModal(true)}
        className="p-3 w-[4%] cursor-pointer hover:bg-[#fff0f0] transition"
        title="Chỉnh sửa"
      >
        <i className="fa fa-edit text-[#e20000] hover:scale-110 transition-transform"></i>
      </td>

      {/* 🗑️ Cột xóa */}
      <td
        onClick={() => setIsOpenConfirmModal(true)}
        className="p-3 w-[4%] cursor-pointer hover:bg-[#fff0f0] transition"
        title="Xóa nhà cung cấp"
      >
        <i className="fa fa-trash text-red-600 hover:scale-110 transition-transform"></i>
      </td>
    </tr>
  );
};

export default SupplierTableRow;
