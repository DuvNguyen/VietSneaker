"use client";
import React, { useState } from "react";
import AdminMainCard from "@/app/components/card/admin-card";
import DataTable from "@/app/components/common/data-table";
import UserTableRow from "./components/user-table-row";
import {
  AdminUserControllerService,
  PageResponseUserDetailResponse,
  UserDetailResponse,
} from "@/gen";
import { usePageSearch } from "@/lib/hooks/use-page-search";
import PageController from "@/app/components/common/page-controller";

export default function UserAdminPage() {
  const [userRoles, setUserRoles] = useState<Record<number, string>>({});
  const fetchUsers = async () => {
    try {
      const resp = await AdminUserControllerService.getAllUsers(
        page - 1,
        undefined,
      );
      if (pageInfo) setPageInfo(resp);

      const users = resp.content || [];

      // Gọi song song lấy role cho từng user
      const roleResults = await Promise.all(
        users.map(async (user) => {
          try {
            const roles = await AdminUserControllerService.getRoleById(
              user.userId!,
            );
            return {
              userId: user.userId,
              role:
                roles.map((r) => r.roleName).join(", ") || "Không có vai trò",
            };
          } catch {
            return { userId: user.userId, role: "Lỗi khi lấy vai trò" };
          }
        }),
      );

      // Convert mảng thành object map userId -> roleName
      const roleMap: Record<number, string> = {};
      roleResults.forEach(({ userId, role }) => {
        roleMap[userId!] = role;
      });
      setUserRoles(roleMap);
      return resp;
    } catch (err) {
      console.warn(err);
    }
  };

  const { pageInfo, setPage, setPageInfo, page } =
    usePageSearch<PageResponseUserDetailResponse>({
      fetchData: fetchUsers,
    });

  return (
    <AdminMainCard title="Danh sách người dùng" goBack={false}>
      <div className="flex flex-col gap-2 items-center">
        {/*
         * Display list of brand
         */}
        <DataTable<UserDetailResponse>
          data={pageInfo.content || []}
          emptyMessage="Không tìm thấy sản phẩm nào"
          headers={["", "Tên người dùng", "Email", "Vai trò", "Trạng thái"]}
          renderRow={(item, index) => (
            <UserTableRow
              key={index}
              item={item}
              roleName={userRoles[item.userId!]}
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
