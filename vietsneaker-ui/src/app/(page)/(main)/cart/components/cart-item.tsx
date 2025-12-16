import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { CartItemDetails } from "@/gen";
import { useCart } from "@/lib/hooks/use-cart";
import ConfirmModal from "@/app/components/modal/confirm-modal";
import Link from "next/link";
import { formatVND } from "@/util/currency";
import { ProductImage } from "@/app/components/common/ProductImage";
import Thumbnail from "@/app/components/common/thumbnail";

interface CartItemProps {
  item: CartItemDetails;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const {
    removeFromCart,
    updateItemQuantity,
    handleCheckItem,
    handleUncheckItem,
  } = useCart();
  const decreaseItemQuantity = () => {
    const newItem: CartItemDetails = {
      ...item,
      quantity: Number(item.quantity) - 1,
    };
    if (newItem.quantity == 0) {
      setIsOpenConfirmModal(true);
      return;
    }
    updateItemQuantity(newItem);
  };

  function handleCheck(
    e: React.ChangeEvent<HTMLInputElement>,
    item: CartItemDetails,
  ) {
    if (e.target.checked) {
      handleCheckItem(item);
    } else {
      handleUncheckItem(item);
    }
  }

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const increaseItemQuantity = () => {
    const newItem: CartItemDetails = {
      ...item,
      quantity: Number(item.quantity) + 1,
    };
    updateItemQuantity(newItem);
  };

  const handleConfirmDelete = () => {
    removeFromCart(item);
    setIsOpenConfirmModal(false);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <input
        className="checkbox mr-3"
        type="checkbox"
        onChange={(e) => {
          handleCheck(e, item);
        }}
      />
      <div className="size-[5rem] bg-gray-100 rounded-md overflow-hidden">
        <Thumbnail className="size-[5rem]">
          <ProductImage data={item.image} />
        </Thumbnail>
      </div>

      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-lg">
          <Link href={`/product/${item.productId}`}>{item.name}</Link>
        </h3>
        <div className="text-sm text-gray-600 space-y-1"></div>
        <p className="font-bold mt-1">{formatVND(item.price)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={decreaseItemQuantity}
        >
          <span className="text-lg">-</span>
        </button>

        <span className="w-8 text-center">{item.quantity}</span>

        <button
          className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={increaseItemQuantity}
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      <button
        className="h-8 w-8 ml-5 text-gray-500 rounded-full hover:text-red-500 "
        onClick={() => setIsOpenConfirmModal(true)}
      >
        <Trash2 size={18} />
      </button>
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title={"Xác nhận"}
        content={"Bạn có muốn xóa sản phẩm này khỏi giỏ hàng này?"}
      />
    </div>
  );
};
export default CartItem;
