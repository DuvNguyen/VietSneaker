package com.example.clockee_server.auth.jwt;

import com.example.clockee_server.auth.SecurityUtil;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** JwtTokenFilter */
@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
  private final String BEAR_HEADER_PREFIX = "Bearer ";
  private final JwtTokenProvider tokenProvider;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // get header token

    final String header = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (!isValidBearHeader(header)) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = header.split(" ")[1].trim();
    String userEmail;
    User user;
    try {
      userEmail = tokenProvider.getUsername(token);
      user = userRepository.findByEmail(userEmail).orElse(null);
      if (!isValidUserWithToken(user, token)) {
        filterChain.doFilter(request, response);
        return;
      }

      SecurityUtil.setPricipalToSecurityContext(user, request);
    } catch (ExpiredJwtException e) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    filterChain.doFilter(request, response);
  }

  private boolean isValidBearHeader(String header) {
    return header != null && !StringUtils.isEmpty(header) && header.startsWith(BEAR_HEADER_PREFIX);
  }

  private boolean isValidUserWithToken(User user, String token) {
    return user != null && tokenProvider.isValidToken(token, user);
  }
}
