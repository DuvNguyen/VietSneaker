"use client";

import PageController from "@/app/components/common/page-controller";
import { AdminBrandControllerService, BrandDTO, PageBrandDTO } from "@/gen";
import React, { ChangeEvent, useState } from "react";
import CreateBrandModal from "./components/create-brand-modal";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import DataTable from "@/app/components/common/data-table";
import Search from "@/app/components/form/search";
import { ProductAdminRoute } from "@/app/components/route/protected";
import BrandTableRow from "./components/brand-table-row";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function BrandAdminPage() {
  const fetchBrands = async () => {
    try {
      const pageInfo = await AdminBrandControllerService.getAllBrands(
        page - 1,
        undefined,
        query,
      );
      if (pageInfo) setPageInfo(pageInfo);
      return pageInfo;
    } catch (error) {
      console.warn(error);
    }
  };
  const { pageInfo, setPage, query, setQuery, setPageInfo, page } =
    usePageSearch<PageBrandDTO>({
      fetchData: fetchBrands,
    });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return (
    <ProductAdminRoute>
      <AdminMainCard title="Thương hiệu" goBack={false}>
        <div className="flex justify-between items-center mb-6">
          <div onClick={() => setIsAddModalOpen(true)}>
            <PrimaryButton>
              <i className="fa fa-add"></i>
              <span>&nbsp;Thêm mới</span>
            </PrimaryButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center">
          {/*
           * Search filter
           */}
          <Search value={query || ""} onChange={onChangeSearchQuery} />

          {/*
           * Add new brand button
           */}
          <CreateBrandModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            refreshCallBack={fetchBrands}
          />

          {/*
           * Display list of brand
           */}
          <DataTable<BrandDTO>
            data={pageInfo.content || []}
            headers={["Mã thương hiệu", "Tên thương hiệu"]}
            renderRow={(item, index) => {
              return (
                <BrandTableRow
                  key={index}
                  item={item}
                  refreshCallBack={fetchBrands}
                />
              );
            }}
          />

          {/*
           * Pagination controller
           */}
          <PageController
            setPage={(page: number) => {
              setPage(page);
            }}
            page={pageInfo}
          />
        </div>
      </AdminMainCard>
    </ProductAdminRoute>
  );
}
