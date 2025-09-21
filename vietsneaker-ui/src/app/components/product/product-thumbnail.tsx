import React from "react";
import Thumbnail from "../common/thumbnail";

type ProductThumbnailProps = {
  imageUrl: string;
  alt?: string;
};

const ProductThumbnail = ({ imageUrl, alt = "" }: ProductThumbnailProps) => {
  return (
    <Thumbnail>
      <img src={imageUrl} alt={alt} />
    </Thumbnail>
  );
};

export default ProductThumbnail;
