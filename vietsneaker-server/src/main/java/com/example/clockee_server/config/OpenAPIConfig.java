package com.example.clockee_server.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import org.springframework.context.annotation.Configuration;

/** OpenAPIConfig */
@Configuration
@OpenAPIDefinition(
    info = @Info(title = "Vietsneaker API", version = "1.1", contact = @Contact(name = "vietsneaker")),
    security = {
      @SecurityRequirement(name = "basicAuth"),
      @SecurityRequirement(name = "bearerToken")
    })
@SecuritySchemes({
  @SecurityScheme(name = "basicAuth", type = SecuritySchemeType.HTTP, scheme = "basic"),
  @SecurityScheme(
      name = "bearerToken",
      type = SecuritySchemeType.HTTP,
      scheme = "bearer",
      bearerFormat = "JWT")
})
public class OpenAPIConfig {}
