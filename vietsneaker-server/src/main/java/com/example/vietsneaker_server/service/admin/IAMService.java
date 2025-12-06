package com.example.vietsneaker_server.service.admin;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.RoleName;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.MapperUtil;
import com.example.vietsneaker_server.mapper.UserMapper;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.request.CreateLoginRequest;
import com.example.vietsneaker_server.payload.request.SetPasswordRequest;
import com.example.vietsneaker_server.payload.request.UserRoleRequest;
import com.example.vietsneaker_server.payload.response.UserAccessDetailsResponse;
import com.example.vietsneaker_server.repository.RoleRepository;
import com.example.vietsneaker_server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class IAMService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserMapper userMapper;

  public PageResponse<UserAccessDetailsResponse> getAllUserAccess(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userRepository.findAllWithRoles(pageable);
    PageResponse<UserAccessDetailsResponse> usersPage =
        MapperUtil.mapPageResponse(users, userMapper::userToAccessDetails);
    return usersPage;
  }

  @Transactional
  public boolean toggleEnableStatus(Long userId) {
    User user = getOrThrowUser(userId);
    user.setEnabled(!user.getEnabled());
    User updatedUser = userRepository.save(user);
    return updatedUser.getEnabled();
  }

  private RoleName getRoleNameOrThrow(String roleString) {
    return getRole(roleString)
        .orElseThrow(
            () -> {
              throw new ApiException("ROLE_NOT_EXIST", 402, null);
            });
  }

  private User getOrThrowUser(Long id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  @Transactional
  public void addRole(UserRoleRequest newRoleRequest) {
    // Validate

    User user = getOrThrowUser(newRoleRequest.getUserId());
    // Validate enum
    RoleName role = getRoleNameOrThrow(newRoleRequest.getRole());
    // Validate role in database *_*
    Role newRole =
        roleRepository
            .findByRoleName(role)
            .orElseThrow(
                () -> {
                  return ApiException.builder().message("ROLE_NOT_EXIST").status(500).build();
                });

    user.addRole(newRole);
    userRepository.save(user);
  }

  @Transactional
  public void removeRole(UserRoleRequest removeRoleRequest) {
    // Validate

    User user = getOrThrowUser(removeRoleRequest.getUserId());
    // Validate enum
    RoleName role = getRoleNameOrThrow(removeRoleRequest.getRole());
    // Validate role in database *_*
    Role targetRemoveRole =
        roleRepository
            .findByRoleName(role)
            .orElseThrow(
                () -> {
                  return ApiException.builder().message("ROLE_NOT_EXIST").status(500).build();
                });

    user.removeRole(targetRemoveRole);
    userRepository.save(user);
  }

  private Optional<RoleName> getRole(String roleOrAuthority) {
    String authorityPrefix = "ROLE_";
    if (roleOrAuthority.startsWith(authorityPrefix)) {
      return convertToRoleName(roleOrAuthority.substring(authorityPrefix.length()));
    }
    return convertToRoleName(roleOrAuthority);
  }

  private Optional<RoleName> convertToRoleName(String roleStr) {
    return Arrays.stream(RoleName.values())
        .filter(
            role -> {
              return role.getName().equalsIgnoreCase(roleStr);
            })
        .findFirst();
  }

  public UserAccessDetailsResponse addLoginAccess(CreateLoginRequest loginRequest) {
    List<RoleName> roleNames =
        loginRequest.getRoles().stream()
            .map(
                (roleString) -> {
                  return getRoleNameOrThrow(roleString);
                })
            .collect(Collectors.toList());
    User user = new User(loginRequest);
    Set<Role> roles = roleRepository.findAllByRoleNameIn(roleNames);
    user.setRoles(roles);
    User savedUser = userRepository.save(user);
    return userMapper.userToAccessDetails(savedUser);
  }

  public UserAccessDetailsResponse getUserAccess(Long userId) {
    User user = getOrThrowUser(userId);
    return userMapper.userToAccessDetails(user);
  }

  public void setPassword(Long userId, SetPasswordRequest request) {
    User user = getOrThrowUser(userId);
    user.updatePassword(request.getNewPassword());
    userRepository.save(user);
  }
}
