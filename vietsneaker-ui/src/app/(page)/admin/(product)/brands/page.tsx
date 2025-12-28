"use client";

import PageController from "@/app/components/common/page-controller";
import {
  AdminBrandControllerService,
  BrandDTO,
  PageBrandDTO,
} from "@/gen";
import React, { ChangeEvent, useState } from "react";
import CreateBrandModal from "./components/create-brand-modal";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import { ProductAdminRoute } from "@/app/components/route/protected";
import BrandTableRow from "./components/brand-table-row";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function BrandAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { pageInfo, setPage, query, setQuery, setPageInfo, page } =
    usePageSearch<PageBrandDTO>({
      fetchData: fetchBrands,
    });

  async function fetchBrands() {
    try {
      const pageInfo = await AdminBrandControllerService.getAllBrands(
        page - 1,
        undefined,
        query
      );
      if (pageInfo) setPageInfo(pageInfo);
      return pageInfo;
    } catch (error) {
      console.warn(error);
    }
  }

  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return (
    <ProductAdminRoute>
      <AdminMainCard title="THƯƠNG HIỆU" goBack={false}>
        {/* ✅ Wrapper giống Supplier */}
        <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">

          {/* 🔍 Search + ➕ Thêm mới (cùng hàng) */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            
            {/* Search */}
            <div className="w-full md:w-3/5 lg:w-2/5">
              <div className="flex items-center border border-gray-300 bg-white h-11 px-3 rounded-lg shadow-sm">
                <i className="fa fa-search mr-2 text-gray-400"></i>
                <input
                  value={query || ""}
                  onChange={onChangeSearchQuery}
                  className="w-full focus:outline-none text-sm text-gray-700 bg-white placeholder-gray-400"
                  placeholder="Tìm kiếm thương hiệu..."
                />
              </div>
            </div>

            {/* Nút thêm */}
            <div className="w-full md:w-auto flex justify-end">
              <div
                className="cursor-pointer inline-block w-full md:w-auto"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PrimaryButton className="w-full md:w-auto !bg-[#e20000] hover:!bg-[#c10000] text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                  <i className="fa fa-add mr-2 text-sm"></i>
                  <span>Thêm mới</span>
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* 📋 Bảng danh sách thương hiệu */}
          <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full border-collapse table-auto text-left text-[14px]">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-3 border-b border-gray-300 text-center w-[20%] font-semibold">
                    Mã thương hiệu
                  </th>
                  <th className="p-3 border-b border-gray-300 text-center font-semibold">
                    Tên thương hiệu
                  </th>
                  <th className="p-3 border-b border-gray-300 text-center w-[8%] font-semibold">
                    Sửa
                  </th>
                  <th className="p-3 border-b border-gray-300 text-center w-[8%] font-semibold">
                    Xóa
                  </th>
                </tr>
              </thead>

              <tbody>
                {(pageInfo?.content ?? []).length > 0 ? (
                  pageInfo?.content?.map((item: BrandDTO) => (
                    <BrandTableRow
                      key={item.brandId}
                      item={item}
                      refreshCallBack={fetchBrands}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-gray-500 italic bg-gray-50"
                    >
                      Không tìm thấy thương hiệu nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📄 Phân trang */}
          <div className="w-full mt-8 flex justify-center items-center">
            <PageController setPage={setPage} page={pageInfo} />
          </div>
        </div>

        {/* 🪄 Modal thêm mới */}
        <CreateBrandModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          refreshCallBack={fetchBrands}
        />
      </AdminMainCard>
    </ProductAdminRoute>
  );
}
