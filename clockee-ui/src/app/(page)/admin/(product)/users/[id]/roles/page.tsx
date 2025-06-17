"use client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { AdminUserControllerService, Role, UserDetailResponse } from "@/gen";
import { useEffect, useState } from "react";
import AdminMainCard from "@/app/components/card/admin-card";
import { logger } from "@/util/logger";

const UserDetailsPage = () => {
  const params = useParams();
  const id = Number(params?.id);

  const [user, setUser] = useState<UserDetailResponse | null>(null);
  const [userRoles, setUserRoles] = useState<Array<Role> | null>();
  useEffect(() => {
    if (!id || isNaN(id)) {
      toast.error("ID không hợp lệ");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await AdminUserControllerService.getUserById(Number(id));
        setUser(res);
        const roleRes = await AdminUserControllerService.getRoleById(
          Number(id),
        );
        setUserRoles(roleRes);
      } catch (error) {
        toast.error("Không thể lấy dữ liệu người dùng hoặc vai trò");
        logger.error(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <AdminMainCard title="Chi tiết người dùng" goBack={true}>
        {user ? (
          <form className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Email</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-lg font-medium">Họ và tên</label>
                <input
                  type="text"
                  value={user.name || ""}
                  disabled
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-medium">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={user.phone || ""}
                  disabled
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium">Địa chỉ</label>
              <input
                type="text"
                value={user.address || ""}
                disabled
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex w-full">
              <div className=" rounded-box grid h-20 grow ">
                <label className="block text-lg font-medium">Vai trò</label>
                <input
                  value={
                    userRoles && userRoles.length > 0
                      ? userRoles.map((r) => r.roleName).join(", ")
                      : "Không có vai trò"
                  }
                  type="text"
                  disabled
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="ml-4 rounded-box grid h-20 grow ">
                <label className="block text-lg font-medium">Trạng thái</label>
                <input
                  type="text"
                  value={
                    user?.isDeleted === true
                      ? "Đã bị xóa"
                      : user?.isDeleted === false
                        ? "Đang hoạt động"
                        : "Không rõ"
                  }
                  disabled
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </form>
        ) : (
          <p>Đang tải dữ liệu người dùng...</p>
        )}
      </AdminMainCard>
    </>
  );
};

export default UserDetailsPage;
