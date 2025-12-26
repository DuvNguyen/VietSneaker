package com.example.vietsneaker_server.auth.jwt;

import io.jsonwebtoken.*; // Import đầy đủ các exception
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Lưu ý import này
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Thêm logger
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.vietsneaker_server.config.ApplicationProperties;

/** JwtTokenProvider */
@Component
@RequiredArgsConstructor
@Slf4j // ✅ Thêm cái này để log lỗi
public class JwtTokenProvider {
  private final ApplicationProperties applicationProperties;

  // ✅ HÀM MỚI: Chỉ validate token (dùng cho Filter)
  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parser()
          .verifyWith(getSignKey())
          .build()
          .parseSignedClaims(authToken);
      return true;
    } catch (MalformedJwtException e) {
      log.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      log.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      log.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      log.error("JWT claims string is empty: {}", e.getMessage());
    } catch (SignatureException e) {
      log.error("Invalid JWT signature: {}", e.getMessage());
    }
    return false;
  }

  // Hàm cũ của bạn (giữ nguyên để tương thích code cũ nếu cần)
  public boolean isValidToken(String token, UserDetails userDetails) {
    final var email = getUsername(token);
    // Lưu ý: expired check đã được handle bởi parser ở trên, nhưng giữ lại cũng không sao
    final var exp = extractClaim(token, Claims::getExpiration);
    final boolean isTokenExpired = exp.before(new Date(System.currentTimeMillis()));

    if (!email.equals(userDetails.getUsername())) return false;
    if (isTokenExpired) return false;

    return true;
  }

  private <T> T extractClaim(String token, Function<Claims, T> extractorMethod) {
    var claims = extractAllClaims(token);
    return extractorMethod.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    // Dùng parser đã build sẵn
    var parser = Jwts.parser().verifyWith(getSignKey()).build();
    var claims = parser.parseSignedClaims(token).getPayload();
    return claims;
  }

  public String getUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public String genenerateToken(UserDetails user) {
    return genenerateToken(user, new HashMap<>());
  }

  public String genenerateToken(UserDetails user, Map<String, Object> claims) {
    String emailSubject = user.getUsername();
    Date issueAt = new Date(System.currentTimeMillis());
    Date expiredAt =
        new Date(
            System.currentTimeMillis() + applicationProperties.getJwtTokenExpMinutes() * 60 * 1000);
    
    return Jwts.builder()
        .claims()
        .subject(emailSubject)
        .issuedAt(issueAt)
        .expiration(expiredAt)
        .add(claims) // Lưu ý: hàm add nhận Map<String, Object>
        .and()
        .signWith(getSignKey(), Jwts.SIG.HS256)
        .compact();
  }

  private SecretKey getSignKey() {
    byte[] keybytes = Decoders.BASE64.decode(applicationProperties.getJwtSecretKey());
    return Keys.hmacShaKeyFor(keybytes);
  }

  // Create RefreshToken
  public String generateRefreshToken(UserDetails user) {
    Date issueAt = new Date(System.currentTimeMillis());
    Date expiredAt =
        new Date(
            System.currentTimeMillis()
                + Long.valueOf(applicationProperties.getJwtRefreshTokenExpDays())
                    * 24
                    * 60
                    * 60
                    * 1000);

    return Jwts.builder()
        .claims()
        .subject(user.getUsername())
        .issuedAt(issueAt)
        .expiration(expiredAt)
        .and()
        .signWith(getSignKey(), Jwts.SIG.HS256)
        .compact();
  }

  public boolean isValidRefreshToken(String token, UserDetails user) {
    final String email = getUsername(token);
    final Date expiration = extractClaim(token, Claims::getExpiration);
    boolean isExpired = expiration.before(new Date());

    return email.equals(user.getUsername()) && !isExpired;
  }
}