package com.example.vietsneaker_server.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.vietsneaker_server.auth.dto.CreateUserRequest;
import com.example.vietsneaker_server.auth.dto.JwtTokenResponse;
import com.example.vietsneaker_server.auth.dto.LoginRequest;
import com.example.vietsneaker_server.auth.dto.RefreshTokenResponse;
import com.example.vietsneaker_server.auth.service.AuthenticationService;
import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
  private final AuthenticationService authService;

  @PostMapping("/login")
  public ResponseEntity<JwtTokenResponse> login(
      @RequestBody LoginRequest req, HttpServletResponse response) {
    JwtTokenResponse tokenResp = authService.login(req, response);
    return ResponseEntity.ok(tokenResp);
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody CreateUserRequest req) {
    authService.register(req);
    return ResponseEntity.ok().body(AppMessage.of(MessageKey.REGISTER_SUCCESS));
  }

  @GetMapping("/verify-email")
  public ResponseEntity<String> verifyEmail(
      @RequestParam("userId") Long userId, @RequestParam("token") int tokenCode) {
    authService.verify(userId, tokenCode);
    return ResponseEntity.accepted().build();
  }

  @GetMapping("/logout")
  public ResponseEntity<?> logoutUser(HttpServletResponse response) {
    authService.clearRefreshTokenCookie(ApplicationConstants.REFRESH_COOKIE_NAME, response);
    return ResponseEntity.accepted().build();
  }

  /**
   * FIX: Thay đổi từ @CookieValue sang @RequestParam để nhận token từ LocalStorage của Frontend gửi lên
   */
  @PostMapping("/refresh")
  public ResponseEntity<RefreshTokenResponse> refreshAccessToken(
      // PHẢI dùng @RequestParam vì Ảnh 15 Frontend gửi qua params
      @RequestParam(name = "refreshToken", required = false) String refreshToken, 
      HttpServletResponse response) {
      
      RefreshTokenResponse resp = authService.refresh(refreshToken, response);
      return ResponseEntity.ok(resp);
  }
}