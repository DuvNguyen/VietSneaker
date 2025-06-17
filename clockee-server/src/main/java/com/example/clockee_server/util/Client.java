package com.example.clockee_server.util;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Mark class as client code for compile to typescript Keep client code and server code consistency
 * - DRY
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.CLASS)
public @interface Client {}
