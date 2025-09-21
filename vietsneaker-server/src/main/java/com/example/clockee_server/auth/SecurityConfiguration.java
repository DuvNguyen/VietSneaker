package com.example.clockee_server.auth;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import com.example.clockee_server.auth.jwt.JwtTokenFilter;
import com.example.clockee_server.config.ApplicationProperties;
import com.example.clockee_server.exception.ApiException;
import com.example.clockee_server.message.AppMessage;
import com.example.clockee_server.message.MessageKey;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

/** SecurityConfiguration */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {
  private final ApplicationProperties applicationProperties;
  private final UserDetailsService userDetailsService;
  private final JwtTokenFilter jwtTokenFilter;
  private final AuthEntryPointJwt authEntryPointJwt;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(
        customizer -> {
          customizer
              .requestMatchers(antMatcher("/swagger-ui/**"))
              .permitAll()
              .requestMatchers(antMatcher("/v3/api-docs/**"))
              .permitAll()
              .requestMatchers(antMatcher("/swagger-resources/**"))
              .permitAll()
              .requestMatchers(antMatcher("/webjars/**"))
              .permitAll()
              .requestMatchers(antMatcher("/admin/**"))
              .authenticated()
              .anyRequest()
              .permitAll();
        });

    // http.oauth2Login(customizer -> {
    // customizer.successHandler(oauth2LoginSuccessHandler);
    // });

    http.exceptionHandling(
        customer -> {
          customer.authenticationEntryPoint(authEntryPointJwt);
          customer.accessDeniedHandler(accessDeniedHandler());
        });

    // Change from cookiee base session to stateless => user store jwt token in
    // localStorage
    http.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    // Filter apply on request to put userdetails to application context if exist
    http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    // TODO: remove this
    http.addFilterBefore(new LogRequestFilter(), JwtTokenFilter.class);

    http.userDetailsService(userDetailsService);

    http.csrf(AbstractHttpConfigurer::disable);

    http.cors(
        customizer -> {
          customizer.configurationSource(corsConfigurationSource());
        });

    http.requiresChannel(chanel -> chanel.anyRequest().requiresSecure());

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  private CorsConfigurationSource corsConfigurationSource() {
    return new CorsConfigurationSource() {
      @Override
      public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(applicationProperties.getAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return config;
      }
    };
  }

  private AccessDeniedHandler accessDeniedHandler() {
    return (request, response, accessDeniedException) -> {
      throw ApiException.builder()
          .message(AppMessage.of(MessageKey.ACCESS_DENIED))
          .status(403)
          .build();
    };
  }
  ;

  @Bean
  public AuthenticationManager authenticationManager() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(userDetailsService);
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return new ProviderManager(daoAuthenticationProvider);
  }
}
