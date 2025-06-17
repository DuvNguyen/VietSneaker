package com.example.clockee_server.auth.annotation;

import com.example.clockee_server.config.ApplicationConstants;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** IsProductAdmin */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@HasRole(ApplicationConstants._PRODUCT_ADMIN)
// @PreAuthorize(IsProductAdmin.expression)
public @interface IsProductAdmin {
  public static final String expression = "hasRole('" + ApplicationConstants._PRODUCT_ADMIN + "')";
}
