export const HOST = process.env.HOST || `https://localhost:8083`;
export const CONTEXT_API = process.env.CONTEXT_API || `/api`;
export const API_BASE = HOST + CONTEXT_API;

export const USERNAME_COOKIE_KEY = "user";
export const ROLES_COOKIE_KEY = "roles";

// One million is the unit for product value
export const UNIT = 1000000;
