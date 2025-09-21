"use client";

import PageController from "@/app/components/common/page-controller";
import ProductCollection from "@/app/components/product/product-collection";
import {
  AdminBrandControllerService,
  BrandDTO,
  PageResponseProductSummaryResponse,
  UserProductControllerService,
} from "@/gen";
import { useLazyPage } from "@/lib/hooks/use-lazy-load";
import { usePage } from "@/lib/hooks/use-page-search";
import { logger } from "@/util/logger";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductByBrandPage() {
  const searchParam = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParam.get("sortBy") ?? "");
  const [searchBrandId, setSearchBrandId] = useState(
    searchParam.get("brandId") ? Number(searchParam.get("brandId")) : undefined,
  );
  const brandName = searchParam.get("brandName") ?? "";
  const { fetchMore, pageInfo: brandPage } = useLazyPage<BrandDTO>({
    fetchData: async (page, query) => {
      return await AdminBrandControllerService.getAllBrands(
        page,
        undefined,
        query,
      );
    },
  });

  function handleBrandChange(brand: BrandDTO): void {
    setSearchBrandId(brand.brandId);
  }

  const fetchProducts = async () => {
    try {
      const resp = await UserProductControllerService.getAllProducts1(
        undefined,
        16,
        undefined,
        undefined,
        undefined,
        searchBrandId,
        sortBy,
      );
      setProductPage(resp);
    } catch (error) {
      logger.warn(error);
    }
  };
  const {
    pageInfo: productPage,
    setPage,
    setPageInfo: setProductPage,
  } = usePage<PageResponseProductSummaryResponse>({
    fetchData: fetchProducts,
    dependencies: [searchBrandId, sortBy],
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-full p-10 ">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div>
            {brandPage?.content && (
              <div>
                <h2 className="text-lg font-bold">Nhãn hiệu {brandName}</h2>
                <div className="filter my-4">
                  <input
                    className="btn filter-reset btn-sm"
                    type="radio"
                    name="metaframeworks"
                    aria-label="All"
                    onClick={() => handleBrandChange({} as BrandDTO)}
                  />

                  {brandPage?.content.map((brand, idx) => {
                    return (
                      <input
                        key={idx}
                        className="btn btn-sm"
                        type="radio"
                        name="metaframeworks"
                        aria-label={brand.name}
                        onChange={() => handleBrandChange(brand)}
                      />
                    );
                  })}
                  <u
                    className="text-sm inline-block my-auto"
                    onClick={fetchMore}
                  >
                    Xem thêm nhãn hiệu khác
                  </u>
                </div>
              </div>
            )}
          </div>
          <div></div>

          <select
            className="select select-bordered w-40"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="sellPrice-asc">Giá: tăng dần</option>
            <option value="sellPrice-desc">Giá: giảm dần</option>
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
          </select>
        </div>
        <div className="my-20">
          <ProductCollection products={productPage.content || []} />
        </div>
        <PageController setPage={setPage} page={productPage} />
      </div>
    </div>
  );
}
