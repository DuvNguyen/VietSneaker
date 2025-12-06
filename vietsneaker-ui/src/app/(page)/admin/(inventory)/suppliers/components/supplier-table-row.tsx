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
    <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-50 hover:bg-[#fff0f0] transition-colors duration-200 text-center text-[15px] text-gray-700">
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

      {/* 🆔 ID */}
      <td className="p-3 font-medium text-gray-800">{item.supplierId}</td>

      {/* 🏷️ Tên */}
      <td className="p-3 truncate" title={item.name}>{item.name}</td>

      {/* 🏠 Địa chỉ */}
      <td className="p-3 truncate max-w-[250px]" title={item.address}>
        {item.address}
      </td>

      {/* 📞 SĐT */}
      <td className="p-3 whitespace-nowrap">{item.phone}</td>

      {/* ✉️ Email */}
      <td className="p-3 truncate">{item.email}</td>

      {/* 🧪 Loại NCC */}
      <td className="p-3">{item.supplierType}</td>

      {/* 📱 Zalo */}
      <td className="p-3">{item.zalo || "-"}</td>

      {/* 🌐 Facebook */}
      <td className="p-3">
        {item.facebook ? (
          <a 
            href={item.facebook} 
            target="_blank"
            className="text-blue-600 underline"
          >
            Link
          </a>
        ) : "-"}
      </td>

      {/* ⭐ Rating */}
      <td className="p-3">{item.rating} / 5</td>

      {/* ✏️ Sửa */}
      <td
        className="p-3 cursor-pointer hover:bg-[#fff0f0] transition"
        onClick={() => setIsEditModal(true)}
      >
        <i className="fa fa-edit text-[#e20000] hover:scale-110 transition-transform"></i>
      </td>

      {/* 🗑 Xóa */}
      <td
        className="p-3 cursor-pointer hover:bg-[#fff0f0] transition"
        onClick={() => setIsOpenConfirmModal(true)}
      >
        <i className="fa fa-trash text-red-600 hover:scale-110 transition-transform"></i>
      </td>
    </tr>
  );
};

export default SupplierTableRow;
