import React from "react";
import VietSneakerModal from "./modal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}) => {
  return (
    <VietSneakerModal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="py-4">{content}</p>
      </div>
      <div className="modal-action">
        <button
          className="btn bg-red-500 text-white rounded-none"
          onClick={onConfirm}
          style={{ marginRight: "10px" }}
        >
          Đồng ý
        </button>
        <button className="btn rounded-none" onClick={onClose}>
          Hủy
        </button>
      </div>
    </VietSneakerModal>
  );
};

export default ConfirmModal;
