"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthManager } from "../auth/AuthManager";
import { AuthControllerService, JwtTokenResponse, OpenAPI } from "@/gen";
import { ROLES_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/config/app-config";
import { logger } from "@/util/logger";
import { useLocalStorage } from "usehooks-ts";
import { getRefreshToken } from "../http-client";
import { RoleName } from "@/gen/backend";


OpenAPI.TOKEN = async () => AuthManager.getAccessToken() ?? "";

type UserDetails = Omit<JwtTokenResponse, "accessToken" | "refreshToken">;
type AuthContextType = {
  user: UserDetails | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  saveUserDetails: (authDetails: JwtTokenResponse) => void;
  isAdmin: () => boolean;
  logout: () => void;
  getRoles: () => Array<string>;
  containRole: (role: RoleName) => boolean;
  containAnyRoles: (roles: Array<RoleName>) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(AuthManager.getAccessToken());
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [storedUsername, setUsername, removeUsername] = useLocalStorage(USERNAME_COOKIE_KEY, "");
  const [storedRoles, setRoles, removeRoles] = useLocalStorage<string[]>(ROLES_COOKIE_KEY, []);

  // 1. Đồng bộ token từ AuthManager
  useEffect(() => {
    const handleTokenChange = (newToken: string) => setAccessToken(newToken);
    AuthManager.addListener(handleTokenChange);
    return () => AuthManager.removeListener(handleTokenChange);
  }, []);

  // 2. Logic hồi phục phiên đăng nhập khi Reload
  useEffect(() => {
    const initAuth = async () => {
      const currentToken = AuthManager.getAccessToken();
      
      // Nếu có username cũ -> Khôi phục trạng thái UI ngay lập tức
      if (storedUsername) {
        setIsAuthenticated(true);
        setUser({
          username: storedUsername,
          roles: storedRoles,
        });

        try {
          // Thực hiện làm mới token bằng Refresh Token từ localStorage
          await _refreshAuth();
        } catch (error: any) {
          logger.warn("Initial refresh failed - Session might be expired.");
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const _refreshAuth = async () => {
    // Không có username thì không cần refresh
    if (!storedUsername) return;

    try {
      // FIX LỖI: Lấy refresh token từ localStorage để truyền vào hàm gọi API
      const localRefreshToken = localStorage.getItem("refresh_token");
      
      const resp = await getRefreshToken(localRefreshToken || "");
      
      if (resp.data.accessToken) {
        const token = resp.data.accessToken;
        _updateToken(token);

        // Cập nhật lại thông tin user từ payload của token mới
        const payload = JSON.parse(atob(token.split(".")[1]));
        const newUser = {
          username: payload.sub || storedUsername,
          roles: payload.roles || storedRoles,
        };

        setUser(newUser);
        setUsername(newUser.username);
        setRoles(newUser.roles);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      // Nếu lỗi 401 Unauthorized -> Refresh Token hết hạn hoặc không hợp lệ -> Logout
      if (error.response?.status === 401) {
        _removeUserDetails();
      }
      throw error;
    }
  };

  const _updateToken = (token: string) => {
    AuthManager.setAccessToken(token);
    setAccessToken(token);
  };

  const saveUserDetails = (authDetails: JwtTokenResponse) => {
    _updateToken(authDetails.accessToken || "");

    // QUAN TRỌNG: Lưu refresh_token vào LocalStorage vì Cookie bị chặn
    if (authDetails.refreshToken) {
      localStorage.setItem("refresh_token", authDetails.refreshToken);
    }

    setUser(authDetails);
    setIsAuthenticated(true);
    setUsername(authDetails.username || "");
    setRoles(authDetails.roles || []);
  };

  const _removeUserDetails = () => {
    AuthManager.clearAccessToken();
    localStorage.removeItem("refresh_token"); // Xóa cả refresh token khi logout
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    removeUsername();
    removeRoles();
  };

  const logout = async () => {
    try {
      await AuthControllerService.logoutUser();
    } catch (error) {
      logger.error("Logout error:", error);
    } finally {
      _removeUserDetails();
    }
  };

  const getRoles = () => user?.roles ?? storedRoles ?? [];
  
  const containRole = (role: RoleName) => {
    const rolesArr = getRoles();
    return rolesArr.includes(role) || rolesArr.includes(`ROLE_${role}`);
  };

  const containAnyRoles = (rolesArr: Array<RoleName>) => rolesArr.some(role => containRole(role));

  const isAdmin = () => containAnyRoles([RoleName.INVENTORY_MANAGER, RoleName.PRODUCT_ADMIN, RoleName.SYS_ADMIN]);

  return (
    <AuthContext.Provider
      value={{
        token: accessToken,
        isAuthenticated,
        user,
        isLoading,
        saveUserDetails,
        logout,
        isAdmin,
        getRoles,
        containRole,
        containAnyRoles,
      }}
    >
      {isLoading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
           <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
           <span className="mt-4 text-gray-600 font-medium">Đang xác thực...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};