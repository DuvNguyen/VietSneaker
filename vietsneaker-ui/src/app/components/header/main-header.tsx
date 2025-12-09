"use client";

import Link from "next/link";
import { Shield, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import Logo from "../common/logo";
import { SearchBar } from "./search-bar";
import { USERNAME_COOKIE_KEY } from "@/config/app-config";
import { useCart } from "@/lib/hooks/use-cart";
import { useLocalStorage } from "usehooks-ts";
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
  const [isScrolled, setIsScrolled] = useState(false);

  const shoeSizes = [36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 44];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchBrands = async () => {
      try {
        const brands = await BrandControllerService.getPopularBrand();
        setPopularBrands(brands);
      } catch (error) {
        logger.warn(error);
      }
    };
    fetchBrands();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b" : "bg-white border-b border-transparent"}
      `}
    >
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">

        {/* LEFT: LOGO */}
        <div className="flex-shrink-0 flex items-center">
          <div className="h-14 w-auto">
            <Logo />
          </div>
        </div>

        {/* CENTER: FILTER + SEARCH */}
        <div className="hidden md:flex flex-1 items-center justify-center">

          {/* Filters */}
          {filter && (
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-700 ml-6">

              {/* Brand Dropdown */}
              <div className="group relative cursor-pointer py-4">
                <Link href="/brands" className="hover:text-black transition-colors flex items-center gap-1">
                  Thương hiệu
                </Link>
                <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden p-2">
                    <div className="flex flex-col">
                      {popularBrands.length > 0 ? popularBrands.map((brand) => (
                        <Link
                          key={brand.brandId}
                          href={`/search?brandId=${brand.brandId}`}
                          className="px-4 py-2 hover:bg-slate-50 hover:text-black rounded-md transition-colors text-slate-600"
                        >
                          {brand.name}
                        </Link>
                      )) : <span className="p-2 text-xs text-gray-400">Đang tải...</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Dropdown */}
              <div className="group relative cursor-pointer py-4">
                <span className="hover:text-black transition-colors">Size giày</span>
                <div className="absolute top-full -left-10 w-80 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-lg shadow-xl border border-slate-100 p-4">
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Chọn nhanh size</p>
                    <div className="grid grid-cols-4 gap-2">
                      {shoeSizes.map((size) => (
                        <Link
                          key={size}
                          href={`/search?shoeSize=${size}`}
                          className="flex items-center justify-center border border-slate-200 py-1.5 rounded hover:border-black hover:bg-black hover:text-white transition-all text-xs font-medium"
                        >
                          {size}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SearchBar */}
          {searchBar && (
            <div className="flex-1 max-w-md mx-auto">
              <SearchBar />
            </div>
          )}

        </div>

        {/* RIGHT: USER + CART */}
        <div className="flex items-center justify-end space-x-4 min-w-[120px]">
          {mounted ? (
            <>
              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link href={"/cart/"} className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-black" />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  {/* User */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                      <div className="bg-slate-100 text-slate-700 rounded-full w-9 h-9 flex items-center justify-center border hover:border-slate-300">
                        <User className="w-5 h-5" />
                      </div>
                    </div>

                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-56 border border-slate-100">
                      {isAdmin() && (
                        <li>
                          <button onClick={() => router.push("/admin")} className="flex items-center gap-2 text-rose-600 font-medium">
                            <Shield size={16} /> Trang quản trị
                          </button>
                        </li>
                      )}

                      <li className="menu-title px-4 py-1 text-xs text-gray-400 uppercase">Tài khoản</li>
                      {userMenuItems.map(({ label, href, icon: Icon }) => (
                        <li key={href}>
                          <button onClick={() => router.push(href)} className="flex items-center gap-2">
                            <Icon size={16} className="text-slate-500" /> {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Link href="/login" className="text-slate-600 hover:text-black transition-colors">
                    Đăng nhập
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-black text-white rounded-full hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="w-20 h-8 bg-slate-100 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
