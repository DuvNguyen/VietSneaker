"use client";
import {
  PageResponseProductSummaryResponse,
  ProductSummaryResponse,
  UserProductControllerService,
} from "@/gen";
import React, { useEffect, useState } from "react";
import { logger } from "@/util/logger";
import ProductCollection, {
  ProductCollectionPreload,
} from "@/app/components/product/product-collection";

export default function HomePage() {
  const [bestSellingProducts, setBestSelingProducts] = useState<
    ProductSummaryResponse[]
  >([]);
  const [latestProducts, setLatestProduct] =
    useState<PageResponseProductSummaryResponse>(
      {} as PageResponseProductSummaryResponse,
    );

  useEffect(() => {
    const fertchProduct = async () => {
      try {
        const bestSellingResp =
          await UserProductControllerService.getBestSellingProducts();
        setBestSelingProducts(bestSellingResp);
        const latest = await UserProductControllerService.getLatestProducts(
          0,
          8,
        );
        setLatestProduct(latest);
      } catch (err) {
        logger.log("Lỗi khi fetch sản phẩm", err);
      }
    };
    fertchProduct();
  }, [setBestSelingProducts]);
  return (
    <>
      <img
        src="/carosel.png"
        width={700}
        height={500}
        className="w-full"
        alt="calrosel"
      />

      <div className="lg:w-3/4 mx-auto">
        <h3 className="text-2xl font-bold p-10 text-center text-[1.6em]">
          Sản phẩm mới nhất
        </h3>
        {latestProducts.content ? (
          <ProductCollection products={latestProducts.content || []} />
        ) : (
          <ProductCollectionPreload />
        )}
      </div>

      <div className="lg:w-3/4 mx-auto">
        <h3 className="text-2xl font-bold text-center text-[1.6em] p-10 ">
          Sản phẩm bán chạy
        </h3>
        {bestSellingProducts.length > 0 ? (
          <ProductCollection products={bestSellingProducts} />
        ) : (
          <ProductCollectionPreload />
        )}
      </div>
    </>
  );
}
