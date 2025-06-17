package com.example.clockee_server.auth.jwt;

import com.example.clockee_server.config.ApplicationProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/** JwtTokenProvider */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
  private final ApplicationProperties applicationProperties;

  public boolean isValidToken(String token, UserDetails userDetails) {

    final var email = getUsername(token);
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

  /**
   * @param user aka Principal/UserDetails after authentication process
   * @param claims additional information about subject
   */
  public String genenerateToken(UserDetails user, Map<? extends String, ? extends Object> claims) {
    String emailSubject = user.getUsername();
    Date issueAt = new Date(System.currentTimeMillis());
    // It can be overflow integer value
    Date expiredAt =
        new Date(
            System.currentTimeMillis() + applicationProperties.getJwtTokenExpMinutes() * 60 * 1000);
    String token =
        Jwts.builder()
            .claims()
            .subject(emailSubject)
            .issuedAt(issueAt)
            .expiration(expiredAt)
            .add(claims)
            .and()
            .signWith(getSignKey(), Jwts.SIG.HS256)
            .compact();
    return token;
  }

  private SecretKey getSignKey() {
    byte[] keybytes = Decoders.BASE64.decode(applicationProperties.getJwtSecretKey());
    return Keys.hmacShaKeyFor(keybytes);
  }

  // Create RefreshToken
  public String generateRefreshToken(UserDetails user) {
    Date issueAt = new Date(System.currentTimeMillis());
    // It can be overflow integer value
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
