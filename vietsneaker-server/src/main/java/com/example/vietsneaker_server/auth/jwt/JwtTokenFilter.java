package com.example.vietsneaker_server.auth.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Thêm log để dễ debug
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
@Slf4j // Logger
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService; // Dùng UserDetailsService chuẩn hơn gọi trực tiếp Repo

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 1. Lấy token từ request
            String jwt = parseJwt(request);

            // 2. Nếu có token và token hợp lệ
            if (jwt != null && tokenProvider.validateJwtToken(jwt)) {
                
                // 3. Lấy username từ token
                String username = tokenProvider.getUsername(jwt);

                // 4. Load user từ DB (đảm bảo user còn tồn tại/chưa bị khóa)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 5. Tạo Authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Set vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException ex) {
            // Token hết hạn: Log lại nhưng KHÔNG chặn request ngay tại đây
            // Để Security tự xử lý hoặc trả về 401 sau
            log.error("JWT Token expired: {}", ex.getMessage());
        } catch (Exception e) {
            // Các lỗi khác: Log lại và cho qua
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        // QUAN TRỌNG: Chỉ gọi doFilter ĐÚNG 1 LẦN ở cuối cùng
        // Bất kể try/catch có lỗi hay không, request vẫn phải đi tiếp
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}