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
import Search from "@/app/components/form/search";
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
        <div className="w-full min-h-screen flex flex-col items-center bg-white px-10 py-5">

          {/* 🔍 Thanh tìm kiếm */}
          <div className="w-full flex justify-center mb-5">
            <div className="w-full max-w-[500px]">
              <div className="flex items-center border border-gray-300 bg-white h-10 px-3 rounded-none shadow-none">
                <i className="fa fa-search mr-2 text-gray-500"></i>
                <input
                  value={query || ""}
                  onChange={onChangeSearchQuery}
                  className="w-full focus:outline-none text-sm text-gray-700"
                  placeholder="Tìm kiếm thương hiệu..."
                />
              </div>
            </div>
          </div>


          {/* 🪄 Modal thêm thương hiệu */}
          <CreateBrandModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            refreshCallBack={fetchBrands}
          />

          {/* 📋 Bảng danh sách thương hiệu */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse table-fixed text-left text-[15px]">
              <thead className="bg-[#ffcccc] text-gray-800">
                <tr>
                  <th className="p-3 border-b border-gray-300 text-center">Mã thương hiệu</th>
                  <th className="p-3 border-b border-gray-300 text-center">Tên thương hiệu</th>
                  <th className="p-3 border-b border-gray-300 text-center">Sửa</th>
                  <th className="p-3 border-b border-gray-300 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {(pageInfo.content || []).map((item: BrandDTO, index: number) => (
                  <BrandTableRow
                    key={index}
                    item={item}
                    refreshCallBack={fetchBrands}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Bộ điều khiển phân trang */}
          <div className="w-full mt-5 flex justify-center items-center rounded-none">
            <PageController
              setPage={(page: number) => setPage(page)}
              page={pageInfo}
            />
          </div>

          {/* ➕ Nút thêm mới */}
          <div className="w-full mt-6 flex justify-end pr-2">
            <div
              className="cursor-pointer inline-block"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PrimaryButton className="!bg-[#e20000] hover:!bg-[#c10000] text-white font-semibold px-6 py-3 rounded-none transition-transform duration-200 hover:-translate-y-[1px]">
                <i className="fa fa-add mr-2 text-sm"></i>
                <span>Thêm mới</span>
              </PrimaryButton>
            </div>
          </div>
        </div>
      </AdminMainCard>
    </ProductAdminRoute>
  );
}
