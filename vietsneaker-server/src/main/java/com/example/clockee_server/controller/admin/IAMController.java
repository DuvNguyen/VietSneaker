package com.example.clockee_server.controller.admin;

import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.payload.PageResponse;
import com.example.clockee_server.payload.request.CreateLoginRequest;
import com.example.clockee_server.payload.request.SetPasswordRequest;
import com.example.clockee_server.payload.request.UserRoleRequest;
import com.example.clockee_server.payload.response.UserAccessDetailsResponse;
import com.example.clockee_server.service.admin.IAMService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// @Tag(name = "IAM", description = "Manager user access (admin/user login) in system")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = ApplicationConstants.ADMIN_URL_PREFIX + "/iam")
public class IAMController {
  private final IAMService iamService;

  @Operation(summary = "Change enable status of user (block user)")
  @PatchMapping("/{userId}/enabled")
  public ResponseEntity<Boolean> toggleUserEnableStatus(@PathVariable Long userId) {
    boolean newStatus = iamService.toggleEnableStatus(userId);
    return ResponseEntity.ok(newStatus);
  }

  @Operation(summary = "Add user role")
  @PostMapping("roles")
  public ResponseEntity<?> addRole(@RequestBody UserRoleRequest newRoleRequest) {
    iamService.addRole(newRoleRequest);
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "Remove user role")
  @DeleteMapping("roles")
  public ResponseEntity<?> removeRole(@RequestBody UserRoleRequest roleRequest) {
    iamService.removeRole(roleRequest);
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "Create new login with roles like: CUSTOMER, ADMIN_PRODUCT, etc for system")
  @PostMapping("/login")
  public ResponseEntity<UserAccessDetailsResponse> addLoginAccess(
      @RequestBody CreateLoginRequest loginRequest) {
    UserAccessDetailsResponse resp = iamService.addLoginAccess(loginRequest);
    return ResponseEntity.ok(resp);
  }

  @Operation(summary = "Get user access information for all user")
  @GetMapping
  private ResponseEntity<PageResponse<UserAccessDetailsResponse>> getAllAccess(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    PageResponse<UserAccessDetailsResponse> users = iamService.getAllUserAccess(page, size);
    return ResponseEntity.ok(users);
  }

  @Operation(summary = "Get user access information for specific user")
  @GetMapping("/{userId}")
  private ResponseEntity<UserAccessDetailsResponse> getUserAccess(@PathVariable Long userId) {
    UserAccessDetailsResponse users = iamService.getUserAccess(userId);
    return ResponseEntity.ok(users);
  }

  @Operation(summary = "Set password for user")
  // Change password
  @PostMapping("/{userId}/set-password")
  public ResponseEntity<?> setPassword(
      @PathVariable Long userId, @Valid @RequestBody SetPasswordRequest request) {
    iamService.setPassword(userId, request);
    return ResponseEntity.accepted().build();
  }
}
