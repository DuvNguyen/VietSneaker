import React, { useState } from "react";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const base64ImageMap = (bytes: string) => {
  return `data:image/png;base64,${bytes}`;
};

type ImageProps = {
  data: string;
  className?: string;
};
const Base64Image = ({ data, className }: ImageProps) => {
  return (
    <>
      <img className={`${className}`} src={base64ImageMap(data)} />
    </>
  );
};

const defaultProductImage = "nike-airforce1.jpg";
export const ProductImage = ({
  data,
  className,
}: {
  data?: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = data ? base64ImageMap(data) : defaultProductImage;

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
export default Base64Image;
