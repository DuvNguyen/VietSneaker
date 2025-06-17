"use client";

import PageController from "@/app/components/common/page-controller";
import {
  AdminSupplierControllerService,
  PageSupplierDTO,
  SupplierDTO,
} from "@/gen";
import React, { ChangeEvent, useState } from "react";
import CreateSupplierModal from "./components/create-supplier-modal";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import SupplierTableRow from "./components/supplier-table-row";
import DataTable from "@/app/components/common/data-table";
import Search from "@/app/components/form/search";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function SupplierAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const pageInfo = await AdminSupplierControllerService.getAllSuppliers(
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
    usePageSearch<PageSupplierDTO>({
      fetchData: fetchSuppliers,
    });

  return (
    <AdminMainCard title="Nhà cung cấp" goBack={false}>
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
        <Search
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {/*
         * Add new supplier button
         */}
        <CreateSupplierModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          refreshCallBack={fetchSuppliers}
        />

        {/*
         * Display list of brand
         */}
        <DataTable<SupplierDTO>
          data={pageInfo?.content || []}
          emptyMessage="Không tìm thấy nhà cung cấp nào"
          headers={[
            "Mã nhà cung cấp",
            "Tên",
            "Địa chỉ",
            "Số điện thoại",
            "Email",
          ]}
          renderRow={(item) => (
            <SupplierTableRow
              key={item.supplierId}
              item={item}
              refreshCallBack={fetchSuppliers}
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
