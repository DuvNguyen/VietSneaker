import React from "react";
import Link from "next/link"; // Dùng Link để bao logo, bấm vào là về trang chủ luôn

const Logo = () => {
  return (
    <Link href="/" className="block h-full cursor-pointer">
      {/* Giải thích class:
        - h-full: Chiều cao ảnh sẽ luôn bằng chiều cao của thẻ cha (Header quy định).
        - w-auto: Chiều rộng tự động co giãn theo tỷ lệ ảnh -> Không bao giờ bị méo ảnh.
        - object-contain: Đảm bảo toàn bộ logo nằm gọn trong khung, không bị cắt xén (crop).
      */}
      <img
        className="h-full w-auto object-contain"
        src="/logo_header_1.png"
        alt="Website giày 2hand"
      />
    </Link>
  );
};

export default Logo;