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
        dateFormatString(endDate),
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
    <>
      <AdminMainCard title="Lịch sử nhập hàng">
        <div className="flex flex-row space-x-20">
          <div>
            <div className="text-sm text-gray-600">
              <p>
                Từ ngày:{" "}
                {startDate ? startDate.toLocaleDateString() : "chưa chọn"}
              </p>
              <p>
                Đến ngày:{" "}
                {endDate ? endDate.toLocaleDateString() : "Not selected"}
              </p>
            </div>
            <div>
              <DateRangePicker
                ranges={ranges} // Pass the constructed ranges object
                onChange={handleSelect} // Update state on selection
                // showSelectionPreview={true} // Optional: Show preview of selected range
                moveRangeOnFirstSelection={false} // Optional: Prevent auto-moving range
              />
            </div>
          </div>
          <div className="">
            <Link href={"/admin/purchases/new"}>
              <PrimaryButton>
                <i className="fa fa-add"></i>
                <span>&nbsp;Nhập hàng</span>
              </PrimaryButton>
            </Link>
            <div className="flex-1 w-full flex p-4">
              <DataTable<PurchaseSummary>
                data={purchasePage.content || []}
                emptyMessage="Không có dữ liệu"
                headers={[
                  "Mã nhập hàng", // Image
                  "Thời gian tạo",
                  "Người tạo",
                  "Thành tiền",
                  "", // Edit
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
            {!purchasePage.empty && (
              <PageController setPage={setPage} page={purchasePage} />
            )}
          </div>
        </div>
      </AdminMainCard>
    </>
  );
};

export default PurchasesPage;
