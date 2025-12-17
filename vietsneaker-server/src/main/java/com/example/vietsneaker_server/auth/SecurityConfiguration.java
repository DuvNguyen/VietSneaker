package com.example.vietsneaker_server.auth;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.example.vietsneaker_server.auth.jwt.JwtTokenFilter;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final UserDetailsService userDetailsService;
  private final JwtTokenFilter jwtTokenFilter;
  private final AuthEntryPointJwt authEntryPointJwt;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(c -> c.configurationSource(corsConfigurationSource()))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(h -> {
          h.authenticationEntryPoint(authEntryPointJwt);
          h.accessDeniedHandler(accessDeniedHandler());
        })
        .authorizeHttpRequests(reg -> reg
            // 👇 PHẢI permit OPTIONS cho mọi đường dẫn để preflight không bị chặn
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // 🌟 Đảm bảo API Docs được permit trước các quy tắc khác
            .requestMatchers(
                antMatcher("/v3/api-docs/**"), // Endpoint quan trọng cho code gen
                antMatcher("/swagger-ui/**"),
                antMatcher("/swagger-resources/**"),
                antMatcher("/webjars/**")
            ).permitAll()
            
            // Các API khác
            .requestMatchers(antMatcher("/api/chat/**")).permitAll()
            
            // Quy tắc bảo vệ
            .requestMatchers(antMatcher("/admin/**")).authenticated()
            
            // Các đường dẫn còn lại
            .anyRequest().permitAll()
        );

    http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    http.userDetailsService(userDetailsService);

    // ⚠️ Không ép HTTPS trong môi trường DEV
    // http.requiresChannel(ch -> ch.anyRequest().requiresSecure());

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

  // Đăng ký CorsFilter ở mức ưu tiên cao để trả preflight 200 trước các filter khác
  @Bean
  @Order(Ordered.HIGHEST_PRECEDENCE)
  public CorsFilter corsFilter() {
    return new CorsFilter(corsConfigurationSource());
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    // Dùng allowedOriginPatterns để dev localhost + credentials
    // config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
    config.setAllowedOriginPatterns(List.of("http://localhost:3000", "https://localhost:3000"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
    config.setAllowedHeaders(List.of("Content-Type","Authorization","X-Requested-With","Accept","Origin"));
    config.setExposedHeaders(List.of("Location"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  private AccessDeniedHandler accessDeniedHandler() {
    return (request, response, ex) -> {
      throw ApiException.builder()
          .message(AppMessage.of(MessageKey.ACCESS_DENIED))
          .status(403)
          .build();
    };
  }

  @Bean
  public AuthenticationManager authenticationManager() {
    DaoAuthenticationProvider dao = new DaoAuthenticationProvider();
    dao.setUserDetailsService(userDetailsService);
    dao.setPasswordEncoder(passwordEncoder());
    return new ProviderManager(dao);
  }
}