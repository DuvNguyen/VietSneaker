"use client";
import Link from "next/link";
import { AdminUserControllerService, UserDetailResponse } from "@/gen";
import { getRoleNameLabel } from "@/util/role-utils";

type UserRowProps = {
  item: UserDetailResponse;
  refreshCallBack: () => void;
  roleName?: string;
};

const UserTableRow = ({ item, refreshCallBack, roleName }: UserRowProps) => {
  const handleUpdate = async () => {
    if (!item.userId) return;
    try {
      await AdminUserControllerService.updateUserEnableStatus(
        item.userId,
        !item.enabled
      );
      refreshCallBack(); // Reload lại bảng user sau khi update
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái user:", err);
    }
  };

  const canToggleAccount = (role?: string) => role === "CUSTOMER";

  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-100 transition ${
        canToggleAccount(roleName) ? "" : "opacity-70"
      }`}
    >
      {/* Cột icon user */}
      <td className="p-3 text-center text-gray-600">
        <i className="fa fa-user"></i>
      </td>

      {/* Cột tên */}
      <td className="p-3 text-center text-gray-800">{item.name}</td>

      {/* Cột email */}
      <td className="p-3 text-center text-gray-700">{item.email}</td>

      {/* Cột vai trò */}
      <td className="p-3 text-center text-gray-700">
        {getRoleNameLabel(roleName || "")}
      </td>

      {/* Cột trạng thái */}
      <td className="p-3 text-center font-medium">
        {item.enabled ? (
          <span className="text-green-600">Đang mở</span>
        ) : (
          <span className="text-red-600">Đang chặn</span>
        )}
      </td>

      {/* Cột khóa/mở tài khoản */}
      <td className="p-3 text-center">
        {canToggleAccount(roleName) ? (
          <i
            className={`fa ${
              item.enabled ? "fa-unlock text-green-600" : "fa-lock text-red-600"
            } cursor-pointer hover:scale-110 transition-transform`}
            title={item.enabled ? "Chặn" : "Mở chặn"}
            onClick={handleUpdate}
          ></i>
        ) : (
          <i
            className="fa fa-lock cursor-not-allowed text-gray-400"
            title="Không khả dụng"
          ></i>
        )}
      </td>

      {/* Cột xem chi tiết */}
      <td className="p-3 text-center">
        <Link href={`/admin/users/${item.userId}/roles`}>
          <i className="fa fa-external-link-alt cursor-pointer hover:text-[#e20000] transition-colors"></i>
        </Link>
      </td>
    </tr>
  );
};

export default UserTableRow;
