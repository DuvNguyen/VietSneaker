"use client";
import React, { useState, ChangeEvent } from "react";
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
  const { pageInfo, setPage, setPageInfo, page, query, setQuery } =
    usePageSearch<PageResponseUserDetailResponse>({
      fetchData: fetchUsers,
    });

  // 🔍 Hàm lấy danh sách user
  async function fetchUsers() {
    try {
      const resp = await AdminUserControllerService.getAllUsers(page - 1, undefined);
      if (resp) setPageInfo(resp);

      const users = resp.content || [];

      // Gọi song song để lấy vai trò từng user
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

      // Map userId -> role
      const roleMap: Record<number, string> = {};
      roleResults.forEach(({ userId, role }) => {
        roleMap[userId!] = role;
      });
      setUserRoles(roleMap);

      return resp;
    } catch (err) {
      console.warn(err);
    }
  }

  // Xử lý tìm kiếm
  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return (
    <AdminMainCard title="NGƯỜI DÙNG" goBack={false}>
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
                placeholder="Tìm kiếm người dùng..."
              />
            </div>
          </div>
        </div>

        {/* 📋 Bảng danh sách người dùng */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse table-fixed text-left text-[15px]">
            <thead className="bg-[#ffcccc] text-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center w-[40px]">
                  #
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[22%]">
                  Tên người dùng
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[25%]">
                  Email
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[20%]">
                  Vai trò
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[15%]">
                  Trạng thái
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[8%]">
                  Khoá/Mở
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[8%]">
                  Chi tiết
                </th>
              </tr>
            </thead>

            <tbody>
              {(pageInfo?.content || []).length > 0 ? (
                pageInfo?.content?.map((item: UserDetailResponse, index: number) => (
                  <UserTableRow
                    key={index}
                    item={item}
                    roleName={userRoles[item.userId!] || ""}
                    refreshCallBack={fetchUsers}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Không tìm thấy người dùng nào
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
      </div>
    </AdminMainCard>
  );
}
