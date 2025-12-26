package com.example.vietsneaker_server;

import com.example.vietsneaker_server.auth.jwt.JwtTokenFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VietsneakerApplication {

  public static void main(String[] args) {
    SpringApplication.run(VietsneakerApplication.class, args);
  }

  /**
   * CẤU HÌNH QUAN TRỌNG:
   * Ngăn Spring Boot tự động đăng ký JwtTokenFilter thành Global Filter.
   * Lý do: Chúng ta đã thêm filter này thủ công trong SecurityConfig (http.addFilterBefore...).
   * Nếu không có đoạn này, filter sẽ chạy 2 lần trên mỗi request -> Gây lỗi và chậm hệ thống.
   */
  @Bean
  public FilterRegistrationBean<JwtTokenFilter> registration(JwtTokenFilter filter) {
    FilterRegistrationBean<JwtTokenFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false); // Tắt tự động đăng ký
    return registration;
  }
}