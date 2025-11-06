/**
 * Use to display header for default page like: homepage, filter product page, etc
 * Including search bar for quick search, login and register button if not login yet
 * otherwise will display common action for user like personal information, order history, etc
 */
"use client";
import Link from "next/link";
import { Shield, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import Logo from "../common/logo";
import { SearchBar } from "./search-bar";
import { USERNAME_COOKIE_KEY } from "@/config/app-config";
import { useCart } from "@/lib/hooks/use-cart";
import { useLocalStorage } from "usehooks-ts";
import { filterLinks } from "@/config/filter-links";
import { userMenuItems } from "@/config/user-menu-items";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandControllerService, BrandDTO } from "@/gen";
import { logger } from "@/util/logger";

export const MainHeader = ({ searchBar = true, filter = true }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [popularBrands, setPopularBrands] = useState<BrandDTO[]>([]);

  const [username] = useLocalStorage<string>(USERNAME_COOKIE_KEY, "");
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBrands = async () => {
      try {
        const brands = await BrandControllerService.getPopularBrand();
        setPopularBrands(brands);
      } catch (error) {
        logger.warn(error);
      }
    };
    fetchBrands();
  }, []);

  // Handle hydration failed
  if (!mounted) return null;

  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white shadow-md skeleton">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {/*  Logo */}
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>

        {
          // Quick filter product by gender, branch, ...
          filter && (
            <div className="flex justify-around mt-3  px-10 space-x-10 text-gray-700 font-medium ">
              <div className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="hover:text-yellow-500 font-bold m-1 cursor-pointer"
                >
                  <Link href={"/brands"}>Thương hiệu</Link>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {popularBrands.map((brand) => {
                    return (
                      <li key={brand.brandId}>
                        <Link href={`/search?brandId=${brand.brandId}`}>
                          {brand.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )
        }
      </div>
      {searchBar && <SearchBar />}
      <div className="flex items-center space-x-10 pr-5">
        {
          // Display button login, register base in authentication status
          isAuthenticated && (
            <div>
              <div className="indicator btn">
                {isAuthenticated && (
                  <span className="indicator-item badge badge-xs badge-neutral">
                    {totalItems}
                  </span>
                )}
                <Link href={"/cart/"}>
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
                </Link>
              </div>
            </div>
          )
        }

        {isAuthenticated ? (
          <>
            <div className="dropdown dropdown-end ">
              <div tabIndex={0} role="button" className="btn border-none">
                <User className="text-gray-700 hover:text-black" />
              </div>

              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {isAdmin() && (
                  <li
                    onClick={() => {
                      router.push("/admin");
                    }}
                    className="cursor-pointer p-2 text-gray-700 flex items-start gap-2 w-full"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Shield size={18} />
                      Quản lý
                    </div>
                  </li>
                )}
                {userMenuItems.map(({ label, href, icon: Icon }) => (
                  <li
                    onClick={() => {
                      router.push(href);
                    }}
                    key={href}
                    className="hover:bg-gray-100 cursor-pointer p-2 text-gray-700 flex items-start gap-2 w-full"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon size={18} />
                      {label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link className="text-gray-700 hover:text-red-500" href="/login">
              Đăng nhập
            </Link>
            <Link
              className="text-gray-700 hover:text-red-500"
              href="/signup"
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
