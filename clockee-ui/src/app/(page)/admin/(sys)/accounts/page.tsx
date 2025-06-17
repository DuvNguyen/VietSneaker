"use client";
import React from "react";
import AdminMainCard from "@/app/components/card/admin-card";
import DataTable from "@/app/components/common/data-table";
import {
  IamControllerService,
  PageResponseUserAccessDetailsResponse,
  UserAccessDetailsResponse,
} from "@/gen";
import { usePageSearch } from "@/lib/hooks/use-page-search";
import PageController from "@/app/components/common/page-controller";
import UserTableRow from "./components/user-access-table-row";
import Link from "next/link";
import PrimaryButton from "@/app/components/button/button";

export default function UserAccessPage() {
  const fetchUsers = async () => {
    try {
      const resp = await IamControllerService.getAllAccess(page - 1);
      if (pageInfo) setPageInfo(resp);
      return resp;
    } catch (err) {
      console.warn(err);
    }
  };

  const { pageInfo, setPage, setPageInfo, page } =
    usePageSearch<PageResponseUserAccessDetailsResponse>({
      fetchData: fetchUsers,
    });

  return (
    <AdminMainCard title="Quản lý tài khoản hệ thống" goBack={false}>
      <div className="flex justify-between items-center mb-6">
        <Link href={"/admin/accounts/new"}>
          <PrimaryButton>
            <i className="fa fa-add"></i>
            <span>&nbsp;Thêm mới</span>
          </PrimaryButton>
        </Link>
      </div>
      <div className="flex flex-col gap-2 items-center">
        {/*
         * Display list of brand
         */}
        <DataTable<UserAccessDetailsResponse>
          data={pageInfo.content || []}
          emptyMessage="Không tìm thấy sản phẩm nào"
          headers={["", "Tên người dùng", "Email", "Vai trò", "Trạng thái"]}
          renderRow={(item, index) => (
            <UserTableRow
              key={index}
              item={item}
              refreshCallBack={fetchUsers}
            />
          )}
        />

        <PageController
          setPage={(page: number) => {
            setPage(page);
          }}
          page={pageInfo}
        />
      </div>
    </AdminMainCard>
  );
}
