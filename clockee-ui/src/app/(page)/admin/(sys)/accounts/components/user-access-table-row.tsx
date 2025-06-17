"use client";
import Link from "next/link";
import { IamControllerService, UserAccessDetailsResponse } from "@/gen";
import { getRoleNameLabel } from "@/util/role-utils";

type UserRowProps = {
  item: UserAccessDetailsResponse;
  refreshCallBack: () => void;
};

const UserTableRow = ({ item, refreshCallBack }: UserRowProps) => {
  const handleUpdate = async () => {
    if (item.userId == undefined || item.enabled == undefined) return;
    try {
      const newStatus = await IamControllerService.toggleUserEnableStatus(
        item.userId,
      );
      refreshCallBack();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái user:", err);
    }
  };
  return (
    <tr>
      <td>
        <i className="fa fa-user"></i>
      </td>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>
        {item.roles?.map((roleName) => (
          <p key={roleName}>{getRoleNameLabel(roleName || "")}</p>
        ))}
      </td>
      <td>{item.enabled ? "Đang mở" : "Đang chặn"}</td>
      <td>
        <i
          className={`fa cursor-pointer ${item.enabled ? "fa-unlock" : "fa-lock"}`}
          title={item.enabled ? "Chặn" : "Mở chặn"}
          onClick={handleUpdate}
        ></i>
      </td>

      {/* Nút xem thông tin chi tiết của người dùng */}
      <td>
        <Link href={`/admin/accounts/${item.userId}`}>
          {/* Action edit */}
          <i className="fa fa-external-link-alt  cursor-pointer"></i>
        </Link>
      </td>
    </tr>
  );
};
export default UserTableRow;
