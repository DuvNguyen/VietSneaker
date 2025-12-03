"use client";

import PageController from "@/app/components/common/page-controller";
import {
  AdminSupplierControllerService,
  PageSupplierDTO,
  SupplierDTO,
} from "@/gen";
import React, { useState } from "react";
import CreateSupplierModal from "./components/create-supplier-modal";
import AdminMainCard from "@/app/components/card/admin-card";
import PrimaryButton from "@/app/components/button/button";
import SupplierTableRow from "./components/supplier-table-row";
import { usePageSearch } from "@/lib/hooks/use-page-search";

export default function SupplierAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const pageInfo = await AdminSupplierControllerService.getAllSuppliers(
        page - 1,
        undefined,
        query
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
    <AdminMainCard title="NHÀ CUNG CẤP" goBack={false}>
      <div className="w-full min-h-screen flex flex-col items-center bg-white px-10 py-5">
        {/* 🔍 Thanh tìm kiếm */}
        <div className="w-full flex justify-center mb-5">
          <div className="w-full max-w-[500px]">
            <div className="flex items-center border border-gray-300 bg-white h-10 px-3 rounded-none shadow-none">
              <i className="fa fa-search mr-2 text-gray-500"></i>
              <input
                value={query || ""}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full focus:outline-none text-sm text-gray-700"
                placeholder="Tìm kiếm nhà cung cấp..."
              />
            </div>
          </div>
        </div>

        {/* 📋 Bảng danh sách nhà cung cấp */}
        <div className="w-full">
          <table className="w-full border-collapse table-fixed text-left text-[15px]">
            {/* <thead className="bg-[#ffcccc] text-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center w-[8%]">
                  Mã NCC
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[20%]">
                  Tên
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[28%]">
                  Địa chỉ
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[15%]">
                  Số điện thoại
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[20%]">
                  Email
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%]">
                  Sửa
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%]">
                  Xóa
                </th>
              </tr>
            </thead> */}
            <thead className="bg-[#ffcccc] text-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center w-[6%]">Mã</th>
                <th className="p-3 border-b border-gray-300 text-center w-[15%]">Tên</th>
                <th className="p-3 border-b border-gray-300 text-center w-[18%]">Địa chỉ</th>
                <th className="p-3 border-b border-gray-300 text-center w-[12%]">SĐT</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%]">Email</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%]">Loại</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%]">Zalo</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%]">Facebook</th>
                <th className="p-3 border-b border-gray-300 text-center w-[5%]">⭐</th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%]">Sửa</th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%]">Xóa</th>
              </tr>
            </thead>


            <tbody>
              {(pageInfo?.content ?? []).length > 0 ? (
                pageInfo?.content?.map((item) => (
                  <SupplierTableRow
                    key={item.supplierId}
                    item={item}
                    refreshCallBack={fetchSuppliers}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Không tìm thấy nhà cung cấp nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Bộ điều khiển phân trang */}
        <div className="w-full mt-5 flex justify-center items-center rounded-none">
          <PageController setPage={setPage} page={pageInfo} />
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

      {/* 🪄 Modal thêm mới */}
      <CreateSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        refreshCallBack={fetchSuppliers}
      />
    </AdminMainCard>
  );
}
