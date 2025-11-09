"use client";
import { RoleName } from "@/gen/backend";
import { useAuth } from "@/lib/hooks/use-auth";
import { SidebarItem } from "@/model/SidebarItem";
import Link from "next/link";

export const MenuItem = ({ item }: { item: SidebarItem }) => {
  const { containAnyRoles } = useAuth();
  const validRoles = (roles?: Array<RoleName>) => {
    return !roles || containAnyRoles(roles);
  };

  return (
    <>
      {/* Mục chính */}
      <div className="p-2.5 mt-2 flex items-center rounded-md px-4 cursor-pointer hover:bg-gray-100 transition-colors">
        <div className="flex justify-between w-full items-center">
          <Link
            href={item.href}
            className="text-sm font-semibold text-gray-800 hover:text-[#e20000] transition-colors"
          >
            {item.title}
          </Link>
          <i className="bi bi-chevron-down text-gray-500 text-xs"></i>
        </div>
      </div>

      {/* Sub item */}
      <div className="text-left text-sm mt-1 w-4/5 mx-auto text-gray-500 font-medium">
        {item.subItems?.map((subItem, index) => (
          <div key={index}>
            {validRoles(subItem.roles) ? (
              <Link
                href={subItem.href}
                className="block px-3 py-1.5 rounded-md hover:bg-[#e20000]/10 hover:text-[#e20000] transition-all"
              >
                {subItem.title}
              </Link>
            ) : (
              <div className="block px-3 py-1.5 rounded-md text-gray-400 cursor-not-allowed">
                {subItem.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
