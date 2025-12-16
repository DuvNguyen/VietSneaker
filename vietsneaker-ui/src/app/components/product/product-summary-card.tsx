import { ProductSummaryResponse } from "@/gen";
import Thumbnail from "../common/thumbnail";
import { ProductImage } from "../common/base-64-image";
import { formatVND } from "@/util/currency";
import Link from "next/link";

const ProductSummaryCard = ({
  product,
}: {
  product: ProductSummaryResponse;
}) => {
  return (
    <Link href={`/product/${product.productId}`}>
      <div className="card bg-base-100 w-72 shadow-sm cursor-pointer transition-transform hover:scale-105 border border-gray-200 rounded-none">

        <figure className="p-4">
          <Thumbnail className="w-full aspect-[1/1]">
            <ProductImage
              data={product.image}
              className="w-full h-full object-cover"
            />
          </Thumbnail>
        </figure>

        <div className="card-body items-center text-center p-4">
          <b className="text-lg min-h-[48px] line-clamp-2">
            {product.name}
          </b>

          <h2 className="text-xl text-red-500 font-semibold">
            {formatVND(product.sellPrice)}
          </h2>
        </div>

      </div>
    </Link>
  );
};

export const ProductSummaryPreload = () => {
  return (
    <div className="card skeleton bg-base-100 w-72 shadow-sm rounded-none">
      <figure className="p-4">
        <Thumbnail className="w-full aspect-[1/1] skeleton"></Thumbnail>
      </figure>
    </div>
  );
};

export default ProductSummaryCard;
