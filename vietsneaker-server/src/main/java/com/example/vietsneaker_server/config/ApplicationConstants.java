package com.example.vietsneaker_server.config;

/** ApplicationConstants */
public class ApplicationConstants {

  public static final String PAGE_NUMBER = "0";
  public static final String PAGE_SIZE = "10";

  public static final String user_url_prefix = "/public";
  public static final String USER_URL_PREFIX = "/user";
  public static final String ADMIN_URL_PREFIX = "/admin";

  public static final String REFRESH_COOKIE_NAME = "vietsneaker-refresh";

  // Not store in RoleName due to runtime issue
  public static final String _CUSTOMER = "CUSTOMER";
  public static final String _PRODUCT_ADMIN = "PRODUCT_ADMIN";
  public static final String _INVENTORY_MANAGER = "INVENTORY_MANAGER";
  public static final String _SYS_ADMIN = "SYS_ADMIN";
}
