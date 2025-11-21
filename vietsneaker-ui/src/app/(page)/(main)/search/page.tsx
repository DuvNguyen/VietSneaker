"use client";

import PageController from "@/app/components/common/page-controller";
import ProductCollection from "@/app/components/product/product-collection";
import { UNIT } from "@/config/app-config";
import {
  AdminBrandControllerService,
  BrandControllerService,
  BrandDTO,
  PageResponseProductSummaryResponse,
  UserProductControllerService,
} from "@/gen";
import { useLazyPage } from "@/lib/hooks/use-lazy-load";
import { usePage } from "@/lib/hooks/use-page-search";
import { formatVND } from "@/util/currency";
import { logger } from "@/util/logger";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

const types = ["Specialty", "General", "Luxury", "Local"];
const DEFAULT_MAX_PRICE = 100;
const MAX_PRICE = 500;

type FilterProps = {
  type: string;
  brand: BrandDTO;
  minPrice: number;
  maxPrice: number;
};
export default function ProductFilterPage() {
  const searchParam = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParam.get("name") ?? "");
  const [sortBy, setSortBy] = useState(searchParam.get("sortBy") ?? "");
  const [selectedFilters, setSelectedFilters] = useState<FilterProps>({
    type: searchParam.get("type") ?? "",
    minPrice: Number(searchParam.get("minPrice") ?? 0),
    brand: {
      brandId: searchParam.get("brandId")
        ? Number(searchParam.get("brandId"))
        : undefined,
      name: "",
    },
    maxPrice: Number(searchParam.get("maxPrice") ?? DEFAULT_MAX_PRICE),
  });

  // add useEffect to update searchbar param everytime
  useEffect(() => {
  setSearchTerm(searchParam.get("name") ?? "");
  setSortBy(searchParam.get("sortBy") ?? "");
  }, [searchParam]);

  const fetchProducts = async () => {
    try {
      const resp = await UserProductControllerService.getAllProducts1(
        undefined,
        12,
        searchTerm,
        selectedFilters.type,
        selectedFilters.maxPrice * UNIT,
        selectedFilters.brand.brandId,
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
    dependencies: [searchTerm, selectedFilters, sortBy],
  });

  const handleSearchTermChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    300,
  );
  return (
    <div className="flex">
      <FilterSidebar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <div className="flex flex-col w-full mx-20 mt-10">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4 ">
          {/* <label className="input ">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              defaultValue={searchTerm}
              placeholder="Search product name"
              onChange={handleSearchTermChange}
            />
          </label> */}
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

type FilterSidebarProps = {
  selectedFilters: FilterProps;
  setSelectedFilters: Dispatch<SetStateAction<FilterProps>>;
};
const FilterSidebar = ({
  selectedFilters,
  setSelectedFilters,
}: FilterSidebarProps) => {
  const { fetchMore, pageInfo } = useLazyPage<BrandDTO>({
    fetchData: async (page, query) => {
      return await BrandControllerService.getAllBrands1(page, undefined, query);
    },
  });
  const brandPage = pageInfo;

  function handleBrandChange(brand: BrandDTO): void {
    setSelectedFilters((prev) => ({
      ...prev,
      brand: brand,
    }));
  }

  const handleMaxPriceChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedFilters((prev) => ({
        ...prev,
        maxPrice: Number(event.target.value),
      }));
    },
    300,
  );

  return (
    <div className="w-80 p-4 bg-base-200 h-screen overflow-auto">
      <form className="form-control space-y-4 pt-20">
        {/*
          * TODO manager search for product type
        <div>
          <h2 className="text-lg font-bold">Types</h2>
          <div className="filter my-4">
            <input className="btn filter-reset btn-sm" type="radio" name="metaframeworks" aria-label="All"
              onClick={() => handleTypeChange('')}
            />

            {types.map((type: string) => {
              return (
                <input key={type} className="btn btn-sm" type="radio" name="metaframeworks" aria-label={type}
                  onChange={() => handleTypeChange(type)}
                />
              )
            })}
          </div>
        </div>
          */}

        {brandPage?.content && (
          <div>
            <h2 className="text-lg font-bold">Nhãn hiệu</h2>
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
              <u className="text-sm" onClick={fetchMore}>
                Xem thêm nhãn hiệu khác
              </u>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold">Price Range</h2>
          <label className="label">
            <span className="label-text">
              Giá nhỏ hơn: {formatVND(selectedFilters.maxPrice * UNIT)}
            </span>
          </label>
          <input
            type="range"
            onChange={handleMaxPriceChange}
            min="0"
            // value={selectedFilters.maxPrice}
            defaultValue={DEFAULT_MAX_PRICE}
            max={MAX_PRICE}
            className="range range-sm"
            id="priceRange"
          />
        </div>
      </form>
    </div>
  );
};
