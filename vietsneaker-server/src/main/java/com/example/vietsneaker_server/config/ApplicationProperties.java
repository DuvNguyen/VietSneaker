package com.example.vietsneaker_server.config;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * ApplicationProperties centralize application config in application.properties with prefix "app"
 * intead of scatter config @Value in many file Usage: getter properties from Bean
 * ApplicationProperties
 * applicationProperties.setAllowedOrigins(applicationProperties.getAllowedOrigins());
 */
@Configuration
@ConfigurationProperties(prefix = "app")
@Setter
@Getter
public class ApplicationProperties {
  private List<String> allowedOrigins;
  private CharSequence jwtSecretKey;
  private Long jwtTokenExpMinutes;
  private String baseUrl;
  private String applicationName;
  private String uploadPath;
  private Integer jwtRefreshTokenExpDays;
  private String messagesFile;
  private String cookieName;
  private String refreshCookieName;
}
