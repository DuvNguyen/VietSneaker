import { API_BASE, USERNAME_COOKIE_KEY } from "@/config/app-config";
import axios, { HttpStatusCode } from "axios";
import { AuthManager } from "@/lib/auth/AuthManager";
import { toast } from "react-toastify";
import { logger } from "@/util/logger";
import { redirectAuthenticateAndGoBack } from "@/util/route";
import { OpenAPI } from "@/gen";

// https://github.com/nextauthjs/next-auth/discussions/3550
OpenAPI.BASE = API_BASE;
interface RefreshTokenResponse {
  accessToken: string;
}
export const getRefreshToken = async () => {
  try {
    return await axios.post<RefreshTokenResponse>(`/auth/refresh`, null, {
      baseURL: API_BASE,
      withCredentials: true,
    });
  } catch (error) {
    throw error;
  }
};
/**
 * Main axios config for the whole application
 * interceptor inject jwt token and refresh token when exipred
 */
const HttpClient = () => {
  const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    withXSRFToken: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  instance.interceptors.request.use(async (request) => {
    const token = AuthManager.getAccessToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    logger.info(`Interceptor ${JSON.stringify(request)}`);
    return request;
  });
  /**
   * Handle response when access token not available or exipred
   * Perform refresh token
   */
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    /**
     * Perform refresh token action only when error occur
     */
    async (error) => {
      const originalConfig = error.config;

      if (!error.response) {
        // No network connectivity
        try {
          toast("Network error");
        } catch (e) {
          logger.error("Network error: ", e);
        } finally {
          return;
        }
      }

      const unauthorized =
        error.response.status === HttpStatusCode.Unauthorized;
      const noAccessTokenAndForbidden =
        error.response.status === HttpStatusCode.Forbidden &&
        !AuthManager.getAccessToken();
      if (unauthorized || noAccessTokenAndForbidden) {
        if (originalConfig.retry) {
          /**
           * Unauthorized retry fail
           * Recursive base case
           */

          // Logout
          logger.warn("Unable refresh token, TODO: redirect login");
          window.location.href = "/login";
          return Promise.reject(error);
        } else {
          logger.info("Refresh token retry");
          originalConfig.retry = true;
          try {
            const refreshResponse = await getRefreshToken();
            if (refreshResponse.data.accessToken) {
              const refreshToken = refreshResponse.data.accessToken;
              AuthManager.setAccessToken(refreshToken); // Assume { accesstoken: xxyyzzz}
              // update original  header request
              originalConfig.headers.Authorization = `Bearer ${refreshToken}`;

              // retry request with new header
              return instance(originalConfig);
            }
          } catch (refreshError) {
            AuthManager.clearAccessToken();
            redirectAuthenticateAndGoBack();
            return Promise.reject(refreshError);
          }
        }
      }

      if (error.response.status === 422) {
        toast("Invalid data");
        return Promise.reject(error);
      }

      if (error?.response?.status === 404) {
        window.location.href = "/not-found";
      }

      if (error.response.status === 500) {
        return Promise.reject(error);
      }
      return Promise.reject(error);
      // Refresh fail => logout
    },
  );

  return instance;
};

export default HttpClient();
