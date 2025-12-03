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
      <div className="card bg-base-100 w-50 shadow-sm cursor-pointer transition-transform hover:scale-105 border border-gray-200 rounded-none">
        <figure className="pt-6">
          {
            <Thumbnail className="h-[18rem] w-[18rem]">
              <ProductImage data={product.image} />
            </Thumbnail>
          }
        </figure>
        <div className="card-body flex items-center justify-center text-center">
          <b className="text-xl">{product.name}</b>
          <h2 className="card-title text-red-500">{formatVND(product.sellPrice)}</h2>
        </div>
      </div>
    </Link>
  );
};

export const ProductSummaryPreload = () => {
  return (
    <div className="card skeleton bg-base-100 w-50 shadow-sm cursor-pointer transition-transform hover:scale-105">
      <figure className="pt-6">
        {<Thumbnail className="h-[18rem] w-[18rem] skeleton"></Thumbnail>}
      </figure>
    </div>
  );
};

export default ProductSummaryCard;
