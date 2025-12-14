// src/config/app-config.ts

// 1. Thêm NEXT_PUBLIC_ vào để React đọc được
// 2. Sửa fallback (giá trị mặc định) thành http (bỏ chữ s)
export const HOST = process.env.NEXT_PUBLIC_HOST || "http://localhost:8083";

export const CONTEXT_API = process.env.NEXT_PUBLIC_CONTEXT_API || "/api";
export const API_BASE = HOST + CONTEXT_API;

export const USERNAME_COOKIE_KEY = "user";
export const ROLES_COOKIE_KEY = "roles";
export const UNIT = 1000000;