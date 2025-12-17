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
      {/* Cải tiến: Thêm padding, shadow và bo góc cho nội dung chính */}
      <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">

        {/* 🛠️ Thanh công cụ (Tìm kiếm & Thêm mới) */}
        {/* Cải tiến: Di chuyển nút thêm mới lên ngang hàng tìm kiếm */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          
          {/* 🔍 Thanh tìm kiếm */}
          <div className="w-full md:w-3/5 lg:w-2/5">
            <div className="relative">
              <div className="flex items-center border border-gray-300 bg-white h-11 px-3 rounded-lg shadow-sm">
                <i className="fa fa-search mr-2 text-gray-400"></i>
                <input
                  value={query || ""}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full focus:outline-none text-sm text-gray-700 bg-white placeholder-gray-400"
                  placeholder="Tìm kiếm nhà cung cấp..."
                />
              </div>
            </div>
          </div>
          
          {/* Nút thêm mới */}
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

        {/* 📋 Bảng danh sách nhà cung cấp */}
        {/* Cải tiến: Thêm overflow-x và viền cho bảng */}
        <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full border-collapse table-auto text-left text-[14px]">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center w-[6%] font-semibold">Mã</th>
                <th className="p-3 border-b border-gray-300 text-center w-[15%] font-semibold">Tên</th>
                <th className="p-3 border-b border-gray-300 text-center w-[18%] font-semibold">Địa chỉ</th>
                <th className="p-3 border-b border-gray-300 text-center w-[12%] font-semibold">SĐT</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%] font-semibold">Email</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%] font-semibold">Loại</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%] font-semibold">Zalo</th>
                <th className="p-3 border-b border-gray-300 text-center w-[10%] font-semibold">Facebook</th>
                <th className="p-3 border-b border-gray-300 text-center w-[5%] font-semibold">Đánh giá</th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%] font-semibold">Sửa</th>
                <th className="p-3 border-b border-gray-300 text-center w-[4%] font-semibold">Xóa</th>
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
                  {/* Thay đổi colSpan thành 11 */}
                  <td
                    colSpan={11} 
                    className="text-center py-10 text-gray-500 italic bg-gray-50"
                  >
                    Không tìm thấy nhà cung cấp nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Bộ điều khiển phân trang */}
        {/* Cải tiến: Tăng khoảng cách trên */}
        <div className="w-full mt-8 flex justify-center items-center">
          <PageController setPage={setPage} page={pageInfo} />
        </div>

        {/* Cải tiến: Loại bỏ div "Nút thêm mới" cũ nếu không dùng */}
        {/*
        <div className="w-full mt-6 flex justify-end pr-2">
          ... đã được di chuyển lên trên
        </div>
        */}
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