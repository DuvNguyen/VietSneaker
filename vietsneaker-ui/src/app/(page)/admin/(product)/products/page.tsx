"use client";

import PageController from "@/app/components/common/page-controller";
import {
  AdminProductControllerService,
  AdminProductResponse,
  PageAdminProductResponse,
} from "@/gen";
import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import DataTable from "@/app/components/common/data-table";
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
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
          </div>
        </div>

        {/* 📋 Bảng danh sách sản phẩm */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse table-fixed text-left text-[15px]">
            <thead className="bg-[#ffcccc] text-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center">Mã sản phẩm</th>
                <th className="p-3 border-b border-gray-300 text-center">Hình ảnh</th>
                <th className="p-3 border-b border-gray-300 text-center">Tên sản phẩm</th>
                <th className="p-3 border-b border-gray-300 text-center">Giá gốc</th>
                <th className="p-3 border-b border-gray-300 text-center">Giá bán</th>
                <th className="p-3 border-b border-gray-300 text-center">Còn lại</th>
                <th className="p-3 border-b border-gray-300 text-center">Loại</th>
                <th className="p-3 border-b border-gray-300 text-center">Thương hiệu</th>
                <th className="p-3 border-b border-gray-300 text-center">Sửa</th>
                <th className="p-3 border-b border-gray-300 text-center">Xóa</th>

              </tr>
            </thead>
            <tbody>
              {(pageInfo?.content || []).map((item: AdminProductResponse, index: number) => (
                <ProductTableRow
                  key={index}
                  item={item}
                  refreshCallBack={fetchProducts}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* 📄 Bộ điều khiển phân trang */}
        <div className="w-full mt-5 flex justify-center items-center rounded-none">
          <PageController setPage={setPage} page={pageInfo} />
        </div>

        {/* ➕ Nút thêm mới */}
        <div className="w-full mt-6 flex justify-end pr-2">
          <div className="cursor-pointer inline-block">
            <Link href="/admin/products/new">
              <PrimaryButton className="!bg-[#e20000] hover:!bg-[#c10000] text-white font-semibold px-6 py-3 rounded-none transition-transform duration-200 hover:-translate-y-[1px]">
                <i className="fa fa-add mr-2 text-sm"></i>
                <span>Thêm mới</span>
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </AdminMainCard>
  );
}
