package com.example.clockee_server.controller.user;

import com.example.clockee_server.auth.annotation.CurrentUser;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.payload.request.ChangePasswordRequest;
import com.example.clockee_server.payload.request.UpdateUserDetailsRequest;
import com.example.clockee_server.payload.response.CurrentUserDetails;
import com.example.clockee_server.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** UserController */
@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PreAuthorize("isAuthenticated()")
  @GetMapping
  public ResponseEntity<CurrentUserDetails> currentUserDetails(@CurrentUser User user) {
    CurrentUserDetails userDetails = userService.currentUserDetails(user);
    return ResponseEntity.ok(userDetails);
  }

  @PreAuthorize("isAuthenticated()")
  @PutMapping
  public ResponseEntity<?> updateUserDetails(
      @CurrentUser User user, @Valid @RequestBody UpdateUserDetailsRequest details) {
    userService.updateUserDetails(user, details);
    return ResponseEntity.accepted().build();
  }

  @PreAuthorize("isAuthenticated()")
  @PutMapping("/change-password")
  public ResponseEntity<?> changePassword(
      @CurrentUser User user, @Valid @RequestBody ChangePasswordRequest request) {
    userService.changePassword(user, request);
    return ResponseEntity.accepted().build();
  }

  @PutMapping("/resend-verification")
  public ResponseEntity<?> resendVerificationEmail(@CurrentUser User user) {
    userService.resendVerificationEmail(user);
    return ResponseEntity.accepted().build();
  }
}
