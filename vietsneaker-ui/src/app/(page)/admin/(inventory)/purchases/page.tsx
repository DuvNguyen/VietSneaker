"use client";
import AdminMainCard from "@/app/components/card/admin-card";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import DataTable from "@/app/components/common/data-table";
import {
  AdminPurchaseControllerService,
  PageResponsePurchaseSummary,
  PurchaseSummary,
} from "@/gen";
import { usePage } from "@/lib/hooks/use-page-search";
import { logger } from "@/util/logger";
import React, { useState } from "react";
import PurchaseSummaryTableRow from "./components/purchase-summary-table-row";
import Link from "next/link";
import PrimaryButton from "@/app/components/button/button";
import PageController from "@/app/components/common/page-controller";
import { dateFormatString } from "@/util/date-utils";

const PurchasesPage = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const ranges = [{ startDate, endDate, key: "selection" }];

  const fetchPurcharses = async () => {
    try {
      const resp = await AdminPurchaseControllerService.getPurchaseHistory(
        page - 1,
        undefined,
        dateFormatString(startDate),
        dateFormatString(endDate)
      );
      setPurchasetPage(resp);
    } catch (error) {
      logger.warn(error);
    }
  };

  const {
    pageInfo: purchasePage,
    page,
    setPage,
    setPageInfo: setPurchasetPage,
  } = usePage<PageResponsePurchaseSummary>({
    fetchData: fetchPurcharses,
    dependencies: [endDate, startDate],
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setStartDate(selection.startDate);
    setEndDate(selection.endDate);
  };

  return (
    <AdminMainCard title="LỊCH SỬ NHẬP HÀNG">
      <div className="flex flex-col gap-6">
        {/* 🔹 Bộ lọc thời gian + Nút nhập hàng */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-2">
                Chọn khoảng thời gian
              </h3>
              <DateRangePicker
                ranges={ranges}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                rangeColors={["#e20000"]}
              />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-700">Từ:</span>{" "}
                {startDate ? startDate.toLocaleDateString() : "Chưa chọn"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Đến:</span>{" "}
                {endDate ? endDate.toLocaleDateString() : "Chưa chọn"}
              </p>
            </div>
          </div>

          {/* Nút nhập hàng */}
          <div className="mt-4 lg:mt-0">
            <Link href="/admin/purchases/new">
              <PrimaryButton className="!bg-[#e20000] hover:!bg-[#c10000] px-6 py-3 text-white font-semibold rounded-lg shadow-sm transition-transform hover:-translate-y-[1px]">
                <i className="fa fa-add mr-2"></i>
                Nhập hàng
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* 🔹 Bảng dữ liệu */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <DataTable<PurchaseSummary>
            data={purchasePage.content || []}
            emptyMessage="Không có dữ liệu nhập hàng trong khoảng thời gian này"
            headers={[
              "Mã nhập hàng",
              "Thời gian tạo",
              "Người tạo",
              "Thành tiền",
              "",
            ]}
            renderRow={(item, index) => (
              <PurchaseSummaryTableRow
                key={index}
                item={item}
                onDelete={() => {}}
                onChange={() => {}}
              />
            )}
          />
        </div>

        {/* 🔹 Phân trang */}
        {!purchasePage.empty && (
          <div className="flex justify-center">
            <PageController setPage={setPage} page={purchasePage} />
          </div>
        )}
      </div>
    </AdminMainCard>
  );
};

export default PurchasesPage;
