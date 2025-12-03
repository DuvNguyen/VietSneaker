"use client";
import { MenuItem } from "./menu-item";
import Link from "next/link";
import { adminMenuItems } from "@/config/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { getRoleNameLabel } from "@/util/role-utils";

export const AdminSideBar = () => {
  const { user, getRoles } = useAuth();

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 shadow-md flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-center">
          <Link href={"/"}>
            <img
              src="/logoAdmin.png"
              alt="logo"
              className="h-10 cursor-pointer hover:opacity-80 transition"
            />
          </Link>
        </div>

        {/* Thông tin user */}
        <div className="px-5 py-3 border-b border-gray-100 text-center">
          {user && (
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <div className="flex justify-center gap-1 flex-wrap mt-1">
                {getRoles().map((role) => (
                  <span
                    key={role}
                    className="bg-red-100 text-[#e20000] border border-red-200 px-2 py-[2px] text-xs rounded-full"
                  >
                    {getRoleNameLabel(role)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {adminMenuItems.map((menuItem, idx) => (
            <MenuItem key={idx} item={menuItem} />
          ))}
        </div>
      </div>
    </>
  );
};
