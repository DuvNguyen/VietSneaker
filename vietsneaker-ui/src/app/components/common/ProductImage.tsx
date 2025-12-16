import React, { useState } from "react";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type ProductImageProps = {
  src?: string;          // URL Cloudinary
  className?: string;
};

const DEFAULT_PRODUCT_IMAGE = "/nike-airforce1.jpg"; // nằm trong public/

export const ProductImage = ({
  src,
  className,
}: ProductImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const imageSrc = src || DEFAULT_PRODUCT_IMAGE;

  return (
    <>
      <img
        src={imageSrc}
        alt="product image"
        className={`rounded-none cursor-zoom-in ${className}`}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{ src: imageSrc }]}
          plugins={[Zoom]}
        />
      )}
    </>
  );
};

export default ProductImage;
