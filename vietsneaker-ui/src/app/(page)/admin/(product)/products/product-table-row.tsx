"use client";
import { ProductImage } from "@/app/components/common/base-64-image";
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
    if (!item.productId) {
      return;
    }
    try {
      await AdminProductControllerService.deleteProduct(item.productId);
      setIsOpenConfirm(false);
      refreshCallBack();
      toast("Xóa thành công");
    } catch (e) {
      toast(e as string);
    }
  };

  return (
    <tr>
      <td>{item.productId}</td>
      <td>
        {item.image && (
          <Thumbnail className="h-[100px] w-[100px]">
            <ProductImage data={item.image} />
          </Thumbnail>
        )}
      </td>
      <td>{item.name}</td>
      <td>{formatVND(item.actualPrice)}</td>
      <td>{formatVND(item.sellPrice)}</td>
      <td>{item.stock}</td>
      <td>{item.type}</td>
      <td>{item.brand?.name}</td>
      <td className="hover:bg-gray-200">
        <Link href={`/admin/products/${item.productId}/edit`}>
          {/* Action edit */}
          <i className="fa fa-external-link-alt  cursor-pointer"></i>
        </Link>
      </td>
      <td
        onClick={() => {
          setIsOpenConfirm(true);
        }}
        className="hover:bg-gray-200"
      >
        {/* Action delete */}
        <i className="fa fa-trash"></i>
        <ConfirmModal
          isOpen={isOpenConfirm}
          onClose={() => setIsOpenConfirm(false)}
          onConfirm={handleDelete}
          title={"Xác nhận"}
          content={"Bạn có muốn xóa nhãn hàng này?"}
        />
      </td>
    </tr>
  );
};
export default ProductTableRow;
