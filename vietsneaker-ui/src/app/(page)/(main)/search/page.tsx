"use client";

import PageController from "@/app/components/common/page-controller";
import ProductCollection from "@/app/components/product/product-collection";
import { UNIT } from "@/config/app-config";
import {
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
  shoeSize: string;
};

export default function ProductFilterPage() {
  const searchParam = useSearchParams();
  
  // State quản lý Search Term và Sort
  const [searchTerm, setSearchTerm] = useState(searchParam.get("name") ?? "");
  const [sortBy, setSortBy] = useState(searchParam.get("sortBy") ?? "");

  // State quản lý bộ lọc
  const [selectedFilters, setSelectedFilters] = useState<FilterProps>({
    type: searchParam.get("type") ?? "",
    minPrice: Number(searchParam.get("minPrice") ?? 0),
    brand: {
      brandId: searchParam.get("brandId") ? Number(searchParam.get("brandId")) : undefined,
      name: "",
    },
    maxPrice: Number(searchParam.get("maxPrice") ?? DEFAULT_MAX_PRICE),
    shoeSize: searchParam.get("shoeSize") ?? "",
  });

  // --- PHẦN SỬA ĐỔI QUAN TRỌNG NHẤT ---
  // Khi URL thay đổi (nhấn từ Header), ta phải RESET lại filter theo đúng URL đó
  // Không dùng "...prev" để tránh bị dính filter cũ không mong muốn
  useEffect(() => {
    const paramName = searchParam.get("name") ?? "";
    const paramSort = searchParam.get("sortBy") ?? "";
    const paramType = searchParam.get("type") ?? "";
    const paramBrandId = searchParam.get("brandId");
    const paramShoeSize = searchParam.get("shoeSize") ?? "";
    const paramMinPrice = searchParam.get("minPrice");
    const paramMaxPrice = searchParam.get("maxPrice");

    setSearchTerm(paramName);
    setSortBy(paramSort);

    // Reset trọn vẹn bộ lọc
    setSelectedFilters({
      type: paramType,
      shoeSize: paramShoeSize, // Lấy size mới nhất từ URL
      
      // Brand: Nếu URL không có brandId -> Trả về undefined (Reset brand cũ)
      brand: {
        brandId: paramBrandId ? Number(paramBrandId) : undefined,
        name: "", 
      },
      
      minPrice: paramMinPrice ? Number(paramMinPrice) : 0,
      maxPrice: paramMaxPrice ? Number(paramMaxPrice) : DEFAULT_MAX_PRICE,
    });
  }, [searchParam]);
  // -------------------------------------

  const fetchProducts = async () => {
    try {
      // Đảm bảo thứ tự tham số đúng với Service gen ra (đã sửa ở bước trước)
      const resp = await UserProductControllerService.getAllProducts1(
        undefined, // page
        12,        // size
        searchTerm,
        selectedFilters.type,
        selectedFilters.shoeSize, // shoeSize
        selectedFilters.maxPrice * UNIT,
        selectedFilters.brand.brandId,
        sortBy
      );
      setProductPage(resp);
    } catch (error) {
      logger.warn(error);
      // Nếu lỗi, set trang rỗng để tránh màn hình trắng xoá (crash)
      setProductPage({ content: [], totalPages: 0, totalElements: 0 });
    }
  };

  const {
    pageInfo: productPage,
    setPage,
    setPageInfo: setProductPage,
  } = usePage<PageResponseProductSummaryResponse>({
    fetchData: fetchProducts,
    // Khi bất kỳ điều kiện nào thay đổi, gọi lại API
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
         <div className="flex gap-2 flex-wrap">
  
          {/* Tag Size */}
          {selectedFilters.shoeSize && (
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-sm bg-white shadow-sm">
              <span className="text-gray-700">Size: {selectedFilters.shoeSize}</span>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setSelectedFilters(prev => ({ ...prev, shoeSize: "" }))}
              >
                ✕
              </button>
            </div>
          )}

          {/* Tag Brand – HIỂN THỊ TÊN HÃNG */}
          {selectedFilters.brand?.brandId && (
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-sm bg-white shadow-sm">
              <span className="text-gray-700">
                {selectedFilters.brand.name}
              </span>

              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setSelectedFilters(prev => ({
                  ...prev,
                  brand: { brandId: undefined, name: "" }
                }))}
              >
                ✕
              </button>
            </div>
          )}

        </div>


          <select
            className="select select-bordered w-40"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sắp xếp</option>
            <option value="sellPrice-asc">Giá: thấp đến cao</option>
            <option value="sellPrice-desc">Giá: cao đến thấp</option>
            <option value="createdAt-desc">Mới nhất</option>
          </select>
        </div>
        
        <div className="my-10">
          {/* Kiểm tra null/undefined để tránh crash */}
          {productPage && productPage.content && productPage.content.length > 0 ? (
             <ProductCollection products={productPage.content} />
          ) : (
             <div className="text-center py-10 text-gray-500">
               Không tìm thấy sản phẩm nào phù hợp.
             </div>
          )}
        </div>

        <PageController setPage={setPage} page={productPage} />
      </div>
    </div>
  );
}

// --- Phần Sidebar giữ nguyên nhưng đảm bảo logic ---
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
      // Gọi service lấy danh sách brand
      return await BrandControllerService.getAllBrands1(page, undefined, query); 
    },
  });
  const brandPage = pageInfo;

  function handleBrandChange(brand: BrandDTO): void {
    // Khi chọn Brand từ Sidebar, ta giữ lại các filter khác (Size, Price)
    // Nhưng nếu muốn logic "Chọn Brand thì Reset Size" thì sửa ở đây
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
    <div className="w-80 p-4 bg-base-200 h-screen overflow-auto sticky top-0">
      <form className="form-control space-y-4 pt-20">
        {brandPage?.content && (
          <div>
            <h2 className="text-lg font-bold">Nhãn hiệu</h2>
            <div className="filter my-4 flex flex-col items-start gap-2">
               <label className="cursor-pointer label justify-start gap-2">
                  <input
                    className="radio radio-sm"
                    type="radio"
                    name="brands"
                    checked={!selectedFilters.brand?.brandId}
                    onChange={() => handleBrandChange({} as BrandDTO)}
                  />
                  <span className="label-text">Tất cả</span>
               </label>

              {brandPage?.content.map((brand, idx) => {
                return (
                   <label key={idx} className="cursor-pointer label justify-start gap-2">
                      <input
                        className="radio radio-sm"
                        type="radio"
                        name="brands"
                        checked={selectedFilters.brand?.brandId === brand.brandId}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="label-text">{brand.name}</span>
                   </label>
                );
              })}
              <u className="text-sm cursor-pointer mt-2 block" onClick={fetchMore}>
                Xem thêm nhãn hiệu khác
              </u>
            </div>
          </div>
        )}

        <div className="divider"></div>

        <div>
          <h2 className="text-lg font-bold">Khoảng giá</h2>
          <label className="label">
            <span className="label-text">
              Giá tối đa: {formatVND(selectedFilters.maxPrice * UNIT)}
            </span>
          </label>
          <input
            type="range"
            onChange={handleMaxPriceChange}
            min="0"
            defaultValue={selectedFilters.maxPrice} 
            max={MAX_PRICE}
            className="range range-xs"
            step="10"
          />
        </div>
      </form>
    </div>
  );
};