package com.example.clockee_server.auth.jwt;

import com.example.clockee_server.auth.SecurityUtil;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

  private static final String BEARER_PREFIX = "Bearer ";
  private final JwtTokenProvider tokenProvider;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // ✅ 1) Luôn cho preflight qua
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      filterChain.doFilter(request, response);
      return;
    }

    // ✅ 2) Lấy Authorization header
    final String header = request.getHeader(HttpHeaders.AUTHORIZATION);

    // ✅ 3) Không có Bearer -> cho qua (public/anonymous)
    if (header == null || !header.startsWith(BEARER_PREFIX)) {
      filterChain.doFilter(request, response);
      return;
    }

    // ✅ 4) Tách token an toàn
    final String token = header.substring(BEARER_PREFIX.length()).trim();

    try {
      final String userEmail = tokenProvider.getUsername(token);
      final User user = userRepository.findByEmail(userEmail).orElse(null);

      // Token không hợp lệ hoặc user không tồn tại -> cho qua (để Security quyết định)
      if (user == null || !tokenProvider.isValidToken(token, user)) {
        filterChain.doFilter(request, response);
        return;
      }

      // ✅ 5) Gắn principal vào SecurityContext nếu hợp lệ
      SecurityUtil.setPricipalToSecurityContext(user, request);

      // Tiếp tục chain
      filterChain.doFilter(request, response);
    } catch (ExpiredJwtException ex) {
      // ✅ 6) Token hết hạn: trả 401 cho request thường (KHÔNG redirect)
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      // Có thể ghi message nếu muốn:
      // response.getWriter().write("Token expired");
    } catch (Exception ex) {
      // Bất kỳ lỗi nào khác: không làm hỏng chain, cứ cho qua
      filterChain.doFilter(request, response);
    }
  }
}
