import React from "react";
import ClockeeModal from "./modal";

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
    <ClockeeModal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="py-4">{content}</p>
      </div>
      <div className="modal-action">
        <button
          className="btn bg-primary text-white"
          onClick={onConfirm}
          style={{ marginRight: "10px" }}
        >
          Đồng ý
        </button>
        <button className="btn" onClick={onClose}>
          Hủy
        </button>
      </div>
    </ClockeeModal>
  );
};

export default ConfirmModal;
