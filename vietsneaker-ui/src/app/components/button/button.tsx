import React, { ReactNode } from "react";
type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
};
const PrimaryButton = ({ children, className = "btn" }: PrimaryButtonProps) => {
  return (
    <>
      <button
        className={`btn bg-primary  text-white px-4 py-2 rounded-md flex items-center ml-2  shadow-sm ${className}`}
      >
        {children}
      </button>
    </>
  );
};

export default PrimaryButton;
