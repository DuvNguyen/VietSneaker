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

import RecommandService from "@/service/recommand.service";
import OrderService from "@/service/order.service";   // ⭐ đúng file
import { useAuth } from "@/lib/hooks/use-auth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const [bestSellingProducts, setBestSellingProducts] =
    useState<ProductSummaryResponse[]>([]);

  const [latestProducts, setLatestProducts] =
    useState<PageResponseProductSummaryResponse>(
      {} as PageResponseProductSummaryResponse
    );

  const [recommendedProducts, setRecommendedProducts] = useState<
    ProductSummaryResponse[]
  >([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // ⭐ Lấy sản phẩm bán chạy
        const best = await UserProductControllerService.getBestSellingProducts();
        setBestSellingProducts(best);

        // ⭐ Lấy sản phẩm mới nhất
        const latest = await UserProductControllerService.getLatestProducts(0, 8);
        setLatestProducts(latest);

        // ⭐ Nếu chưa đăng nhập -> dừng
        if (!isAuthenticated) return;

        // ⭐ 1. Lấy lịch sử mua hàng
        const historyResp = await OrderService.getOrderHistory();

        if (!historyResp || historyResp.length === 0) return;

        // ⭐ 2. Gửi AI recommend
        const suggestResp = await RecommandService.getRecommend(historyResp);

        if (!suggestResp || suggestResp.length === 0) return;

        // ⭐ 3. Lấy chi tiết sản phẩm theo Id mà AI trả về
        const detailedProducts: ProductSummaryResponse[] = [];

        for (const item of suggestResp) {
          const product =
            await UserProductControllerService.getProductById1(
              item.productId
            );
          detailedProducts.push(product);
        }

        setRecommendedProducts(detailedProducts);

      } catch (err) {
        logger.log("Lỗi khi fetch HomePage", err);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  return (
    <>
      <img
        src="/dat1.jpg"
        className="w-full h-[500px] object-cover"
        alt="carousel"
      />

      {/* Gợi ý riêng */}
      {isAuthenticated && recommendedProducts.length > 0 && (
        <div className="lg:w-3/4 mx-auto">
          <h3 className="text-2xl font-bold text-center p-10 text-blue-600">
            Gợi ý dành riêng cho bạn
          </h3>

          <ProductCollection products={recommendedProducts} />
        </div>
      )}

      {/* Mới nhất */}
      <div className="lg:w-3/4 mx-auto">
        <h3 className="text-2xl font-bold p-10 text-center">
          Sản phẩm mới nhất
        </h3>

        {latestProducts.content ? (
          <ProductCollection products={latestProducts.content} />
        ) : (
          <ProductCollectionPreload />
        )}
      </div>

      {/* Bán chạy */}
      <div className="lg:w-3/4 mx-auto">
        <h3 className="text-2xl font-bold p-10 text-center">Sản phẩm bán chạy</h3>

        {bestSellingProducts.length > 0 ? (
          <ProductCollection products={bestSellingProducts} />
        ) : (
          <ProductCollectionPreload />
        )}
      </div>

      
    </>
  );
}
