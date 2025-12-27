import { API_BASE } from "@/config/app-config";
import axios, { HttpStatusCode } from "axios";
import { AuthManager } from "./auth/AuthManager"; // 
import { redirectAuthenticateAndGoBack } from "@/util/route";

interface RefreshTokenResponse {
  accessToken: string;
}

// Instance riêng cho refresh để tránh loop 401
const refreshInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/**
 * Hàm gọi API refresh token
 * Nhận token từ localStorage truyền vào để đảm bảo không phụ thuộc vào Cookie
 */
export const getRefreshToken = async (token?: string) => {
  // Lấy token từ tham số truyền vào, nếu không có thì thử tìm trong localStorage
  const rfToken = token || (typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : "");
  
  return refreshInstance.post<RefreshTokenResponse>("/auth/refresh", null, {
    params: {
      refreshToken: rfToken // Gửi token qua Query Param cho Backend dễ xử lý
    }
  });
};

const HttpClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR: Đính kèm Access Token vào Header
HttpClient.interceptors.request.use((config) => {
  const token = AuthManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: Xử lý tự động Refresh khi gặp lỗi 401
HttpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);

    // Nếu lỗi 401 (Hết hạn Access Token)
    if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      
      // Nếu đang có một request khác đang refresh rồi thì đợi request đó xong
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return HttpClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Lấy token từ localStorage để thực hiện refresh
        const rfToken = typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null;

        getRefreshToken(rfToken || "")
          .then((resp) => {
            const newToken = resp.data.accessToken;
            
            // Lưu Access Token mới vào LocalStorage thông qua AuthManager
            AuthManager.setAccessToken(newToken);
            
            // Cập nhật Header cho request hiện tại và các request đang chờ
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            
            resolve(HttpClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            
            // Refresh thất bại hoàn toàn -> Xóa sạch dấu vết và Logout
            AuthManager.clearAccessToken();
            if (typeof window !== 'undefined') {
                localStorage.removeItem("refresh_token");
                if (!window.location.pathname.includes("/login")) {
                    redirectAuthenticateAndGoBack();
                }
            }
            reject(err);
          })
          .finally(() => { 
            isRefreshing = false; 
          });
      });
    }
    return Promise.reject(error);
  }
);

export default HttpClient;