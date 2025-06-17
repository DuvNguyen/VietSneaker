"use client";
import { MenuItem } from "./menu-item";
import Link from "next/link";
import { adminMenuItems } from "@/config/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { getRoleNameLabel } from "@/util/role-utils";

/**
 * List of item (action) for manager shop data
 */
export const AdminSideBar = () => {
  const { user, getRoles } = useAuth();
  return (
    <>
      <span className="absolute text-gray-900 text-4xl top-5 left-4 cursor-pointer"></span>
      <div className="sidebar lg:left-0 p-2 w-[220px] overflow-y-auto text-center">
        <div className="text-gray-950 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <Link href={"/"}>
              <img
                className="mr-[-9px] mt-[-5px] cursor-pointer"
                src="/logoAdmin.svg"
                alt="logo login"
              />
            </Link>
          </div>
          <div className="my-2  h-[1px]"></div>
        </div>
        <div className="text-left pl-4">
          {user && (
            <div>
              <p className="font-bold">{user.name}</p>
              {getRoles().map((role) => (
                <p
                  className="badge badge-sm font-medium  badge-soft"
                  key={role}
                >
                  {getRoleNameLabel(role)}
                </p>
              ))}
            </div>
          )}
        </div>

        {
          // Display menu item base on items structure
          adminMenuItems.map((menuItem, idx) => {
            return <MenuItem key={idx} item={menuItem} />;
          })
        }
      </div>
    </>
  );
};
