package com.example.vietsneaker_server.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.example.vietsneaker_server.config.ApplicationConstants;

/** IsProductAdmin */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@HasRole(ApplicationConstants._PRODUCT_ADMIN)
// @PreAuthorize(IsProductAdmin.expression)
public @interface IsProductAdmin {
  public static final String expression = "hasRole('" + ApplicationConstants._PRODUCT_ADMIN + "')";
}
