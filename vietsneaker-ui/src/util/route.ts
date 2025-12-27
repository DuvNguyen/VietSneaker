import { USERNAME_COOKIE_KEY } from "../config/app-config";

export const redirectAuthenticateAndGoBack = () => {
  const currentRoute = window.location.pathname + window.location.search;
  window.location.href =
    "/login" + (currentRoute ? `?redirect=${currentRoute}` : "");
};
