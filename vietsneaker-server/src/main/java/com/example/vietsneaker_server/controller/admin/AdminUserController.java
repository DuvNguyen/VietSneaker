package com.example.vietsneaker_server.controller.admin;

import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.dto.UserDetailResponse;
import com.example.vietsneaker_server.service.admin.AdminUserService;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {
  @Autowired private AdminUserService adminUserService;

  // get all user with paging and no specification
  @GetMapping
  public ResponseEntity<PageResponse<UserDetailResponse>> getAllUsers(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    Page<UserDetailResponse> users = adminUserService.getAllUsers(page, size);

    return ResponseEntity.ok(new PageResponse<>(users));
  }

  // this function is to get user with id
  @GetMapping("/{id}")
  public ResponseEntity<UserDetailResponse> getUserById(@PathVariable Long id) {
    UserDetailResponse user = adminUserService.getUserById(id);
    return ResponseEntity.ok(user);
  }

  // this function is to get the user's role id, name, authorities timtimm
  @GetMapping("/{id}/roles")
  public ResponseEntity<Set<Role>> getRoleById(@PathVariable Long id) {
    Set<Role> roles = adminUserService.getRolesByUserId(id);
    return ResponseEntity.ok(roles);
  }

  @PatchMapping("/{id}/enabled")
  public ResponseEntity<String> updateUserEnableStatus(
      @PathVariable Long id, @RequestParam("isDeleted") Boolean isDeleted) {
    adminUserService.updateEnableStatus(id, isDeleted);
    return ResponseEntity.noContent().build();
  }
}
