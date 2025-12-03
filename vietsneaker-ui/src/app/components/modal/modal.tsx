import React, { ReactNode } from "react";
import Modal from "react-modal";

const VietSneakerModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  width = "auto",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  width?: string | undefined | number;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      ariaHideApp={false} // Avoids accessibility warning
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "static",
          width: width,
          maxWidth: "90%",
          padding: "20px",
          textAlign: "center",
        },
      }}
      className={`shadow rounded-none m-10 bg-white min-h-60 min-w-80 flex items-center justify-center flex-col ${className}`}
    >
      {children}
    </Modal>
  );
};

export default VietSneakerModal;
