package com.example.vietsneaker_server.auth.service;

import com.example.vietsneaker_server.auth.dto.CreateUserRequest;
import com.example.vietsneaker_server.auth.dto.JwtTokenResponse;
import com.example.vietsneaker_server.auth.dto.LoginRequest;
import com.example.vietsneaker_server.auth.dto.RefreshTokenResponse;
import com.example.vietsneaker_server.entity.User;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
  public void register(CreateUserRequest req);

  public JwtTokenResponse login(LoginRequest req, HttpServletResponse response);

  public RefreshTokenResponse refresh(String refreshToken, HttpServletResponse response);

  public void addRefreshTokenAsCookie(
      String cookieName, String token, HttpServletResponse response);

  public void clearRefreshTokenCookie(String refreshTokenCookieName, HttpServletResponse response);

  public void verify(Long userId, int tokenCode);

  public void sendVerificationEmail(User user);
}
