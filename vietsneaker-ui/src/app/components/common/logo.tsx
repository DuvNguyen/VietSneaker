import React from "react";

// Show with app name
const Logo = () => {
  return (
    <>
      <div className="flex items-center text-xl font-bold text-orange-500">
        <img
          className="w-[100px] h-auto mr-[-9px] mt-[-5px] cursor-pointer"
          src="/logo_header.png"
          alt="logo login"
        />
      </div>
    </>
  );
};
export default Logo;
