package com.example.vietsneaker_server.service.admin;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.UserMapper;
import com.example.vietsneaker_server.payload.dto.UserDetailResponse;
import com.example.vietsneaker_server.repository.UserRepository;

@RequiredArgsConstructor
@Service
public class AdminUserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;

  public Page<UserDetailResponse> getAllUsers(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userRepository.findAll(pageable);

    if (users.isEmpty()) {
      return Page.empty();
    }

    return users.map(user -> userMapper.userToUserDetailResponse(user));
  }

  public UserDetailResponse getUserById(Long id) {
    User user = getOrThrowUser(id);
    return userMapper.userToUserDetailResponse(user);
  }

  public Set<Role> getRolesByUserId(Long userId) {
    User user = getOrThrowUser(userId);
    return user.getRoles();
  }

  public void updateEnableStatus(Long id, boolean isEnabled) {
    User user = getOrThrowUser(id);

    user.setEnabled(isEnabled);

    userRepository.save(user);
  }

  private User getOrThrowUser(Long id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }
}
