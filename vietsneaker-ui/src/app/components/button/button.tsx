import React, { ButtonHTMLAttributes } from "react";

// 1. Kế thừa ButtonHTMLAttributes để có đầy đủ type="submit", onClick, disabled...
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  // children đã có sẵn trong ButtonHTMLAttributes nhưng khai báo lại cũng không sao
}

const PrimaryButton = ({ 
  children, 
  className = "", 
  ...props // 2. Lấy tất cả các props còn lại (như type, onClick...)
}: PrimaryButtonProps) => {
  return (
    <button
      // 3. Spread props vào thẻ button thật
      {...props} 
      className={`btn bg-primary text-white px-4 py-2 rounded-md flex items-center ml-2 shadow-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;