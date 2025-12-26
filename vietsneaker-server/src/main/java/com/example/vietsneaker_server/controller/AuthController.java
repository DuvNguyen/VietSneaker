package com.example.vietsneaker_server.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.auth.dto.CreateUserRequest;
import com.example.vietsneaker_server.auth.dto.JwtTokenResponse;
import com.example.vietsneaker_server.auth.dto.LoginRequest;
import com.example.vietsneaker_server.auth.dto.RefreshTokenResponse;
import com.example.vietsneaker_server.auth.service.AuthenticationService;
import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "https://4.241.131.190", allowCredentials = "true")
/** AuthController */
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
    // Clear cookie
    authService.clearRefreshTokenCookie(ApplicationConstants.REFRESH_COOKIE_NAME, response);
    return ResponseEntity.accepted().build();
  }

  @PostMapping("/refresh")
  public ResponseEntity<RefreshTokenResponse> refreshAccessToken(
      @CookieValue(
          name = ApplicationConstants.REFRESH_COOKIE_NAME,
          required = false
      ) String refreshToken,
      HttpServletResponse response) {

    // ✅ CHẶN LỖI NGAY TỪ CONTROLLER
    if (refreshToken == null) {
      return ResponseEntity.status(401).build();
    }

    RefreshTokenResponse resp = authService.refresh(refreshToken, response);
    return ResponseEntity.ok(resp);
  }

  // public ResponseEntity<?> sendResetPassword(){
  // }
}
