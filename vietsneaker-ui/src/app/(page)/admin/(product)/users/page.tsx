"use client";
import React, { useState, ChangeEvent } from "react";
import AdminMainCard from "@/app/components/card/admin-card";
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

  // 🔍 Hàm lấy danh sách user (GIỮ NGUYÊN LOGIC)
  async function fetchUsers() {
    try {
      const resp = await AdminUserControllerService.getAllUsers(page - 1, query);
      if (resp) setPageInfo(resp);

      const users = resp.content || [];

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

  function onChangeSearchQuery(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
  }

  return (
    <AdminMainCard title="NGƯỜI DÙNG" goBack={false}>
      {/* Wrapper giống Supplier */}
      <div className="w-full bg-white p-6 md:p-8 shadow-lg rounded-xl min-h-[80vh]">

        {/* 🔍 Thanh tìm kiếm */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-3/5 lg:w-2/5">
            <div className="flex items-center border border-gray-300 bg-white h-11 px-3 rounded-lg shadow-sm">
              <i className="fa fa-search mr-2 text-gray-400"></i>
              <input
                value={query || ""}
                onChange={onChangeSearchQuery}
                className="w-full focus:outline-none text-sm text-gray-700 bg-white placeholder-gray-400"
                placeholder="Tìm kiếm người dùng..."
              />
            </div>
          </div>
        </div>

        {/* 📋 Bảng danh sách người dùng */}
        <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full border-collapse table-auto text-left text-[14px]">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 border-b border-gray-300 text-center w-[40px] font-semibold">
                  #
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Tên người dùng
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Email
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Vai trò
                </th>
                <th className="p-3 border-b border-gray-300 text-center font-semibold">
                  Trạng thái
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[8%] font-semibold">
                  Khoá / Mở
                </th>
                <th className="p-3 border-b border-gray-300 text-center w-[8%] font-semibold">
                  Chi tiết
                </th>
              </tr>
            </thead>

            <tbody>
              {(pageInfo?.content ?? []).length > 0 ? (
                pageInfo!.content!.map(
                  (item: UserDetailResponse, index: number) => (
                    <UserTableRow
                      key={index}
                      item={item}
                      roleName={userRoles[item.userId!] || ""}
                      refreshCallBack={fetchUsers}
                    />
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500 italic bg-gray-50"
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Phân trang */}
        <div className="w-full mt-8 flex justify-center items-center">
          <PageController setPage={setPage} page={pageInfo} />
        </div>
      </div>
    </AdminMainCard>
  );
}
