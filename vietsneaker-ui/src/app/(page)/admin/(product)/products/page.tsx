"use client";

import PageController from "@/app/components/common/page-controller";
import {
  AdminProductControllerService,
  AdminProductResponse,
  PageAdminProductResponse,
} from "@/gen";
import React, { ChangeEvent } from "react";
import Link from "next/link";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import ProductTableRow from "./product-table-row";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function ProductAdminPage() {
  const { pageInfo, setPage, query, setQuery, setPageInfo, page } =
    usePageSearch<PageAdminProductResponse>({
      fetchData: fetchProducts,
    });

  async function fetchProducts() {
    try {
      const resp = await AdminProductControllerService.getAllProducts(
        page - 1,
        undefined,
        query
      );
      if (resp) setPageInfo(resp);
      return resp;
    } catch (error) {
      console.warn(error);
    }
  }

  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return (
    <AdminMainCard title="SẢN PHẨM" goBack={false}>
      {/* Wrapper giống Supplier */}
      <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">

        {/* 🔍 Search + ➕ Thêm mới */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          
          {/* Search */}
          <div className="w-full md:w-3/5 lg:w-2/5">
            <div className="flex items-center border border-gray-300 bg-white h-11 px-3 rounded-lg shadow-sm">
              <i className="fa fa-search mr-2 text-gray-400"></i>
              <input
                value={query || ""}
                onChange={onChangeSearchQuery}
                className="w-full focus:outline-none text-sm text-gray-700 bg-white placeholder-gray-400"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
          </div>

          {/* Nút thêm */}
          <div className="w-full md:w-auto flex justify-end">
            <Link href="/admin/products/new" className="w-full md:w-auto">
              <PrimaryButton className="w-full md:w-auto !bg-[#e20000] hover:!bg-[#c10000] text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                <i className="fa fa-add mr-2 text-sm"></i>
                <span>Thêm mới</span>
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* 📋 Bảng danh sách sản phẩm */}
        <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full border-collapse table-auto text-left text-[14px]">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Mã
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Hình ảnh
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Tên sản phẩm
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Giá gốc
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Giá bán
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Còn lại
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Loại
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Thương hiệu
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold w-[6%]">
                  Sửa
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold w-[6%]">
                  Xóa
                </th>
              </tr>
            </thead>

            <tbody>
              {(pageInfo?.content ?? []).length > 0 ? (
                pageInfo?.content?.map(
                  (item: AdminProductResponse) => (
                    <ProductTableRow
                      key={item.productId}
                      item={item}
                      refreshCallBack={fetchProducts}
                    />
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-10 text-gray-500 italic bg-gray-50"
                  >
                    Không tìm thấy sản phẩm nào
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
    </AdminMainCard>
  );
}
