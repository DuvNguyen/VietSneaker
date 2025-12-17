"use client";
import { ProductImage } from "@/app/components/common/ProductImage";
import Thumbnail from "@/app/components/common/thumbnail";
import ConfirmModal from "@/app/components/modal/confirm-modal";
import { AdminProductResponse } from "@/gen/models/AdminProductResponse";
import { AdminProductControllerService } from "@/gen/services/AdminProductControllerService";
import { formatVND } from "@/util/currency";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

type ProductRowProps = {
  item: AdminProductResponse;
  refreshCallBack: () => void;
};

const ProductTableRow = ({ item, refreshCallBack }: ProductRowProps) => {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const handleDelete = async () => {
    if (!item.productId) return;
    try {
      await AdminProductControllerService.deleteProduct(item.productId);
      setIsOpenConfirm(false);
      refreshCallBack();
      toast.success("Xóa thành công");
    } catch (e) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-center text-[15px]">
      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={handleDelete}
        title="Xác nhận"
        content="Bạn có muốn xóa sản phẩm này?"
      />

      {/* Cột mã sản phẩm */}
      <td className="py-3 px-4 border-b border-gray-200 font-medium text-gray-800">
        {item.productId}
      </td>

      {/* Cột hình ảnh */}
      <td className="py-3 px-4 border-b border-gray-200">
        {item.image ? (
          <Thumbnail className="h-[90px] w-[90px] mx-auto">
            <ProductImage data={item.image} />
          </Thumbnail>
        ) : (
          <span className="text-gray-400 italic">Không có ảnh</span>
        )}
      </td>

      {/* Cột tên sản phẩm */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {item.name}
      </td>

      {/* Cột giá gốc */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {formatVND(item.actualPrice)}
      </td>

      {/* Cột giá bán */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {formatVND(item.sellPrice)}
      </td>

      {/* Cột tồn kho */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {item.stock}
      </td>

      {/* Cột loại sản phẩm */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {item.type}
      </td>

      {/* Cột thương hiệu */}
      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
        {item.brand?.name || "—"}
      </td>

      {/* Cột chỉnh sửa */}
      <td
        className="py-3 px-4 border-b border-gray-200 cursor-pointer text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150"
      >
        <Link href={`/admin/products/${item.productId}/edit`}>
          <i className="fa fa-edit"></i>
        </Link>
      </td>

      {/* Cột xóa */}
      <td
        onClick={() => setIsOpenConfirm(true)}
        className="py-3 px-4 border-b border-gray-200 cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-150"
      >
        <i className="fa fa-trash"></i>
      </td>
    </tr>
  );
};

export default ProductTableRow;
