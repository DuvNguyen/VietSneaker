"use client";
import PageController from "@/app/components/common/page-controller";
import {
  AdminProductControllerService,
  AdminProductResponse,
  PageAdminProductResponse,
} from "@/gen";
import React, { ChangeEvent, useEffect } from "react";
import Link from "next/link";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import DataTable from "@/app/components/common/data-table";
import ProductTableRow from "./product-table-row";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function ProductAdminPage() {
  const fetchProducts = async () => {
    try {
      const resp = await AdminProductControllerService.getAllProducts(
        page - 1,
        undefined,
        query,
      );
      if (pageInfo) setPageInfo(resp);
      return pageInfo;
    } catch (error) {
      console.warn(error);
    }
  };
  const { pageInfo, setPage, query, setQuery, setPageInfo, page } =
    usePageSearch<PageAdminProductResponse>({
      fetchData: fetchProducts,
    });
  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }
  return (
    <AdminMainCard title="Sản phẩm" goBack={false}>
      <div className="flex justify-between items-center mb-6">
        <Link href={"/admin/products/new"}>
          <PrimaryButton>
            <i className="fa fa-add"></i>
            <span>&nbsp;Thêm mới</span>
          </PrimaryButton>
        </Link>
      </div>

      <div className="flex flex-col gap-2 items-center">
        {/*
         * Search filter
         */}
        <div className="relative flex items-center w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            value={query}
            onChange={(event) => setQuery(event?.target.value)}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Tìm kiếm"
          />
        </div>

        {/*
         * Display list of brand
         */}
        <DataTable<AdminProductResponse>
          data={pageInfo?.content || []}
          emptyMessage="Không tìm thấy sản phẩm nào"
          headers={[
            "Mã sản phẩm",
            "Hình ảnh",
            "Tên sản phẩm",
            "Giá gốc",
            "Giá bán",
            "Còn lại",
            "Loại",
            "Thương hiệu",
          ]}
          renderRow={(item, index) => (
            <ProductTableRow
              key={index}
              item={item}
              refreshCallBack={fetchProducts}
            />
          )}
        />

        {/*
         * Pagination controller
         */}
        <PageController setPage={setPage} page={pageInfo} />
      </div>
    </AdminMainCard>
  );
}
